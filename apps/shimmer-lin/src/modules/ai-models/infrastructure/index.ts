import {
  AI_COMMINICATE_API,
  AI_COMMINICATE_REPOSITORY,
} from "../ai-model.constants";
import { API_MODEL_REPOSITORY } from "../ai-model.constants";
import { OpenAIComminicateApi } from "./api/openai-ai-comminicate.api";
import { PrismaAiComminicateRepository } from "./repository/prisma-ai-comminicate.repository";
import { PrismaAPIModelRepository } from "./repository/prisma-api-model.repository";

export const INFRASTRUCTURE = [
  {
    provide: API_MODEL_REPOSITORY,
    useClass: PrismaAPIModelRepository,
  },
  {
    provide: AI_COMMINICATE_API,
    useClass: OpenAIComminicateApi,
  },
  {
    provide: AI_COMMINICATE_REPOSITORY,
    useClass: PrismaAiComminicateRepository,
  },
];
