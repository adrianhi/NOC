export enum LogSeverityLevel {
  low = "low",
  medium = "medium",
  high = "high",
}
export interface LogEntityOptions {
  level: LogSeverityLevel; //Enum
  message: string;
  createdAt?: Date;
  origin: string;
}
export class LogEntity {
  public level: LogSeverityLevel; //Enum
  public message: string;
  public createdAt: Date;
  public origin: string;

  constructor(options: LogEntityOptions) {
    const { message, level, createdAt = new Date(), origin } = options;
    this.message = message;
    this.level = level;
    this.createdAt = createdAt;
    this.origin = origin;
  }

  static fromJson = (json: string): LogEntity => {
    json = json === "" ? "{}" : json;
    const { message, level, createdAt, origin } = JSON.parse(json);
    const log = new LogEntity({
      message: message,
      level: level,
      createdAt: createdAt,
      origin: origin,
    });
    log.createdAt = new Date(createdAt);
    return log;
  };

  static fromObject = (object: { [key: string]: any }): LogEntity => {
    const { message, level, createdAt, origin } = object;

    const log = new LogEntity({
      message,
      level,
      createdAt,
      origin,
    });
    return log;
  };
}
