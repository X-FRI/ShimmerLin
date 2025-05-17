import { AiComminicate } from "../model/ai-comminicate.model";

export interface AiComminicateRepository {
  save(aiComminicate: AiComminicate): Promise<AiComminicate>;
  findById(id: string): Promise<AiComminicate>;
}
