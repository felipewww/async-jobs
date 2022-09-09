import { SendFeedUpdateEmail } from "@Domain/RabbitMQ/Accountables/SendFeedUpdateEmail";
import { Message } from "amqplib";
import {RabbitMQ} from "kiwiki-infra-modules";

export class FeedEmailSenderQueue extends RabbitMQ.Queue<SendFeedUpdateEmail.IMessageParsed> {

    constructor(exchange: RabbitMQ.Exchange) {
        super(exchange, 'feed-email-sender');
    }

    messageParser(arrayMsg: Array<string>, rawMessage: Message): SendFeedUpdateEmail.IMessageParsed {
        return {
            userId: parseInt(arrayMsg[0]),
            userName: arrayMsg[1],
            userEmail: arrayMsg[2],
            postTitle: arrayMsg[3],
            postContent: arrayMsg[4],
            postId: arrayMsg[5],
            teamId: parseInt(arrayMsg[6]),
            subdomain: arrayMsg[7],
        };
    }

}
