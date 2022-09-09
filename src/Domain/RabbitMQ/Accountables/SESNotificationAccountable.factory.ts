import {IBounceEmailMessageParsed} from "@Infra/RabbitMQ/queues/BounceEmailQueue";
import {SESNotificationAccountable} from "@Domain/RabbitMQ/Accountables/SESNotificationAccountable";

export function SESNotificationAccountableFactory(msg: IBounceEmailMessageParsed) {
    return new SESNotificationAccountable(msg)
}