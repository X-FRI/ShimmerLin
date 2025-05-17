import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function setup(app: INestApplication) {

  if (process.env.NODE_ENV !== "production") {
    // 设置 Swagger
    const config = new DocumentBuilder()
      .setTitle("autumn-core")
      .setDescription("autumn-core API")
      .setVersion("0.1")
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);

    // 设置 Swagger 路由为 /api-docs
    SwaggerModule.setup("api-docs", app, document, {
      jsonDocumentUrl: "api-docs/json",
    });
  }
}
