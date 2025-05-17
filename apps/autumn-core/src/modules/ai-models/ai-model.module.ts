import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { EVENT_HANDLERS } from "./domain/event";
import {
  AIcomminicateService,
  AIModelService,
  APIModelLoaderService,
} from "./ai-model.service";
import { ConfigModule } from "@nestjs/config";
import { AI_MODEL_QUERY_HANDLERS } from "./application/query";
import { AIModelController } from "./ai-model.controller";
import { COMMAND_HANDLERS } from "./application/command";
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
