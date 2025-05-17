// nestjs repl mode

import { repl } from "@nestjs/core";
import { AppModule } from "./modules/app.module";

async function bootstrap() {
  await repl(AppModule);
}

bootstrap();
