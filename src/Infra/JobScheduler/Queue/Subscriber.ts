import {Job} from "@Infra/JobScheduler/Job/Job";
import {Queue} from "@Infra/JobScheduler/Queue/Queue";
import {EQueueEventType} from "@Infra/JobScheduler/Queue/Contracts";

export abstract class Subscriber {

    /**
     * When job finished, call a subscriber passing de finished job as a parameter
     * @param queue
     * @param job
     * @param event
     */
    public abstract call(queue: Queue<any>, job: Job<any>, event: EQueueEventType): void;
}

export abstract class SubscriberMongo extends Subscriber {
    public abstract onMove(job: Job<any>, err?: any): void;
}
