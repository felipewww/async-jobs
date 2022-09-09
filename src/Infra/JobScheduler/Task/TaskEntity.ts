import {Job} from "@Infra/JobScheduler/Job/Job";

export abstract class TaskEntity {
    public abstract execute(job: Job<any>): Promise<any>;
}
