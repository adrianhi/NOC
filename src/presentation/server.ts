import { envs } from "../config/plugins/envs.plugin";
import { CheckService } from "../domain/use-cases/checks/check-service";
import { SendEmailLogs } from "../domain/use-cases/email/send-email-logs";
import { FileSystemDatasource } from "../infrastructure/datasource/file-system.datasource";
import { MongoLogDatasource } from "../infrastructure/datasource/mongo-log.datasource";
import { LogRepositoryImpl } from "../infrastructure/repositories/log.repository.impl";
import { CronService } from "./cron/cron-service";
import { EmailService } from "./email/email.service";
const logRepository = new LogRepositoryImpl(
  // new FileSystemDatasource()
  new MongoLogDatasource()
);
const emailService = new EmailService();
export class Server {
  public static start() {
    console.log("server started");

    // new SendEmailLogs(emailService, fileSystemLogRepository).execute([
    //   "hidalgobeltreadrian@gmail.com",
    //   "hidalgoadrian023@gmail.com",
    // ]);

    CronService.createJob("*/5 * * * * *", () => {
      new CheckService(
        logRepository,
        () => console.log("success"),
        () => console.log("error")
      ).execute("https://www.google.com/");
    });
  }
}
