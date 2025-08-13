import { Body, Controller, Get, Post } from "@nestjs/common";
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";
import { AIModelService, AIcomminicateService } from "./ai-model.service";
import {
  FastTextCompletionRequest,
  FastTextCompletionResponse,
} from "./application/command/fast-text-completion.command";
import { GetAllModelQueryModel } from "./application/query/model/get-all-model.model";

@Controller("ai-model")
@ApiTags("AI Model")
export class AIModelController {
  constructor(
    private readonly aiModelService: AIModelService,
    private readonly aicomminicateService: AIcomminicateService,
  ) {}

  @Get("all-models")
  @ApiOperation({ summary: "Get all api models" })
  @ApiOkResponse({
    description: "The list of all api models",
    type: GetAllModelQueryModel,
  })
  async getAllModel() {
    return this.aiModelService.getAllModel();
  }

  @Post("fast-text-completion")
  @ApiOperation({ summary: "Get fast text completion" })
  @ApiOkResponse({
    description: "The fast text completion",
    type: FastTextCompletionResponse,
  })
  @ApiNotFoundResponse({
    description: "The model not found",
  })
  @ApiBody({
    type: FastTextCompletionRequest,
  })
  async fastTextCompletion(@Body() body: FastTextCompletionRequest) {
    return this.aicomminicateService.fastTextCompletion(body);
  }
}
