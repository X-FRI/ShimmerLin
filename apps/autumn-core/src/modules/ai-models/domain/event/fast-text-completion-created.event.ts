import { IEvent, IEventHandler, EventsHandler } from "@nestjs/cqrs";
import { LoggingService } from "@src/modules/infrastructure/logging/logging.service";
import { AiComminicate } from "../model/ai-comminicate.model";

export class FastTextCompletionCreatedEvent implements IEvent {
  constructor(public readonly aiComminicate: AiComminicate) {}
}

@EventsHandler(FastTextCompletionCreatedEvent)
export class FastTextCompletionCreatedEventHandler
  implements IEventHandler<FastTextCompletionCreatedEvent>
{
  constructor(private readonly logger: LoggingService) {}

  handle(event: FastTextCompletionCreatedEvent) {
    this.logger.info("Fast text completion created", {
      contextId: event.aiComminicate.id,
      messages: event.aiComminicate.getLatestMessage(),
    });
  }
}
