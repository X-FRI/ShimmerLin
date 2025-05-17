import { Injectable } from "@nestjs/common";
import { AIComminicateMessageApi } from "../../domain/api/ai-comminicate.api";
import {
  AiComminicateMessage,
  AiComminicateMessageRole,
} from "../../domain/model/ai-comminicate.model";
import OpenAI from "openai";
import { APIModel } from "../../domain/model/api-model.model";

@Injectable()
export class OpenAIComminicateMessageApi implements AIComminicateMessageApi {
  async fastTextCompletion(
    apiModel: APIModel,
    model: string,
    prompt: string,
  ): Promise<AiComminicateMessage> {
    const openai = new OpenAI({
      baseURL: apiModel.props.baseUrl,
      apiKey: apiModel.props.apiKey,
    });

    const response = await openai.completions.create({
      prompt,
      model,
    });

    return AiComminicateMessage.create({
      prompt,
      response: response.choices[0].text,
      modelId: apiModel.id,
    });
  }
}
