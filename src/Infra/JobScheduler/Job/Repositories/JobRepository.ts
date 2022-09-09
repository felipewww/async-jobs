import {Job} from "@Infra/JobScheduler/Job/Job";
import {MongoJob} from "@Data/Source/Mongo/MongoJob";
import {EJobStatus} from "@Infra/JobScheduler/Job/Contracts";
import {IJobRaw} from "@Data/Source/Mongo/Contracts";

export class JobRepository {
    constructor(
        private model: MongoJob
    ) {

    }

    public static getInstance(collectionPrefix: string) {
        const model = new MongoJob(collectionPrefix);
        return  new JobRepository(model);
    }

    async store(job: Job<any>): Promise<Job<any>> {
        return new Promise<Job<any>>((resolve) => {
            const toRaw: IJobRaw = {
                _id: null,
                scheduledTo: job.scheduledTo,
                scheduledAt: job.scheduledAt,
                params: job.params,
            }


            this.model.store(toRaw)
                .then(result => {
                    const jobParsed = Job.parse(result.ops[0]);
                    resolve(jobParsed);
                })
        })
    }

    async findById(id: string): Promise<Job<any>> {
        let job: Job<any>;
        let jobRaw = await this.model.findById(id);

        if (jobRaw) {
            job = Job.parse(jobRaw);
        }

        return job;
    }

    async findByRefId(id: number): Promise<Job<any>> {
        let job: Job<any>;
        let jobRaw = await this.model.cancelJobNotificationByRefId(id);

        if (jobRaw) {
            job = Job.parse(jobRaw);
        }

        return job;
    }

    async findNext(maxDate: Date): Promise<Array<Job<any>>> {

        const jobRaw: Array<IJobRaw> = await this.model.findNext(maxDate);

        let result: Array<Job<any>> = [];

        jobRaw.map(jobRaw => {
            const job = Job.parse(jobRaw);
            result.push(job);
        })

        return result;
    }

    async finish(jobId: any, as: EJobStatus, executionMessages?: { [key: string]: any }) {
        return this.model.finish(jobId, as, executionMessages);
    }
}
