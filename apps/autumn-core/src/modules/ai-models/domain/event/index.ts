import { APIModelCreatedEventHandler } from "./api-model-created.event";
import { FastTextCompletionCreatedEventHandler } from "./fast-text-completion-created.event";
import { AiComminicateCreatedEventHandler } from "./ai-comminicate-created.event";
import { AiComminicateLoadedEventHandler } from "./ai-comminicate-loaded.event";

export * from "./api-model-created.event";
export * from "./fast-text-completion-created.event";
export * from "./ai-comminicate-created.event";
export * from "./ai-comminicate-loaded.event";

export const EVENT_HANDLERS = [
  APIModelCreatedEventHandler,
  AiComminicateCreatedEventHandler,
  AiComminicateLoadedEventHandler,
  FastTextCompletionCreatedEventHandler,
];
