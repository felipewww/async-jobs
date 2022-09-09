import {EJobStatus, IJobReq} from "@Infra/JobScheduler/Job/Contracts";
import {Queue} from "@Infra/JobScheduler/Queue/Queue";
import {TaskEntity} from "@Infra/JobScheduler/Task/TaskEntity";
import {Subscriber} from "@Infra/JobScheduler/Queue/Subscriber";
import {IJobRaw} from "@Data/Source/Mongo/Contracts";
import Timeout = NodeJS.Timeout;
import {JobDebugger} from "@Infra/JobScheduler/Queue/QueuesSingleton";

export class Job<T> {

    public tasks: Array<TaskEntity> = [];

    private _timeOut: Timeout;
    private _status: EJobStatus = EJobStatus.Created;
    private _error: Error;

    /**
     * Parameters can be added by tasks during execution. These parameters can be used by other tasks or subscribers
     */
    private _executionParameters: { [key:string]: any } = {};

    private tries: { max: number, count: number } = {
        max: 3,
        count: 0
    }

    protected constructor(
        protected _scheduledTo: Date,
        protected _scheduledAt: Date,
        protected _params: T|{ [key:string]: any }, // todo, tipar o objeto corretamente
        protected _id: any
    ) {

    }

    /**
     * Create from Request Object
     * @param reqObj
     * @param _scheduledAt
     * @param id
     */
    public static _create(reqObj: IJobReq, _scheduledAt?: string, id?: any) {
        let scheduledAt: Date;
        if (!_scheduledAt) {
            scheduledAt = new Date();
        } else {
            scheduledAt = new Date(_scheduledAt);
        }

        return new Job(
            new Date(reqObj.scheduledTo),
            new Date(scheduledAt),
            reqObj.params,
            id
        );
    }

    /**
     * Creates a new Job Entity, without DB reference
     * @param _scheduledTo
     * @param params
     */
    public static create(_scheduledTo: string, params: { [key:string]: any }) {
        return new Job(
            new Date(_scheduledTo),
            new Date(),
            params,
            null
        );
    }

    /**
     * Parses Job from Mongo result
     * @param jobRaw
     */
    public static parse(jobRaw: IJobRaw): Job<any> {
        return new Job(
            jobRaw.scheduledTo,
            jobRaw.scheduledAt,
            jobRaw.params,
            jobRaw._id
        );
    }

    public toJSON() {
        return {
            id: this._id,
            status: this._status,
            timeOut: this._timeOut,
            error: this._error,
            tries: this.tries,
            scheduledTo: this._scheduledTo,
            scheduledAt: this._scheduledAt,
            executionParameters: this._executionParameters,
            params: this._params,
        }
    }

    public delay(): number {
        const now = new Date();
        let delay = this._scheduledTo.getTime() - now.getTime();

        return delay;
    }

    async execute(): Promise<boolean> {
        try {
            this._status = EJobStatus.Running;

            for (const task of this.tasks) {
                await task.execute(this);
            }

            this._status = EJobStatus.Success;

            JobDebugger.log(`job executed with success`)
            JobDebugger.log(this)
        } catch (e) {

            JobDebugger.log(`job executed with error`)
            JobDebugger.log(this)

            if (this.tries.count < this.tries.max) {
                this.tries.count++;
                return this.execute()
            }

            this._error = e;
            this._status = EJobStatus.Failed;
        }

        return true;
    }

    /**
     * Only a Queue can schedule a Job
     */
    public schedule(queue: Queue<Subscriber>) {
        this._status = EJobStatus.Scheduled
        this._timeOut = setTimeout(async () => {
            await this.execute()
            queue.jobExecuted(this);
        }, this.delay())
    }

    public cancel(): boolean {
        clearTimeout(this._timeOut);
        this._status = EJobStatus.Cancelled;

        return true;
    }

    public cancelAsFailed() {
        clearTimeout(this._timeOut);

        this._status = EJobStatus.Failed

        //if was cancelled dring execution, will also cancel possible retries (if failing)
        this.tries.max = 0;
    }

    /**
     * Only taks can add a parameters
     * @param task
     * @param parameters
     */
    public addExecutionParameter(task: TaskEntity, parameters: { [key:string]: any }) {
        for (let idx in parameters) {
            this._executionParameters[idx] = parameters[idx];
        }
    }

    get executionParameters() {
        return this._executionParameters;
    }

    get id() {
        return this._id
    }

    get scheduledTo(): Date {
        return this._scheduledTo;
    }

    get scheduledAt(): Date {
        return this._scheduledAt;
    }

    get params() {
        return this._params;
    }

    get status(): EJobStatus {
        return this._status;
    }

    get error() {
        return this._error;
    }
}
