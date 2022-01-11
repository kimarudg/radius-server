import { UserInput } from './../../validators/user.validators';
import { UserModel } from './../../models/user.model';
import { AuthRepository } from './../../repository/auth.repository';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { validateInput, validateOutput } from '../../../core/validators';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { EntityManager } from 'typeorm';
import { TYPES } from '../../../types';

@Injectable()
export class AuthService {
  private saltRounds = 10;
  public readonly repository: AuthRepository;

  constructor(
    @Inject(TYPES.EntityManager) private manager: EntityManager,
    private readonly jwtService: JwtService,
  ) {
    this.repository = this.manager.getCustomRepository(AuthRepository);
  }

  async save(user: UserModel): Promise<UserModel> {
    await validateInput(user, true);
    const saved = await this.repository.save(user);
    await validateOutput(saved, true);
    return saved;
  }

  async createUser(newUser: UserInput): Promise<UserModel | null> {
    const { email, phone, profile, password } = newUser;

    const hash = await this.getHash(password);

    const user = new UserModel();
    user.email = email;
    user.phone = phone;
    user.passwordHash = hash;
    user.profile = profile;

    await validateInput(user, true);

    let saved;
    try {
      saved = await this.repository.save(user);
    } catch (error) {
      console.log(error);
      throw new Error(error.detail);
    }
    await validateOutput(saved, true);
    return saved;
  }

  async loginUser(email: string, pass: string): Promise<any> {
    const user: UserModel = await this.validateUser(email, pass);
    if (!user || !user.active) {
      throw new UnauthorizedException();
    }
    // if (!user.confirmed) { fe to extract token, and regenerate email
    if (user.needPasswordChange) {
      const accessToken = await this.signOneTimePayload(user);
      const { passwordHash, ...result } = user;
      return { ...result, accessToken };
    }
    return await this.sign(user);
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.repository.findByEmail(email);
    // if not confirmed, no access token
    if (user && (await this.compareHash(pass, user.passwordHash))) {
      const ping = new Date();
      const loginCount = user.loginCount + 1;
      this.repository.update(user.id, {
        lastLogin: ping,
        lastSeen: ping,
        loginCount,
      });
      const { passwordHash, ...result } = user;
      return result;
    }
    return null;
  }

  async compareHash(
    password: string | undefined,
    hash: string | undefined,
  ): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async signOneTimePayload(user: UserModel, expiresIn = '24h') {
    const payload = { username: user.email, sub: user.id, aud: 'pass' };
    return this.jwtService.sign(payload, { expiresIn });
  }

  async sign(user: UserModel) {
    const payload = { username: user.email, sub: user.id };
    return {
      ...user,
      accessToken: this.jwtService.sign(payload),
    };
  }

  async getHash(password: string | undefined): Promise<string> {
    return bcrypt.hash(password, this.saltRounds);
  }
}
