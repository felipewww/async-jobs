import { Message } from "amqplib";
import { EmailValidationRequest } from "@Domain/RabbitMQ/Accountables/EmailValidationRequest";
import {RabbitMQ} from "promo-infra-modules";

export class EmailValidationRequestQueue extends RabbitMQ.Queue<EmailValidationRequest.IMessageParsed> {

    constructor(exchange: RabbitMQ.Exchange) {
        super(exchange, 'email-validation-request');
    }

    messageParser(arrayMsg: Array<string>, rawMessage: Message): EmailValidationRequest.IMessageParsed {
        return {
            id: parseInt(arrayMsg[0]),
            name: arrayMsg[1],
            email: arrayMsg[2],
            teamId: parseInt(arrayMsg[3]),
            subdomain: arrayMsg[4],
        };
    }

}
