import { EmailService } from "../../../presentation/email/email.service";
import { LogEntity, LogSeverityLevel } from "../../entities/log.entity";
import { LogRepository } from "../../repository/log.repository";

interface SendLogEmailUseCase {
  execute: (to: string | string[]) => Promise<boolean>;
}

export class SendEmailLogs implements SendLogEmailUseCase {
  constructor(
    private readonly emailService: EmailService,
    private readonly logRepository: LogRepository
  ) {}

  async execute(to: string | string[]): Promise<boolean> {
    try {
      const sent = await this.emailService.SendEmailWithFileSystemLogs(to);
      if (!sent) {
        throw new Error(`Email log not sent`);
      }
      const log = new LogEntity({
        message: `Email log sent`,
        level: LogSeverityLevel.low,
        origin: "send-email-logs.ts",
      });
      await this.logRepository.saveLog(log);
      return true;
    } catch (error) {
      const log = new LogEntity({
        message: `Email log not sent due to error: ${error}`,
        level: LogSeverityLevel.high,
        origin: "send-email-logs.ts",
      });
      await this.logRepository.saveLog(log);
      return false;
    }
  }
}
