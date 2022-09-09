import {Mongo} from "@Data/Source/Mongo/Mongo";

export enum ErrorTypes {
    Unexpected,
    WithRequest
}

export class MongoLog extends Mongo {
    constructor(
        dbName: string,
    ) {
        super(
            process.env.MONGO_LOG_USER,
            process.env.MONGO_LOG_PASS,
            dbName,
            process.env.MONGO_LOG_HOST,
            process.env.MONGO_LOG_PORT,
        );
    }

    public async save(data: { [key:string]: any }, type: ErrorTypes) {
        const conn = await this.db();

        data.createdAt = new Date();
        data.type = type;
        data.typeName = ErrorTypes[type]

        const q = conn
            .collection('error_log')
            .insertOne(data)

        return this.exec(q);
    }
}
