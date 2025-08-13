import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { v7 as uuidv7 } from "uuid";
import { LoggingService } from "../logging/logging.service";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const { path, method } = request;
    const uuid = uuidv7();
    request["x-request-id"] = uuid;
    const now = Date.now();

    this.logger.info(`${method} ${path}`, {
      id: uuid,
      params: request.params,
      query: request.query,
      body: request.body,
    });

    return next.handle().pipe(
      tap((response) => {
        const duration = Date.now() - now;
        this.logger.debug(`${uuid} - SUCCESS ${duration}ms`, response);
      }),
    );
  }
}
