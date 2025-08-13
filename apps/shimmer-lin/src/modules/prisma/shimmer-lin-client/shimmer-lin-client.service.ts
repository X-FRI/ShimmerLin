import { Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "prisma/generated/shimmer-lin";

@Injectable()
export class ShimmerLinClientService
  extends PrismaClient
  implements OnModuleInit
{
  async onModuleInit() {
    await this.$connect();
  }
}
