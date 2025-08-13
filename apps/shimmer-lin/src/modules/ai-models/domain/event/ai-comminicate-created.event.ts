import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { LoggingService } from "@src/modules/infrastructure/logging/logging.service";
import { AiComminicate } from "../model/ai-comminicate.model";

export class AiComminicateCreatedEvent {
  constructor(public readonly aiComminicate: AiComminicate) {}
}

@EventsHandler(AiComminicateCreatedEvent)
export class AiComminicateCreatedEventHandler
  implements IEventHandler<AiComminicateCreatedEvent>
{
  constructor(private readonly logger: LoggingService) {}
  public async handle(event: AiComminicateCreatedEvent) {
    this.logger.info("AiComminicate created", {
      id: event.aiComminicate.id,
      model: event.aiComminicate.props.model,
    });
  }
}
