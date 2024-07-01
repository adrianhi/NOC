import { CronJob } from "cron";
type CronTime = string | Date;
type OnTick = () => void;

export class CronService {
  static createJob(crontTime: CronTime, onTick: OnTick): CronJob {
    const job = new CronJob(crontTime, onTick);

    job.start();

    return job;
  }
}
