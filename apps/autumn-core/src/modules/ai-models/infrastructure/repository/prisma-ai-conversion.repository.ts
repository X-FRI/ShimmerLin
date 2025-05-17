import { Injectable } from "@nestjs/common";
import { AiComminicateMessageRepository } from "../../domain/repository/ai-comminicate.repository";
import { AutumnCoreClientService } from "@src/modules/prisma";
import { AiComminicateMessage } from "../../domain/model/ai-comminicate.model";
import { PrismaAiComminicateMessageMapper } from "../mapper/prisma-ai-comminicate.mapper";
import { InputJsonValue } from "@prisma/client/runtime/library";

@Injectable()
export class PrismaAiComminicateMessageRepository
  implements AiComminicateMessageRepository
{
  constructor(private readonly prisma: AutumnCoreClientService) {}

  public async save(
    aiComminicateMessage: AiComminicateMessage,
  ): Promise<AiComminicateMessage> {
    const prismaAiComminicateMessage =
      PrismaAiComminicateMessageMapper.toPersistence(aiComminicateMessage);

    const savedAiComminicateMessage =
      await this.prisma.aiComminicateMessage.create({
        data: {
          ...prismaAiComminicateMessage,
          response: prismaAiComminicateMessage.response as InputJsonValue,
        },
      });

    return PrismaAiComminicateMessageMapper.toDomain(savedAiComminicateMessage);
  }
}
