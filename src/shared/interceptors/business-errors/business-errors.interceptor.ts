import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, catchError } from 'rxjs';
import { BusinessError } from 'src/shared/errors/business-errors';

@Injectable()
export class BusinessErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        if (error.type === undefined) {
          throw error;
        }
        switch (error.type) {
          case BusinessError.NOT_FOUND:
            throw new HttpException(error.message, HttpStatus.NOT_FOUND);
          case BusinessError.PRECONDITION_FAILED:
            throw new HttpException(
              error.message,
              HttpStatus.PRECONDITION_FAILED,
            );
          case BusinessError.BAD_REQUEST:
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
          default:
            throw new HttpException(
              error.message,
              HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
      }),
    );
  }
}
