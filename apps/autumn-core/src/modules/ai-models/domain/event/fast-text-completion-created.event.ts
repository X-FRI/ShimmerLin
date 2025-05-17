import { IEvent, IEventHandler, EventsHandler } from "@nestjs/cqrs";
import { LoggingService } from "@src/modules/infrastructure/logging/logging.service";
import { AiComminicateMessage } from "../model/ai-comminicate.model";

export class FastTextCompletionCreatedEvent implements IEvent {
  constructor(public readonly fastTextCompletion: AiComminicateMessage) {}
}

@EventsHandler(FastTextCompletionCreatedEvent)
export class FastTextCompletionCreatedEventHandler
  implements IEventHandler<FastTextCompletionCreatedEvent>
{
  constructor(private readonly logger: LoggingService) {}

  handle(event: FastTextCompletionCreatedEvent) {
    this.logger.info("FastTextCompletionCreatedEvent", {
      prompt: event.fastTextCompletion.props.prompt,
      response: event.fastTextCompletion.props.response,
    });
  }
}
