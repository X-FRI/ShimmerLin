import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function setup(app: INestApplication) {
  if (process.env.NODE_ENV !== "production") {
    // Setup Swagger
    const config = new DocumentBuilder()
      .setTitle("shimmer-lin")
      .setDescription("shimmer-lin API")
      .setVersion("0.1")
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup("api-docs", app, document, {
      jsonDocumentUrl: "api-docs/json",
    });
  }
}
