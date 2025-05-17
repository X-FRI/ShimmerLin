import { IQuery, IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { LoggingService } from "@src/modules/infrastructure/logging/logging.service";
import { AutumnCoreClientService } from "@src/modules/prisma";
import { GetAllModelQueryModel } from "./model/get-all-model.model";

export class GetAllModelQuery implements IQuery {}

@QueryHandler(GetAllModelQuery)
export class GetAllModelQueryHandler
  implements IQueryHandler<GetAllModelQuery>
{
  constructor(
    private readonly logger: LoggingService,
    private readonly autumnCoreClient: AutumnCoreClientService,
  ) {}

  async execute(query: GetAllModelQuery) {
    const apiModels = await this.autumnCoreClient.apiModel.findMany({
      select: {
        id: true,
        name: true,
        model: true,
        baseUrl: true,
      },
    });

    return apiModels.map(GetAllModelQueryModel.fromPersistence);
  }
}
