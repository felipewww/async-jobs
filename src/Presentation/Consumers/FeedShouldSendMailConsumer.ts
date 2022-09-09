import { RabbitConnectorInstance } from "@Infra/RabbitMQ/RabbitConnector";
import { RabbitMQ } from "kiwiki-infra-modules";
import { ConsumerLogger } from "@Infra/RabbitMQ/ConsumerLogger";
import { FeedItemRequireEmail } from "@Domain/RabbitMQ/Accountables/FeedItemRequireEmail";
import {FeedItemRequireEmailFactory} from "@Domain/RabbitMQ/Accountables/FeedItemRequireEmail.factory";

export class FeedShouldSendMailConsumer extends RabbitMQ.Consumer<FeedItemRequireEmail.IMessageParsed> {
    constructor(

    ) {
        super(
            RabbitConnectorInstance.Queues.FEED_SHOULD_SEND_EMAIL,
            FeedItemRequireEmailFactory,
            new ConsumerLogger(),
        );
    }
}
