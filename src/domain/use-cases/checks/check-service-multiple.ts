import { LogEntity, LogSeverityLevel } from "../../entities/log.entity";
import { LogRepository } from "../../repository/log.repository";

interface CheckServiceMultipleUseCase {
  execute(url: string): Promise<boolean>;
}

type SuccesCallback = (() => void) | undefined;
type ErrorCallback = ((error: string) => void) | undefined;
export class CheckServiceMultiple implements CheckServiceMultipleUseCase {
  constructor(
    private readonly logRepository: LogRepository[],
    private readonly succesCallBack: SuccesCallback,
    private readonly errorCallBack: ErrorCallback
  ) {}

  private callLogs(log: LogEntity) {
    this.logRepository.forEach((logRepository) => {
      logRepository.saveLog(log);
    });
  }
  public async execute(url: string): Promise<boolean> {
    try {
      const req = await fetch(url);
      if (!req.ok) throw new Error(`Fetching ${url} failed`);

      const log = new LogEntity({
        message: `Service ${url} working`,
        level: LogSeverityLevel.low,
        origin: "check-service.ts",
      });
      this.callLogs(log);
      console.log("server is ok");

      this.succesCallBack && this.succesCallBack();
      return true;
    } catch (error) {
      const errorMessage = `${url} isn't ok ${error}`;
      const log = new LogEntity({
        message: `${url} isn't ok ${error}`,
        level: LogSeverityLevel.high,
        origin: "check-service.ts",
      });
      this.callLogs(log);
      this.errorCallBack && this.errorCallBack(errorMessage);

      return false;
    }
  }
}
