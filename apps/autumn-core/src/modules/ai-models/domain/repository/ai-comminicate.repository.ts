import { AiComminicateMessage } from "../model/ai-comminicate.model";

export interface AiComminicateMessageRepository {
  save(
    aiComminicateMessage: AiComminicateMessage,
  ): Promise<AiComminicateMessage>;
}
