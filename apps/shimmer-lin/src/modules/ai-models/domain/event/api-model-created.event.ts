import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { LoggingService } from "@src/modules/infrastructure/logging/logging.service";
import { APIModel } from "../model/api-model.model";

export class APIModelCreatedEvent {
  constructor(public readonly apiModel: APIModel) {}
}

@EventsHandler(APIModelCreatedEvent)
export class APIModelCreatedEventHandler
  implements IEventHandler<APIModelCreatedEvent>
{
  constructor(private readonly logger: LoggingService) {}
  public async handle(event: APIModelCreatedEvent) {
    this.logger.info("API model created", {
      id: event.apiModel.id,
      name: event.apiModel.props.name,
      model: event.apiModel.props.model,
    });
  }
}
