import { CheckServiceMultiple } from "../domain/use-cases/checks/check-service-multiple";
import { FileSystemDatasource } from "../infrastructure/datasource/file-system.datasource";
import { MongoLogDatasource } from "../infrastructure/datasource/mongo-log.datasource";
import { PostgresLogDatasource } from "../infrastructure/datasource/postgres-log.datasource";
import { LogRepositoryImpl } from "../infrastructure/repositories/log.repository.impl";
import { CronService } from "./cron/cron-service";
import { EmailService } from "./email/email.service";
const fslogRepository = new LogRepositoryImpl(new FileSystemDatasource());
const mongologRepository = new LogRepositoryImpl(new MongoLogDatasource());
const postgreslogRepository = new LogRepositoryImpl(
  new PostgresLogDatasource()
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
      new CheckServiceMultiple(
        [fslogRepository, mongologRepository, postgreslogRepository],
        () => console.log("success"),
        () => console.log("error")
      ).execute("https://www.google.com/");
    });
  }
}
