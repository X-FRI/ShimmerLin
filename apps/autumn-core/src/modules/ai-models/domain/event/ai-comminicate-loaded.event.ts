import { LoggingService } from "@src/modules/infrastructure/logging/logging.service";
import { AiComminicate } from "../model/ai-comminicate.model";
import { EventsHandler, IEventHandler } from "@nestjs/cqrs";

export class AiComminicateLoadedEvent {
  constructor(public readonly aiComminicate: AiComminicate) {}
}

@EventsHandler(AiComminicateLoadedEvent)
export class AiComminicateLoadedEventHandler
  implements IEventHandler<AiComminicateLoadedEvent>
{
  constructor(private readonly logger: LoggingService) {}
  public async handle(event: AiComminicateLoadedEvent) {
    this.logger.info("AiComminicate loaded", {
      id: event.aiComminicate.id,
      model: event.aiComminicate.props.model,
    });
  }
}
