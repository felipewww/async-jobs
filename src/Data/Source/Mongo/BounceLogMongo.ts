import {Mongo} from "@Data/Source/Mongo/Mongo";

export class BounceLogMongo extends Mongo {
    constructor() {
        super(
            process.env.MONGO_USER,
            process.env.MONGO_PASS,
            'kiwiki',
            process.env.MONGO_HOST,
            process.env.MONGO_PORT,
        );
    }

    async read() {
        const conn = await this.db();

        const query = conn.collection('bounce_email')
            .find({})
            .toArray()
            // .forEach(item => {
            //     console.log('item??'.red.bold)
            //     console.log(item)
            // })

        // console.log('query??'.green.bold)
        // console.log(query)
        // query.next()

        // @ts-ignore
        return this.exec(query)
    }
}