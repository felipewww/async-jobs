// import { Message } from "amqplib";
// import { Exchange } from "beedoo-core-modules/dist/RabbitMQ/Exchange";
// import { Queue } from "beedoo-core-modules/dist/RabbitMQ/Queue";
// import { EmailValidationRequest } from "@Domain/MessageAccountables/EmailValidationRequest";
//
// export class EmailValidationRequestQueue extends Queue<EmailValidationRequest.IMessageParsed> {
//
//     constructor(exchange: Exchange) {
//         super(exchange, 'email-validation-request');
//     }
//
//     messageParser(arrayMsg: Array<string>, rawMessage: Message): EmailValidationRequest.IMessageParsed {
//         return {
//             id: parseInt(arrayMsg[0]),
//             name: arrayMsg[1],
//             email: arrayMsg[2],
//             teamId: parseInt(arrayMsg[3]),
//             subdomain: arrayMsg[4],
//         };
//     }
//
// }
