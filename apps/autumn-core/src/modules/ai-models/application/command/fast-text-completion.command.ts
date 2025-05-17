import { Command, CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { APIModelRepository } from "../../domain/repository/api-model.repository";
import { Inject, NotFoundException } from "@nestjs/common";
import {
  AI_comminicate_MESSAGE_API,
  API_MODEL_REPOSITORY,
} from "../../ai-model.constants";
import { AIComminicateMessageApi } from "../../domain/api/ai-comminicate.api";
import { ApiProperty } from "@nestjs/swagger";
import { EventPublisher } from "@nestjs/cqrs";
import { FastTextCompletionCreatedEvent } from "../../domain/event";

export class FastTextCompletionRequest {
  @ApiProperty({
    description: "The model id",
    type: String,
  })
  public readonly modelId: string;

  @ApiProperty({
    description: "The model",
    type: String,
  })
  public readonly model: string;

  @ApiProperty({
    description: "The prompt",
    type: String,
  })
  public readonly prompt: string;
}

export class FastTextCompletionResponse {
  @ApiProperty({
    description: "The response from the AI model",
    type: String,
  })
  public readonly response: string;

  @ApiProperty({
    description: "The prompt from the user",
    type: String,
  })
  public readonly prompt: string;
}

export class FastTextCompletionCommand extends Command<FastTextCompletionResponse> {
  constructor(public readonly body: FastTextCompletionRequest) {
    super();
  }
}

@CommandHandler(FastTextCompletionCommand)
export class FastTextCompletionCommandHandler
  implements ICommandHandler<FastTextCompletionCommand>
{
  constructor(
    @Inject(AI_comminicate_MESSAGE_API)
    private readonly aiComminicateMessageApi: AIComminicateMessageApi,
    @Inject(API_MODEL_REPOSITORY)
    private readonly apiModelRepository: APIModelRepository,
    private readonly eventPublisher: EventPublisher,
  ) {}

  async execute(
    command: FastTextCompletionCommand,
  ): Promise<FastTextCompletionResponse> {
    const { modelId, model, prompt } = command.body;

    const apiModel = await this.apiModelRepository
      .findById(modelId)
      .then((apiModel) => {
        if (!apiModel) {
          throw new NotFoundException(
            `API model not found, modelId: ${modelId}`,
          );
        }

        return this.eventPublisher.mergeObjectContext(apiModel);
      });

    const aiComminicateMessage = this.eventPublisher.mergeObjectContext(
      await this.aiComminicateMessageApi.fastTextCompletion(
        apiModel,
        model,
        prompt,
      ),
    );

    aiComminicateMessage.apply(
      new FastTextCompletionCreatedEvent(aiComminicateMessage),
    );

    return {
      response: aiComminicateMessage.props.response,
      prompt: aiComminicateMessage.props.prompt,
    };
  }
}
