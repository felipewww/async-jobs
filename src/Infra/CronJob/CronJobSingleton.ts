import {CronJob} from "@Infra/CronJob/CronJob";

class CronJobSingleton {
    private cronQueues: { [key:string]: any } = {};

    private add(cronJobInstance: CronJob, name: string) {
        this.cronQueues[name] = cronJobInstance;
    }

    public getByName(name: string): CronJob {
        return this.cronQueues[name];
    }

    public create(name: string, cronExpression: string): CronJob {
        let cronJobQueue = CronJob.createInstance(name, cronExpression)

        this.add(cronJobQueue, name)

        return cronJobQueue;
    }
}

const CronJobSingletonInstance = new CronJobSingleton()

export {
    CronJobSingletonInstance
}
