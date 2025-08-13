import { Module } from "@nestjs/common";
import { ConfigModule, ConfigModuleOptions } from "@nestjs/config";
import { ScheduleModule as NestScheduleModule } from "@nestjs/schedule";
import { AIModelsModule } from "./ai-models/ai-model.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { LoggingModule } from "./infrastructure/logging/logging.module";
import { PrismaModule } from "./prisma/prisma.module";

const envMap: Record<string, ConfigModuleOptions> = {
  development: { envFilePath: ".env.dev" },
  dev: { envFilePath: ".env.dev" },
  staging: { envFilePath: ".env.staging" },
  prod: { envFilePath: ".env.prod" },
  production: { envFilePath: ".env.prod" },
};

const isDocker = process.env.BUILD_ENV === "docker";
const env = process.env.DEPLOY_ENV || "";

const configModuleOptions: ConfigModuleOptions = isDocker
  ? { ignoreEnvFile: true }
  : envMap[env] || {};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ...configModuleOptions,
    }),
    NestScheduleModule.forRoot(),
    LoggingModule,
    PrismaModule,
    AIModelsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
