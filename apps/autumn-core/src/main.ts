import { NestFactory } from "@nestjs/core";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { AppModule } from "./modules/app.module";
import { setup } from "./setup";
import { ConfigService } from "@nestjs/config";
import { GlobalExceptionFilter } from "./modules/infrastructure/filters/http-exception.filter";
import { LoggingService } from "./modules/infrastructure/logging/logging.service";
import { LoggingInterceptor } from "./modules/infrastructure/interceptors/logging.interceptor";

const DEFAULT_PORT = 3001;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });

  const configService = app.get(ConfigService);
  const port = configService.get("BACKEND_PORT") || DEFAULT_PORT;
  const logger = app.get(LoggingService);

  app.useGlobalInterceptors(new LoggingInterceptor(logger));
  app.useGlobalFilters(new GlobalExceptionFilter(logger));

  setup(app);

  await app.listen(port);

  const loggerService = app.get(WINSTON_MODULE_PROVIDER);
  loggerService.info(`Autumn Core started on port: ${port} `);
}

bootstrap();
