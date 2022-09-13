import {RabbitMQ} from "promo-infra-modules";
import {RabbitConnectorInstance} from "@Infra/RabbitMQ/RabbitConnector";
import {ConsumerLogger} from "@Infra/RabbitMQ/ConsumerLogger";
import {SESNotificationAccountableFactory} from "@Domain/RabbitMQ/Accountables/SESNotificationAccountable.factory";

export class BounceEmailConsumer extends RabbitMQ.Consumer<any> {
    constructor(

    ) {
        super(
            RabbitConnectorInstance.Queues.BOUNCE_EMAIL,
            SESNotificationAccountableFactory,
            new ConsumerLogger(),
        );
    }
}