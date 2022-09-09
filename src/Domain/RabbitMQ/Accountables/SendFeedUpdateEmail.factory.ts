import { Message } from "amqplib";
import IMessageParsed = SendFeedUpdateEmail.IMessageParsed;
import {FeedUpdateEmailData, SendFeedUpdateEmail} from "@Domain/RabbitMQ/Accountables/SendFeedUpdateEmail";
import {EmailSenderFactory} from "@Infra/EmailSender/EmailSender";

export function SendFeedUpdateEmailUseCaseFactory(msg: IMessageParsed, fullMsg: Message) {
    return new SendFeedUpdateEmail.Accountable(
        msg,
        EmailSenderFactory<FeedUpdateEmailData>('feed-update')
    )
}
