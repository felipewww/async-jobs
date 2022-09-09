import axios from "axios";
import {debug} from "../app";
import {RabbitMQ} from "kiwiki-infra-modules";
import {RabbitConnectorInstance} from "@Infra/RabbitMQ/RabbitConnector";
import {IEmailHeader} from "@Infra/EmailSender/EmailSender";
import {IBounceEmailMessageParsed} from "@Infra/RabbitMQ/queues/BounceEmailQueue";

export class SesBouncedPresenter {

    constructor(
        private body: any,
        // private headers: any,
    ) {

    }

    async handle() {

        const message = JSON.parse(this.body.Message)

        console.log('BOUNCE MESSAGE ENDPOINT!'.bgCyan.white.bold);
        console.log(this.body)
        console.log(message)

        // só acontece quando adicionar um listener na AWS
        if (message.notificationType === 'AmazonSnsSubscriptionSucceeded') {
            return Promise.resolve();
        }

        console.log('---------------------------------'.yellow)
        console.log(message.mail.headers)

        const {userId, teamId} = this.getTeamAndUserIDFromHeaders(message.mail.headers)

        console.log('userId,teamId FROM HEADERS!'.bgGreen.bold)
        console.log(userId,teamId)

        const producer = new RabbitMQ.Producer(
            RabbitConnectorInstance.Exchanges.BOUNCE_EMAIL,
            RabbitConnectorInstance.Connections.PRODUCERS
        )

        const msg: IBounceEmailMessageParsed = {
            source: message.mail.source,
            sourceArn: message.mail.sourceArn,
            sourceIp: message.mail.sourceIp,
            callerIdentity: message.mail.callerIdentity,
            sendingAccountId: message.mail.sendingAccountId,
            messageId: message.mail.messageId,
            destination: message.mail.destination[0],
            teamId,
            userId,
            timestamp: message.mail.timestamp,
            notificationType: message.notificationType
        }

        producer.publish(msg)
    }

    private getTeamAndUserIDFromHeaders(headers: Array<IEmailHeader>) {
        let userId, teamId;

        for (let header of headers) {
            if (header.name === 'X-KWK-TEAM-ID') {
                teamId = parseInt(header.value)
            }

            if (header.name === 'X-KWK-USER-ID') {
                userId = parseInt(header.value)
            }
        }

        return {userId, teamId}
    }
}