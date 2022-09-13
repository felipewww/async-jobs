import {RabbitMQ} from "promo-infra-modules";
import {IBounceEmailMessageParsed} from "@Infra/RabbitMQ/queues/BounceEmailQueue";
import {SESV2} from "aws-sdk";

export class SESNotificationAccountable implements RabbitMQ.IMessageAccountable<any> {
    constructor(
        private msg: IBounceEmailMessageParsed,
    ) {

    }

    async exec() {
        console.log('executing BOUNCE accountable...'.bgGreen.white.bold)
        console.log(this)

        switch (this.msg.notificationType){
            case "Bounce":
                await this.putInSuppressionList('BOUNCE')
                return this.Bounce();

            case "Complaint":
                await this.putInSuppressionList('COMPLAINT')
                return this.Complaint();

            default:
                console.log(`notification type "${this.msg.notificationType}" has no accountable methods!`)
                return Promise.reject(`notification type "${this.msg.notificationType}" has no accountable methods!`)
        }
    }

    // retornou por falha
    private async Bounce() {
        console.log('Fazer algo com email que falhou por BOUNCE!'.red.bold)
    }

    // marcado como lixo eletrônico
    private async Complaint() {
        console.log('Fazer algo com email que falhou por COMPLAINT!'.red.bold)
    }

    private async putInSuppressionList(reason: 'BOUNCE'|'COMPLAINT') {
        /**
         * TODO
         *
         * explicar sobre SupressionList
         * https://aws.amazon.com/pt/blogs/messaging-and-targeting/goodbye-blacklist-introducing-the-suppression-list/
         */

        const ses = new SESV2()
        ses.putSuppressedDestination({
            EmailAddress: this.msg.destination,
            Reason: 'BOUNCE'
        }).send((err, data) => {
            console.log('supression list....')
            console.log('err??')
            console.log(err)
            console.log('data??')
            console.log(data)
        })
    }
}