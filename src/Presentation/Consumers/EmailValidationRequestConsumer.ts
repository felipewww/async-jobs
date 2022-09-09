import { RabbitMQ } from "kiwiki-infra-modules";
import { RabbitConnectorInstance } from "@Infra/RabbitMQ/RabbitConnector";
import { ConsumerLogger } from "@Infra/RabbitMQ/ConsumerLogger";
import {EmailValidationRequest} from "@Domain/RabbitMQ/Accountables/EmailValidationRequest";
import {EmailValidationRequestFactory} from "@Domain/RabbitMQ/Accountables/EmailValidationRequest.factory";

export class EmailValidationRequestConsumer extends RabbitMQ.Consumer<EmailValidationRequest.IMessageParsed> {
    prefetch = 4;
    waitTime = 2000;

    constructor() {
        super(
            RabbitConnectorInstance.Queues.EMAIL_VALIDATION_REQUEST,
            EmailValidationRequestFactory,
            new ConsumerLogger(),
        );
    }
}
