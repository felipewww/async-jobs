import {RabbitMQ} from "kiwiki-infra-modules";
import {Message} from "amqplib";

export interface IBounceEmailMessageParsed {
    source: string,
    sourceArn: string,
    sourceIp: string,
    callerIdentity: string,
    sendingAccountId: string,
    messageId: string,
    destination: string,
    teamId: number,
    userId: number,
    timestamp: string,
    notificationType: 'Bounce'|'Complaint',
}

export class BounceEmailQueue extends RabbitMQ.Queue<IBounceEmailMessageParsed> {
    constructor(exchange: RabbitMQ.Exchange) {
        super(exchange, 'bounce-email');
    }

    messageParser(arrayMsg: Array<string>, rawMessage: Message) {
        return {
            source: arrayMsg[0],
            sourceArn: arrayMsg[1],
            sourceIp: arrayMsg[2],
            callerIdentity: arrayMsg[3],
            sendingAccountId: arrayMsg[4],
            messageId: arrayMsg[5],
            destination: arrayMsg[6],
            teamId: parseInt(arrayMsg[7]),
            userId: parseInt(arrayMsg[8]),
            timestamp: arrayMsg[9],
            notificationType: arrayMsg[10] as 'Bounce'|'Complaint',
        }
    }
}