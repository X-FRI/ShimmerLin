import { Injectable } from "@nestjs/common";
import { AIComminicateApi } from "../../domain/api/ai-comminicate.api";
import {
  AiComminicate,
  AiComminicateMessage,
} from "../../domain/model/ai-comminicate.model";
import OpenAI from "openai";
import { APIModel } from "../../domain/model/api-model.model";

@Injectable()
export class OpenAIComminicateApi implements AIComminicateApi {
  async fastTextCompletion(
    apiModel: APIModel,
    aiComminicate: AiComminicate,
  ): Promise<AiComminicate> {
    const openai = new OpenAI({
      baseURL: apiModel.props.baseUrl,
      apiKey: apiModel.props.apiKey,
    });

    const response = await openai.chat.completions.create({
      model: apiModel.props.model,
      messages: aiComminicate.props.messages.map((message) => ({
        role: message.props.role,
        content: message.props.content,
      })),
    });

    if (!response.choices[0].message.content) {
      throw new Error("No content in response");
    }

    aiComminicate.addMessage(
      AiComminicateMessage.create({
        role: "assistant",
        content: response.choices[0].message.content,
        contextId: aiComminicate.id,
        model: apiModel.props.model,
      }),
    );

    return aiComminicate;
  }
}
