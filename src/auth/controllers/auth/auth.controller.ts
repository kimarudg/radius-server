import { AuthService } from './../../services/auth/auth.service';
import { UserInput } from './../../validators/user.validators';
import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}
  @Post('create')
  async createUser(
    @Body(new ValidationPipe({ transform: true })) user: UserInput,
  ) {
    return this.service.createUser(user);
  }

  // @Post('new/:event')
  // async handleEvent(
  //   @Body(new ValidationPipe({ transform: true }))
  //   body: EventDto,
  //   @Res() res: Response,
  // ): Promise<Response> {
  //   let payload: IGreenhouseTasksPayload;
  //   try {
  //     payload = await this.greenhouseService.validateAndFilter(event, body);
  //   } catch (error) {
  //     this.logger.error(error.message);
  //     throw new UnprocessableEntityException(error);
  //   }

  //   if (!payload) {
  //     // return early for irrelevant jobs and stages
  //     return res.status(200).send('skipped irrelevant job or stage');
  //   } else {
  //     const action = payload.engLevel ? 'network_level_update' : body.action;
  //     const message = await this.tasks.queue(action, payload);
  //     return res.status(202).send(message);
  //   }
  // }
}
