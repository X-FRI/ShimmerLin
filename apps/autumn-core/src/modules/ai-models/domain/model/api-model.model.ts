import { AggregateRoot } from "@nestjs/cqrs";
import { v7 as uuidv7 } from "uuid";

export interface APIModelProps {
  name: string;
  model: string;
  baseUrl: string;
  apiKey: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface APIModelCreateProps
  extends Omit<APIModelProps, "createdAt" | "updatedAt"> {}

export class APIModel extends AggregateRoot {
  private constructor(
    public readonly id: string,
    public readonly props: APIModelProps,
  ) {
    super();
  }

  public static create(props: APIModelCreateProps): APIModel {
    return new APIModel(uuidv7(), {
      ...props,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public static reconstitute(id: string, props: APIModelProps): APIModel {
    return new APIModel(id, props);
  }

  public isSameModel(other: APIModel | null | undefined): boolean {
    return (
      other !== null &&
      other !== undefined &&
      this.props.model === other.props.model &&
      this.props.baseUrl === other.props.baseUrl &&
      this.props.apiKey === other.props.apiKey
    );
  }
}
