import { IQuery, IQueryHandler, QueryHandler } from "@nestjs/cqrs";

import { LoggingService } from "@src/modules/infrastructure/logging/logging.service";
import { ShimmerLinClientService } from "@src/modules/prisma/shimmer-lin-client/shimmer-lin-client.service";
import { GetAllModelQueryModel } from "./model/get-all-model.model";

export class GetAllModelQuery implements IQuery {}

@QueryHandler(GetAllModelQuery)
export class GetAllModelQueryHandler
  implements IQueryHandler<GetAllModelQuery>
{
  constructor(
    private readonly logger: LoggingService,
    private readonly shimmerLinClient: ShimmerLinClientService,
  ) {}

  async execute(query: GetAllModelQuery) {
    const apiModels = await this.shimmerLinClient.apiModel.findMany({
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
