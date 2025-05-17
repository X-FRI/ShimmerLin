import {
  AiComminicate,
  AiComminicateMessage,
} from "../../domain/model/ai-comminicate.model";
import { APIModel } from "../../domain/model/api-model.model";
import { AiComminicateMessage as PrismaAiComminicateMessage } from "@prisma/generated/autumn-core";

export class PrismaAiComminicateMessageMapper {
  public static toPersistence(
    aicomminicateMessage: AiComminicateMessage,
  ): PrismaAiComminicateMessage {
    return {
      id: aicomminicateMessage.id,
      prompt: aicomminicateMessage.props.prompt,
      modelId: aicomminicateMessage.props.modelId,
      response: aicomminicateMessage.props.response,
      createdAt: aicomminicateMessage.props.createdAt,
      updatedAt: aicomminicateMessage.props.updatedAt,
    };
  }

  public static toDomain(
    prismaAiComminicateMessage: PrismaAiComminicateMessage,
  ): AiComminicateMessage {
    return AiComminicateMessage.create({
      prompt: prismaAiComminicateMessage.prompt,
      modelId: prismaAiComminicateMessage.modelId,
      response: prismaAiComminicateMessage.response?.toString() ?? "",
    });
  }
}
