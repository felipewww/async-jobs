import {Job} from "@Infra/JobScheduler/Job/Job";
import {Subscriber} from "@Infra/JobScheduler/Queue/Subscriber";
import {EQueueEventType} from "@Infra/JobScheduler/Queue/Contracts";

export class Queue<S extends Subscriber> {

    private readonly _scheduledJobs: Array<Job<any>> = []
    protected subscribers: Array<S> = [];

    constructor(private _queueName: string) {

    }

    /**
     * Schedule a Job in memory using setTimeout
     * @param job
     */
    addJob(job: Job<any>|Array<Job<any>>) {
        if (Array.isArray(job)) {
            job.forEach(job => {
                this.__addJob(job);
            })
        } else {
            this.__addJob(job);
        }
    }

    cancelJobById(id: string) {
        this._scheduledJobs.map((job: Job<any>) => {
            if(String(job.id) === id.toString()) {
                job.cancel();
                this.emit(job, EQueueEventType.JobCancelled);
                return;
            }
        })
    }

    protected emit(job: Job<any>, event: EQueueEventType) {
        this.subscribers.forEach(subscriber => {
            subscriber.call(this, job, event);
        })
    }

    private __addJob(job: Job<any>) {
        job.schedule(this);
        this._scheduledJobs.push(job);
        this.emit(job, EQueueEventType.JobAddedIntoCurrentTick);
    }

    /**
     * Dispatch event to all Subscribers when Job finishes it's execution
     * @param job
     */
    jobExecuted(job: Job<any>) {
        this.emit(job, EQueueEventType.JobExecuted);
    }

    subscribe(subscriber: S) {
        this.subscribers.push(subscriber);
    }

    get name(): string {
        return this._queueName;
    }
}
