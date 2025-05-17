import { Global, Module } from "@nestjs/common";
import { AutumnCoreClientService } from "./autumn-core-client/autumn-core-client.service";

@Global()
@Module({
  exports: [AutumnCoreClientService],
  providers: [AutumnCoreClientService],
})
export class PrismaModule {}
