import { AI_comminicate_MESSAGE_API } from "../ai-model.constants";
import { API_MODEL_REPOSITORY } from "../ai-model.constants";
import { OpenAIComminicateMessageApi } from "./api/openai-ai-comminicate.api";
import { PrismaAPIModelRepository } from "./repository/prisma-api-model.repository";

export const INFRASTRUCTURE = [
  {
    provide: API_MODEL_REPOSITORY,
    useClass: PrismaAPIModelRepository,
  },
  {
    provide: AI_comminicate_MESSAGE_API,
    useClass: OpenAIComminicateMessageApi,
  },
];
