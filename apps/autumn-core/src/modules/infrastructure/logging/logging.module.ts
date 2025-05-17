import { Global, Module } from "@nestjs/common";
import { LoggingService } from "./logging.service";
import { WinstonModule } from "nest-winston";
import { format, transports } from "winston";
import { ConfigService } from "@nestjs/config";
import { consoleFormat } from "winston-console-format";
import * as DailyRotateFile from "winston-daily-rotate-file";

@Global()
@Module({
  imports: [
    WinstonModule.forRoot({
      level: new ConfigService().get("LOG_LEVEL") || "debug",
      format: format.combine(
        format.timestamp(),
        format.ms(),
        format.errors({ stack: true }),
        format.splat(),
        format.json(),
      ),
      transports: [
        new DailyRotateFile({
          level: new ConfigService().get("LOG_LEVEL") || "debug",
          filename: "logs/autumn-core-%DATE%.log",
          datePattern: "YYYY-MM-DD-HH",
          zippedArchive: true,
          maxSize: "20m",
          maxFiles: "14d",
        }),
        new transports.Console({
          format: format.combine(
            format.colorize({ all: true }),
            format.padLevels(),
            format.splat(),
            consoleFormat({
              showMeta: true,
              metaStrip: [],
              inspectOptions: {
                depth: Number.POSITIVE_INFINITY,
                colors: true,
                maxArrayLength: Number.POSITIVE_INFINITY,
                breakLength: 120,
                compact: Number.POSITIVE_INFINITY,
              },
            }),
          ),
        }),
      ],
    }),
  ],
  providers: [LoggingService],
  exports: [LoggingService],
})
export class LoggingModule { }
