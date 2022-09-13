import {RabbitMQ} from "promo-infra-modules";
import {FeedShouldSendMailQueue} from "@Infra/RabbitMQ/queues/FeedShouldSendMailQueue";
import {FeedEmailSenderQueue} from "@Infra/RabbitMQ/queues/FeedEmailSenderQueue";
import {EmailValidationRequestQueue} from "@Infra/RabbitMQ/queues/EmailValidationRequestQueue";
import { FeedShouldSendMailConsumer } from "@Presentation/Consumers/FeedShouldSendMailConsumer";
import { FeedEmailSenderConsumer } from "@Presentation/Consumers/FeedEmailNotifyConsumer";
import {EmailValidationRequestConsumer} from "@Presentation/Consumers/EmailValidationRequestConsumer";
import {debug} from "../../app";
import {BounceEmailQueue} from "@Infra/RabbitMQ/queues/BounceEmailQueue";
import {BounceEmailConsumer} from "@Presentation/Consumers/BounceEmailConsumer";

interface IConnections extends RabbitMQ.IConnectionsDefinitions {
    CONSUMERS: RabbitMQ.Connection,
    PRODUCERS: RabbitMQ.Connection,
}

interface IExchanges extends RabbitMQ.IExchangesDefinitions {
    FEED_SHOULD_SEND_EMAIL: RabbitMQ.Exchange,
    FEED_EMAIL_SENDER: RabbitMQ.Exchange,
    EMAIL_VALIDATION_REQUEST: RabbitMQ.Exchange,
    BOUNCE_EMAIL: RabbitMQ.Exchange,
}

interface IQueues extends RabbitMQ.IQueuesDefinitions {
    FEED_SHOULD_SEND_EMAIL: FeedShouldSendMailQueue
    FEED_EMAIL_SENDER: FeedEmailSenderQueue
    EMAIL_VALIDATION_REQUEST: EmailValidationRequestQueue
    BOUNCE_EMAIL: BounceEmailQueue
}

const user = process.env.RABBITMQ_USER;
const pass = process.env.RABBITMQ_PASS;
const host = process.env.RABBITMQ_HOST;
const connectionString = `amqp://${user}:${pass}@${host}`

export class _RabbitConnector extends RabbitMQ.RabbitConnector {
    public Connections: IConnections = {
        CONSUMERS: new RabbitMQ.Connection('consumers_conn', connectionString),
        PRODUCERS: new RabbitMQ.Connection('producers_conn', connectionString),
    }

    public Exchanges: IExchanges = {
        FEED_SHOULD_SEND_EMAIL: new RabbitMQ.Exchange('feed-should-send-email-exc'),
        FEED_EMAIL_SENDER: new RabbitMQ.Exchange('feed-email-sender-exc'),
        EMAIL_VALIDATION_REQUEST: new RabbitMQ.Exchange('email-validation-request-exc'),
        BOUNCE_EMAIL: new RabbitMQ.Exchange('bounce-email-exc'),
    }

    public Queues: IQueues = {
        FEED_SHOULD_SEND_EMAIL: new FeedShouldSendMailQueue(this.Exchanges.FEED_SHOULD_SEND_EMAIL),
        FEED_EMAIL_SENDER: new FeedEmailSenderQueue(this.Exchanges.FEED_EMAIL_SENDER),
        EMAIL_VALIDATION_REQUEST: new EmailValidationRequestQueue(this.Exchanges.EMAIL_VALIDATION_REQUEST),
        BOUNCE_EMAIL: new BounceEmailQueue(this.Exchanges.BOUNCE_EMAIL),
    };

    async init(): Promise<void> {

        try {
            await this.Connections.CONSUMERS.init(
                [
                    this.Exchanges.FEED_SHOULD_SEND_EMAIL,
                    this.Exchanges.FEED_EMAIL_SENDER,
                    this.Exchanges.EMAIL_VALIDATION_REQUEST,
                    this.Exchanges.BOUNCE_EMAIL
                ],
                [
                    new FeedShouldSendMailConsumer(),
                    new FeedEmailSenderConsumer(),
                    new EmailValidationRequestConsumer(),
                    new BounceEmailConsumer(),
                ]
            )

            await this.Connections.PRODUCERS.init()

            debug('Rabbitmq connections success!', 'ok')
        } catch (e) {
            debug('Error while try to create connections on rabbitmq','error')
            debug(e)
        }

    }

}

export const RabbitConnectorInstance = new _RabbitConnector()
RabbitConnectorInstance.init();
