import {CronTaskEntity} from "@Infra/CronJob/CronTaskEntity";
import * as cron from 'node-cron'

export class CronJob {
    private _tasks: Array<CronTaskEntity> = [];

    protected constructor(
        private _name: string,
        private cronExpression: string
    ) {
    }

    get name() {
        return this._name
    }

    public static createInstance(name, cronExpression: string) {
        return new CronJob(name, cronExpression);
    }

    public async init() {
        cron.schedule(this.cronExpression, () => {
            this.run()
        });
    }

    public addTask(cronTask: CronTaskEntity) {
        this._tasks.push(cronTask);
    }

    private run() {
        for (let task of this._tasks) {
            task.execute()
                .catch(err => {
                    // executar tasks - todo - tratamento de catch() caso de erro
                    // console.log('main err'.bgRed.white.bold)
                    // console.log(err)
                })
        }
    }
}
