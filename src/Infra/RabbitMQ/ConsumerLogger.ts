import { Message } from "amqplib";
import { ErrorTypes, MongoLog } from "@Data/Source/Mongo/MongoLog";
import {IConsumerLogger} from "promo-infra-modules/dist/RabbitMQ/Consumer";

export class ConsumerLogger implements IConsumerLogger {
    log(error: Error, msg: Message) {
        const model = new MongoLog(process.env.MONGO_LOG_DB)
        model.save({
            error: {name: error.name, stack: error.stack, message: error.message},
            msg
        }, ErrorTypes.Unexpected)
            .catch(err => {
                console.log('Erro ao salvar no MongoDB')
                console.log(err)
                console.log(msg)
            })

        if (process.env.NODE_ENV === 'dev') {
            console.log('maybe accountable error....');
            console.log(error)
            console.log(msg)
        }
    }
}
