import {Queue} from "@Infra/JobScheduler/Queue/Queue";
import {TimeSpecParser} from "@Infra/JobScheduler/Utils/TimeSpecParser";
import {JobRepository} from "@Infra/JobScheduler/Job/Repositories/JobRepository";
import {EJobStatus, ITimeSpec} from "@Infra/JobScheduler/Job/Contracts";
import {TaskEntity} from "@Infra/JobScheduler/Task/TaskEntity";
import {Job} from "@Infra/JobScheduler/Job/Job";
import {SubscriberMongo} from "@Infra/JobScheduler/Queue/Subscriber";
import {JobDebugger} from "@Infra/JobScheduler/Queue/QueuesSingleton";
import Timeout = NodeJS.Timeout;
import {EQueueEventType} from "@Infra/JobScheduler/Queue/Contracts";

export class MongoQueue extends Queue<SubscriberMongo> {

    private _initialized: boolean = false;

    protected _timeOut: Timeout;
    protected _refreshTimeParsed: number;
    protected _repo: JobRepository;

    protected refreshTime: ITimeSpec = {
        value: 3,
        unity: 'hours'
    }

    protected tasks: Array<TaskEntity> = [];

    /**
     * If last DB search retrieved no result and this option is true, this producer will clear timeout
     * avoiding unnecessary DB searches and timeouts.
     *
     * The timeout will recovered after addJob store some job in DB collection
     */
    public avoidWatchNullCollection: boolean = true;

    constructor(
        protected collectionPrefix: string,
    ) {
        super(collectionPrefix);
    }

    public setRefreshTime(refreshTime: ITimeSpec) {
        this.refreshTime = refreshTime;
        return this;
    }

    public setTasks(tasks: Array<TaskEntity>) {
        this.tasks = tasks;
        return this;
    }

    /**
     * Start a producer for DB searches based on timeout and queue feed
     */
    public async init() {
        this._refreshTimeParsed = TimeSpecParser.toMilliseconds(this.refreshTime);

        if (!this._initialized) {
            this._initialized = true;
            await this.findJobs();
        }

        return this;
    }

    /**
     * Find Jobs in database, parse these jobs to code entities (Job with Task), feed the queue with these jobs
     * and set the recursion (timeout)
     */
    private async findJobs() {
        const repo = JobRepository.getInstance(this.collectionPrefix);
        const jobs: Array<Job<any>> = await repo.findNext(this.getNextTick());

        jobs.forEach(job => {
            job.tasks = this.tasks;
            super.addJob(job)
        })

        this.setNextTick();
    }

    /**
     * recursion in memory by
     */
    private setNextTick() {
        this._timeOut = setTimeout(() => {
            this.findJobs();
        }, this._refreshTimeParsed);
    }

    /**
     * Retrieve Date object that represents next tick to search new jobs in database
     */
    private getNextTick(): Date {
        const now = new Date().getTime()
        const nextTick = now + this._refreshTimeParsed

        return new Date(nextTick);
    }

    /**
     * Salva o Job no banco. Se estiver dentro do horário de executar, atribui suas Tasks e manda para a fila de agendamento
     * @param job
     */
    public async addJob(job: Job<any>): Promise<Job<any>> {
        const repo = JobRepository.getInstance(this.collectionPrefix);
        const jobStored: Job<any> = await repo.store(job);

        this.emit(jobStored, EQueueEventType.JobAddedIntoMongo);

        if (this.isWithinCurrentTick(job)) {
            JobDebugger.log('addJob - o job adicionado deverá ser executado dentro do timeout ja definido')
            jobStored.tasks = this.tasks;
            super.addJob(jobStored);
        } else {
            JobDebugger.log('addJob - o job será salvo no banco e executado mais tarde')
            if (!this._timeOut) {
                JobDebugger.log('addJob - não havia timeout pois estava sem resultados no banco, definir novamente!')
                this.setNextTick();
            }
        }

        return jobStored;
    }

    public async cancelJobById(id: string): Promise<any> {
        const repo = JobRepository.getInstance(this.collectionPrefix);
        let job = await repo.findById(id);

        if (job) {
            this.move(job, EJobStatus.Cancelled);
        }

        super.cancelJobById(id);

        return job;
    }

    public async cancelJobNotificationByRefId(refId: number): Promise<any> {
        const repo = JobRepository.getInstance(this.collectionPrefix);
        let job = await repo.findByRefId(refId);

        if (job) {
            this.move(job, EJobStatus.Cancelled);
            super.cancelJobById(job.id);
        }

        return 'job';
    }

    /**
     * Validate if job added should be added to a queue timeOut or database to execute later (next producer ticks)
     * @param job
     */
    private isWithinCurrentTick(job: Job<any>) {
        return job.delay() < this._refreshTimeParsed
    }

    protected emit(job: Job<any>, event: EQueueEventType) {

        switch (event) {
            case EQueueEventType.JobCancelled:
                this.move(job, EJobStatus.Cancelled);
                break;

            case EQueueEventType.JobExecuted:
                switch (job.status) {
                    case EJobStatus.Success:
                        this.move(job, EJobStatus.Success);
                        break;

                    case EJobStatus.Failed:
                        const error = {
                            name: job.error.name,
                            message: job.error.message,
                            stack: job.error.stack,
                        }
                        this.move(job, EJobStatus.Failed, { error });
                        break;
                }
                break;
        }

        super.emit(job, event);
    }

    private move(job: Job<any>, as: EJobStatus, executionMessages?: { [key: string]: any }) {
        const repo = JobRepository.getInstance(this.collectionPrefix);
        repo.finish(job.id, as, executionMessages)
            .then(() => {
                this.subscribers.forEach(subscriber => {
                    subscriber.onMove(job);
                })
            })
            .catch(err => {
                this.subscribers.forEach(subscriber => {
                    subscriber.onMove(job, err);
                })
            })
    }
}
