import { AggregateRoot } from "@nestjs/cqrs";
import { v7 as uuidv7 } from "uuid";
import { APIModel } from "./api-model.model";

export const AiComminicateMessageRole = [
  "user",
  "assistant",
  "system",
] as const;

export type AiComminicateMessageRole =
  (typeof AiComminicateMessageRole)[number];

export interface AiComminicateMessageProps {
  role: AiComminicateMessageRole;
  content: string;

  /// The contextId is the AiComminicate id
  contextId: string;

  model: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AiComminicateMessageCreateProps
  extends Omit<AiComminicateMessageProps, "createdAt" | "updatedAt"> {}

export class AiComminicateMessage {
  private constructor(
    public readonly id: string,
    public readonly props: AiComminicateMessageProps,
  ) {}

  public static create(
    props: AiComminicateMessageCreateProps,
  ): AiComminicateMessage {
    return new AiComminicateMessage(uuidv7(), {
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public static reconstitute(
    id: string,
    props: AiComminicateMessageProps,
  ): AiComminicateMessage {
    return new AiComminicateMessage(id, props);
  }
}

export interface AiComminicateProps {
  model: APIModel;
  messages: AiComminicateMessage[];
}

export interface AiComminicateCreateProps extends AiComminicateProps {}

export class AiComminicate extends AggregateRoot {
  private constructor(
    public readonly id: string,
    public readonly props: AiComminicateProps,
  ) {
    super();
  }

  public static create(props: AiComminicateCreateProps): AiComminicate {
    return new AiComminicate(uuidv7(), {
      ...props,
    });
  }

  public addMessage(message: AiComminicateMessage): void {
    this.props.messages.push(message);
  }

  public getLatestMessage(): AiComminicateMessage {
    return this.props.messages[this.props.messages.length - 1];
  }

  public static reconstitute(
    id: string,
    props: AiComminicateProps,
  ): AiComminicate {
    return new AiComminicate(id, props);
  }
}
