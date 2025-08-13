import { ApiModel as PrismaAPIModel } from "@prisma/generated/shimmer-lin";
import { APIModel } from "../../domain/model/api-model.model";

export class PrismaAPIModelMapper {
  public static toDomain(prismaApiModel: PrismaAPIModel): APIModel {
    return APIModel.reconstitute(prismaApiModel.id, {
      name: prismaApiModel.name,
      model: prismaApiModel.model,
      baseUrl: prismaApiModel.baseUrl,
      apiKey: prismaApiModel.apiKey,
      createdAt: prismaApiModel.createdAt,
      updatedAt: prismaApiModel.updatedAt,
    });
  }

  public static toPersistence(apiModel: APIModel): PrismaAPIModel {
    return {
      id: apiModel.id,
      name: apiModel.props.name,
      model: apiModel.props.model,
      baseUrl: apiModel.props.baseUrl,
      apiKey: apiModel.props.apiKey,
      createdAt: apiModel.props.createdAt,
      updatedAt: apiModel.props.updatedAt,
    };
  }
}
