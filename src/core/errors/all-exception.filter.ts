import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { TYPES } from '../../types';
import { InvalidParameterError } from './invalid-parameter.error';
import { PermissionError } from './permission.error';
import { ResourceNotFoundError } from './resource-not-found.error';

@Catch(InvalidParameterError, PermissionError, ResourceNotFoundError)
export class AllExceptionFilter implements ExceptionFilter {
  catch(error: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const status = TYPES.ERROR_CODES[error.name]
      ? TYPES.ERROR_CODES[error.name]
      : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: error.message,
    });
  }
}
