import {
  AiComminicate,
  AiComminicateMessage,
  AiComminicateMessageRole,
} from "../../domain/model/ai-comminicate.model";
import { AiComminicateMessage as PrismaAiComminicateMessage } from "@prisma/generated/autumn-core";
import { ApiModel as PrismaApiModel } from "@prisma/generated/autumn-core";
import { PrismaAPIModelMapper } from "./prisma-api-model.mapper";

export class PrismaAiComminicateMapper {
  public static toPersistence(
    aicomminicate: AiComminicate,
  ): PrismaAiComminicateMessage[] {
    return aicomminicate.props.messages.map((message) => ({
      id: message.id,
      role: message.props.role,
      content: message.props.content,
      model: message.props.model,
      contextId: message.props.contextId,
      apiModelId: aicomminicate.props.model.id,
      createdAt: message.props.createdAt,
      updatedAt: message.props.updatedAt,
    }));
  }

  public static toDomain(
    prismaAiComminicateMessages: PrismaAiComminicateMessage[],
    prismaApiModel: PrismaApiModel,
  ): AiComminicate {
    return AiComminicate.create({
      model: PrismaAPIModelMapper.toDomain(prismaApiModel),

      messages: prismaAiComminicateMessages.map((message) => {
        if (
          AiComminicateMessageRole.includes(
            message.role as AiComminicateMessageRole,
          )
        ) {
          return AiComminicateMessage.reconstitute(message.id, {
            role: message.role as AiComminicateMessageRole,
            content: message.content,
            model: message.model,
            contextId: message.contextId,
            createdAt: message.createdAt,
            updatedAt: message.updatedAt,
          });
        }

        throw new Error(`Invalid message role: ${message.role}`);
      }),
    });
  }
}
