import { Prisma } from "@prisma/generated/autumn-core";
import { ApiProperty } from "@nestjs/swagger";

export class GetAllModelQueryModel {
  @ApiProperty({
    description: "The id of the api model",
    type: String,
  })
  public readonly id: string;

  @ApiProperty({
    description: "The name of the api model",
    type: String,
  })
  public readonly name: string;

  @ApiProperty({
    description: "The model of the api model",
    type: String,
  })
  public readonly model: string;

  @ApiProperty({
    description: "The base url of the api model",
    type: String,
  })
  public readonly baseUrl: string;

  public static fromPersistence(
    apiModel: Prisma.ApiModelGetPayload<{
      select: {
        id: true;
        name: true;
        model: true;
        baseUrl: true;
      };
    }>,
  ): GetAllModelQueryModel {
    return {
      id: apiModel.id,
      name: apiModel.name,
      model: apiModel.model,
      baseUrl: apiModel.baseUrl,
    };
  }
}
