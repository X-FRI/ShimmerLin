import { Inject, Injectable } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";

type LogLevel = "debug" | "info" | "warn" | "error";

type LogMethod = (message: string, ...args: unknown[]) => void;

type LogMethods = {
  [K in LogLevel]: LogMethod;
};

@Injectable()
export class LoggingService implements LogMethods {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    // Dynamically create the winston related methods
    const logLevels: LogLevel[] = ["debug", "info", "warn", "error"];

    for (const level of logLevels) {
      this[level] = (message: string, ...args: unknown[]) => {
        this.logger[level](message, ...args);
      };
    }
  }

  debug!: LogMethod;
  info!: LogMethod;
  warn!: LogMethod;
  error!: LogMethod;
}
