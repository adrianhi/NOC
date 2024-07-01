import { PrismaClient, SeverityLevel } from "@prisma/client";
import { LogDataSource } from "../../domain/datasources/log.datasources";
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity";

const prismaClient = new PrismaClient();
const severityEnum = {
  low: SeverityLevel.LOW,
  medium: SeverityLevel.MEDIUM,
  high: SeverityLevel.HIGH,
};
export class PostgresLogDatasource implements LogDataSource {
  async saveLog(log: LogEntity): Promise<void> {
    try {
      const newLog = await prismaClient.logModel.create({
        data: {
          ...log,
          level: severityEnum[log.level],
        },
      });
      console.log("postgrest log created", newLog.id);
    } catch (error) {
      console.error("Error saving log to the database", error);
    }
  }
  async getLogs(serverityLevel: LogSeverityLevel): Promise<LogEntity[]> {
    const level = severityEnum[serverityLevel];

    const dbLogs = await prismaClient.logModel.findMany({
      where: { level },
    });
    return dbLogs.map(LogEntity.fromObject);
  }
}
