import { RabbitConnectorInstance } from "@Infra/RabbitMQ/RabbitConnector";
import { RabbitMQ } from "promo-infra-modules";
import { ConsumerLogger } from "@Infra/RabbitMQ/ConsumerLogger";
import {SendFeedUpdateEmailUseCaseFactory} from "@Domain/RabbitMQ/Accountables/SendFeedUpdateEmail.factory";
import {SendFeedUpdateEmail} from "@Domain/RabbitMQ/Accountables/SendFeedUpdateEmail";

export class FeedEmailSenderConsumer extends RabbitMQ.Consumer<SendFeedUpdateEmail.IMessageParsed> {
    prefetch = 10;
    waitTime = 2000;

    constructor(

    ) {
        super(
            RabbitConnectorInstance.Queues.FEED_EMAIL_SENDER,
            SendFeedUpdateEmailUseCaseFactory,
            new ConsumerLogger(),
        );
    }
}
