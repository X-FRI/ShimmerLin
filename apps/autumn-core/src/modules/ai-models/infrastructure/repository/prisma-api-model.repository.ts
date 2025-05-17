import { Injectable, NotFoundException } from "@nestjs/common";
import { APIModel } from "../../domain/model/api-model.model";
import { APIModelRepository } from "../../domain/repository/api-model.repository";
import { PrismaAPIModelMapper } from "../mapper/prisma-api-model.mapper";
import { AutumnCoreClientService } from "@src/modules/prisma";

@Injectable()
export class PrismaAPIModelRepository implements APIModelRepository {
  constructor(private readonly prisma: AutumnCoreClientService) {}

  public async findByCode(code: string): Promise<APIModel | null> {
    const apiModel = await this.prisma.apiModel.findUnique({
      where: { model: code },
    });

    return apiModel ? PrismaAPIModelMapper.toDomain(apiModel) : null;
  }

  public async save(apiModel: APIModel): Promise<APIModel> {
    const savedApiModel = await this.prisma.apiModel.upsert({
      where: { model: apiModel.props.model },
      update: PrismaAPIModelMapper.toPersistence(apiModel),
      create: PrismaAPIModelMapper.toPersistence(apiModel),
    });

    return PrismaAPIModelMapper.toDomain(savedApiModel);
  }

  public async findAll(): Promise<APIModel[]> {
    const apiModels = await this.prisma.apiModel.findMany();
    return apiModels.map(PrismaAPIModelMapper.toDomain);
  }

  public async findById(id: string): Promise<APIModel | null> {
    const apiModel = await this.prisma.apiModel.findUnique({
      where: { id },
    });
    return apiModel ? PrismaAPIModelMapper.toDomain(apiModel) : null;
  }
}
