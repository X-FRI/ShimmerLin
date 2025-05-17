import { AggregateRoot } from "@nestjs/cqrs";
import { v7 as uuidv7 } from "uuid";
import { APIModel } from "./api-model.model";

export enum AiComminicateMessageRole {
  USER = "user",
  ASSISTANT = "assistant",
}

export interface AiComminicateMessageProps {
  prompt: string;
  response: string;
  modelId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AiComminicateMessageCreateProps
  extends Omit<AiComminicateMessageProps, "createdAt" | "updatedAt"> {}

export class AiComminicateMessage extends AggregateRoot {
  private constructor(
    public readonly id: string,
    public readonly props: AiComminicateMessageProps,
  ) {
    super();
  }

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
  message: AiComminicateMessage;
  model: APIModel;
  createdAt: Date;
  updatedAt: Date;
}

export interface AiComminicateCreateProps
  extends Omit<AiComminicateProps, "createdAt" | "updatedAt"> {}

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
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public static reconstitute(
    id: string,
    props: AiComminicateProps,
  ): AiComminicate {
    return new AiComminicate(id, props);
  }
}
