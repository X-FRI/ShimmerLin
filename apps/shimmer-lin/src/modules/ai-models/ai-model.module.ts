import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { CqrsModule } from "@nestjs/cqrs";
import { AIModelController } from "./ai-model.controller";
import {
  AIModelService,
  AIcomminicateService,
  APIModelLoaderService,
} from "./ai-model.service";
import { COMMAND_HANDLERS } from "./application/command";
import { AI_MODEL_QUERY_HANDLERS } from "./application/query";
import { EVENT_HANDLERS } from "./domain/event";
import { INFRASTRUCTURE } from "./infrastructure";

@Module({
  imports: [CqrsModule, ConfigModule],
  providers: [
    APIModelLoaderService,
    AIModelService,
    AIcomminicateService,
    ...EVENT_HANDLERS,
    ...AI_MODEL_QUERY_HANDLERS,
    ...COMMAND_HANDLERS,
    ...INFRASTRUCTURE,
  ],
  exports: [AIModelService],
  controllers: [AIModelController],
})
export class AIModelsModule {
  constructor(private readonly apiModelLoader: APIModelLoaderService) {}

  onModuleInit() {
    this.apiModelLoader.loadAPIModel();
  }
}
