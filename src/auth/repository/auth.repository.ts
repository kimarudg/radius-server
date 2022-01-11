import { UserModel } from './../models/user.model';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(UserModel)
export class AuthRepository extends Repository<UserModel> {
  findById(id: string) {
    return this.findOne({ where: { id } });
  }

  findByEmail(email: string) {
    return this.createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();
  }

  getPaginatedRoles(skip, take) {
    return this.findAndCount({
      skip,
      take,
    });
  }
}
