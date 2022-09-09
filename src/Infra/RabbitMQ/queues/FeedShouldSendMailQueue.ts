import { FeedItemRequireEmail } from "@Domain/RabbitMQ/Accountables/FeedItemRequireEmail";
import { Message } from "amqplib";
import {RabbitMQ} from "kiwiki-infra-modules";

export class FeedShouldSendMailQueue extends RabbitMQ.Queue<FeedItemRequireEmail.IMessageParsed> {

    constructor(exchange: RabbitMQ.Exchange) {
        super(exchange, 'feed-should-send-mail');
    }

    messageParser(arrayMsg: Array<string>, rawMessage: Message): FeedItemRequireEmail.IMessageParsed {
        return {
            id: parseInt(arrayMsg[0]),
            teamId: parseInt(arrayMsg[1]),
            subdomain: arrayMsg[2],
        }
    }
}
