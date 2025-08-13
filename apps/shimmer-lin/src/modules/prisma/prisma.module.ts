import { Global, Module } from "@nestjs/common";
import { ShimmerLinClientService } from "./shimmer-lin-client/shimmer-lin-client.service";

@Global()
@Module({
  exports: [ShimmerLinClientService],
  providers: [ShimmerLinClientService],
})
export class PrismaModule {}
