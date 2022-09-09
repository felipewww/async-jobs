// import { FeedItemRequireEmail } from "@Domain/MessageAccountables/FeedItemRequireEmail";
// import { PostModel } from "@Data/Source/MySQL/Notification/PostModel";
import { RabbitConnectorInstance } from "@Infra/RabbitMQ/RabbitConnector";
import { RabbitMQ } from "kiwiki-infra-modules";
import {FeedItemRequireEmail} from "@Domain/RabbitMQ/Accountables/FeedItemRequireEmail";

export function FeedItemRequireEmailFactory(message: FeedItemRequireEmail.IMessageParsed) {
    return new FeedItemRequireEmail.Accountable(
        // new PostModel(message.subdomain),
        {},
        message,
        new RabbitMQ.Producer(
            RabbitConnectorInstance.Exchanges.FEED_EMAIL_SENDER,
            RabbitConnectorInstance.Connections.PRODUCERS
        )
    )
}
