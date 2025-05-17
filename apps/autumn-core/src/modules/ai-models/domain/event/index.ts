import { APIModelCreatedEventHandler } from "./api-model-created.event";
import { FastTextCompletionCreatedEventHandler } from "./fast-text-completion-created.event";

export * from "./api-model-created.event";
export * from "./fast-text-completion-created.event";

export const EVENT_HANDLERS = [
  APIModelCreatedEventHandler,
  FastTextCompletionCreatedEventHandler,
];
