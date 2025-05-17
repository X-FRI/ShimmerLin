import {
  AiComminicate,
  AiComminicateMessage,
} from "../model/ai-comminicate.model";
import { APIModel } from "../model/api-model.model";

export interface AIComminicateApi {
  fastTextCompletion(
    apiModel: APIModel,
    message: AiComminicate,
  ): Promise<AiComminicate>;
}
