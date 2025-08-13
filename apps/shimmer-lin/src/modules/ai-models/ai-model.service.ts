import { readFile } from "node:fs/promises";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CommandBus, EventPublisher, QueryBus } from "@nestjs/cqrs";
import { LoggingService } from "@src/modules/infrastructure/logging/logging.service";
import { API_MODEL_REPOSITORY } from "./ai-model.constants";
import { FastTextCompletionCommand } from "./application/command";
import { FastTextCompletionResponse } from "./application/command/fast-text-completion.command";
import { FastTextCompletionRequest } from "./application/command/fast-text-completion.command";
import { GetAllModelQuery } from "./application/query";
import { GetAllModelQueryModel } from "./application/query/model/get-all-model.model";
import { APIModelCreatedEvent } from "./domain/event/api-model-created.event";
import { APIModel, APIModelCreateProps } from "./domain/model/api-model.model";
import { APIModelRepository } from "./domain/repository/api-model.repository";

/**
 * Load api model from config file and save to database on module init
 * If the api model already exists in the database, it will be skipped, if not, it will be created.
 */
@Injectable()
export class APIModelLoaderService {
  constructor(
    @Inject(API_MODEL_REPOSITORY)
    private readonly apiModelRepository: APIModelRepository,
    private readonly configService: ConfigService,
    private readonly eventPublisher: EventPublisher,
    private readonly logger: LoggingService,
  ) {}

  public async loadAPIModel() {
    this.logger.info("Loading API model");

    const config = this.configService.get("API_MODEL_LIST");
    if (!config) throw new NotFoundException("API_MODEL_LIST is not set");

    return readFile(config, "utf-8")
      .then((res) => JSON.parse(res) as APIModelCreateProps[])
      .then(async (res) => {
        for (const configApiModel of res) {
          const model = this.eventPublisher.mergeObjectContext(
            APIModel.create(configApiModel),
          );

          const existingModel = await this.apiModelRepository.findByCode(
            model.props.model,
          );

          if (existingModel?.isSameModel(model)) {
            this.logger.info("API model already exists", {
              model: model.props.model,
            });

            continue;
          }

          this.apiModelRepository.save(model);

          model.apply(new APIModelCreatedEvent(model));
          model.commit();
        }
      });
  }
}

@Injectable()
export class AIModelService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  /**
   * Get all api models
   * @returns GetAllModelQueryModel[]
   * @see GetAllModelQueryModel
   */
  public async getAllModel(): Promise<GetAllModelQueryModel[]> {
    return this.queryBus.execute(new GetAllModelQuery());
  }
}

@Injectable()
export class AIcomminicateService {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  public async fastTextCompletion(
    body: FastTextCompletionRequest,
  ): Promise<FastTextCompletionResponse> {
    return this.commandBus.execute(new FastTextCompletionCommand(body));
  }
}
