import { CronJob } from "cron";

type CronTime = string | Date;
type OnTick = () => void;
export class CronService {
    public static createJob(cronTime: CronTime, onTick: OnTick): CronJob {
        const job = new CronJob(
            cronTime, // cronTime
            onTick, // onTick
            null, // onComplete
            true // start
            // 'America/Los_Angeles' // timeZone
        );
        return job;
    }
}
