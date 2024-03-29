import {ObjectID, InsertOneWriteOpResult} from "mongodb";
import {Mongo} from "@Data/Source/Mongo/Mongo";
import {EJobStatus} from "@Infra/JobScheduler/Job/Contracts";
import {IJobRaw} from "@Data/Source/Mongo/Contracts";

export class MongoJob extends Mongo {

    protected collectionJobsName: string = ':jobs';
    protected collectionCancelledJobsName: string = ':cancelled';
    protected collectionFinishedJobsName: string = ':finished';
    protected collectionFailedJobsName: string = ':failed';

    constructor(
        protected collectionPrefix: string
    ) {
        super(
            process.env.MONGO_USER,
            process.env.MONGO_PASS,
            'jobs',
            process.env.MONGO_HOST,
            process.env.MONGO_PORT,
        );

        this.setCollectionsNames();
    }


    private setCollectionsNames() {

        this.collectionJobsName = this.collectionPrefix+this.collectionJobsName;
        this.collectionCancelledJobsName = this.collectionPrefix+this.collectionCancelledJobsName;
        this.collectionFinishedJobsName = this.collectionPrefix+this.collectionFinishedJobsName;
        this.collectionFailedJobsName = this.collectionPrefix+this.collectionFailedJobsName;
    }

    async cancel(jobId: any) {
        const conn = await this.db();

        const jobRawToMove = await conn.collection(this.collectionJobsName)
            .findOne({ "_id": new ObjectID(jobId) })

        const promiseInsert = conn
            .collection(this.collectionCancelledJobsName)
            .insertOne(jobRawToMove)
            .then();

        const promiseDelete = conn.collection(this.collectionJobsName)
            .deleteOne({ "_id": new ObjectID(jobId) })
            .then()

        Promise.all([promiseInsert, promiseDelete])
            .finally(() => {
                this.connection.close();
            })
    }

    async finish(jobId: any, as: EJobStatus, executionMessages?: { [key: string]: any }) {
        const conn = await this.db();

        let collectionToMove: string;
        switch (as) {
            case EJobStatus.Success:
                collectionToMove = this.collectionFinishedJobsName;
                break;

            case EJobStatus.Cancelled:
                collectionToMove = this.collectionCancelledJobsName;
                break;

            case EJobStatus.Failed:
                collectionToMove = this.collectionFailedJobsName;
                break;
        }

        const jobRawToMove = await conn.collection(this.collectionJobsName)
            .findOne({ "_id": new ObjectID(jobId) })

        if (executionMessages) {
            jobRawToMove['executionMessages'] = executionMessages;
        }

        const promiseInsert = conn
            .collection(collectionToMove)
            .insertOne(jobRawToMove)
            .then();

        const promiseDelete = conn.collection(this.collectionJobsName)
            .deleteOne({ "_id": new ObjectID(jobId) })
            .then()

        Promise.all([promiseInsert, promiseDelete])
            .finally(() => {
                this.connection.close();
            })
    }

    async store(data: IJobRaw): Promise<InsertOneWriteOpResult<IJobRaw>> {
        const conn = await this.db();

        const q = conn
            .collection(`${this.collectionPrefix}:jobs`)
            .insertOne(data)

        return this.exec(q);
    }

    async findById(id: string): Promise<IJobRaw> {
        const conn = await this.db();

        const q = conn.collection(this.collectionJobsName)
            .findOne({ "_id": new ObjectID(id) })

        return this.exec(q);
    }

    async cancelJobNotificationByRefId(refId: number): Promise<IJobRaw> {
        const conn = await this.db();
        const q = conn.collection(this.collectionJobsName)
            .findOne({ "params.id": refId.toString() })

        return this.exec(q);
    }

    async findNext(maxDate: Date): Promise<Array<IJobRaw>> {

        const conn = await this.db();

        const q = conn.collection(this.collectionJobsName)
            .find({
                "scheduledTo": {
                    "$lte": maxDate
                }
            }).toArray()

        return this.exec(q);
    }
}
