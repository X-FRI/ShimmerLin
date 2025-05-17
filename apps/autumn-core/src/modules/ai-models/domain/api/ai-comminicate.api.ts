import { AiComminicateMessage } from "../model/ai-comminicate.model";
import { APIModel } from "../model/api-model.model";

export interface AIComminicateMessageApi {
  fastTextCompletion(
    apiModel: APIModel,
    model: string,
    prompt: string,
  ): Promise<AiComminicateMessage>;
}
