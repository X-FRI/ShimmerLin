import { Injectable } from "@nestjs/common";
import { AiComminicateRepository } from "../../domain/repository/ai-comminicate.repository";

import { ShimmerLinClientService } from "@src/modules/prisma/shimmer-lin-client/shimmer-lin-client.service";
import {
  AiComminicate,
  AiComminicateMessage,
} from "../../domain/model/ai-comminicate.model";
import { PrismaAiComminicateMapper } from "../mapper/prisma-ai-comminicate.mapper";

@Injectable()
export class PrismaAiComminicateRepository implements AiComminicateRepository {
  constructor(private readonly prisma: ShimmerLinClientService) {}

  public async save(aiComminicate: AiComminicate): Promise<AiComminicate> {
    const prismaAiComminicate =
      PrismaAiComminicateMapper.toPersistence(aiComminicate);

    return this.prisma.$transaction(async (tx) => {
      // Currently just deleting the original history and re-saving the aggregate root,
      // This can cause database IO bottlenecks when there are a lot of messages,
      // NOTE: Since the result of a rebuild at the root of an aggregation is the
      //       state of the aggregation in the database at the time of the rebuild,
      //       theoretically if the contextId is only used by one conversation,
      //       there will be no problem with data loss or mismatch.
      await tx.aiComminicateMessage.deleteMany({
        where: {
          contextId: {
            in: prismaAiComminicate.map((message) => message.contextId),
          },
        },
      });

      const savedAiComminicateMessage =
        await tx.aiComminicateMessage.createMany({
          data: prismaAiComminicate,
        });

      if (savedAiComminicateMessage.count !== prismaAiComminicate.length)
        throw new Error(
          `Failed to save aiComminicateMessage, count: ${savedAiComminicateMessage.count}, expected: ${prismaAiComminicate.length}`,
        );

      const aiComminicateMessages = await tx.aiComminicateMessage.findMany({
        where: {
          contextId: {
            in: prismaAiComminicate.map((message) => message.contextId),
          },
        },
      });

      const apiModel = await tx.apiModel.findUnique({
        where: {
          id: aiComminicate.props.model.id,
        },
      });

      if (!apiModel) {
        throw new Error(
          `API model not found, apiModelId: ${aiComminicate.props.model.id}`,
        );
      }

      return PrismaAiComminicateMapper.toDomain(
        aiComminicateMessages,
        apiModel,
      );
    });
  }

  public async findById(contextId: string): Promise<AiComminicate> {
    return this.prisma.$transaction(async (tx) => {
      const aiComminicateMessages = await tx.aiComminicateMessage.findMany({
        where: {
          contextId,
        },
      });

      const apiModel = await tx.apiModel.findUnique({
        where: {
          id: aiComminicateMessages[0].apiModelId,
        },
      });

      if (!apiModel) {
        throw new Error(
          `API model not found, apiModelId: ${aiComminicateMessages[0].apiModelId}`,
        );
      }

      return PrismaAiComminicateMapper.toDomain(
        aiComminicateMessages,
        apiModel,
      );
    });
  }
}
