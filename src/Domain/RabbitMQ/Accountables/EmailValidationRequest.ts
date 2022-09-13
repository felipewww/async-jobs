import {EmailSender, IEmailTemplateEstruct} from "@Infra/EmailSender/EmailSender";
import { RabbitMQ } from "promo-infra-modules";

export interface EmailValidationData extends IEmailTemplateEstruct {
    link: string
}

export namespace EmailValidationRequest {
    export type IMessageParsed = {
        id: number,
        name: string,
        email: string,
        teamId: number,
        subdomain: string,
    }

    export class Accountable implements RabbitMQ.IMessageAccountable<IMessageParsed> {

        constructor(
            private data: IMessageParsed,
            private sender: EmailSender<EmailValidationData>
        ) {

        }

        async exec() {
            console.log('EXECUTING EMAIL VALIDATION REQ!!!! TODO!!!')
            const data: EmailValidationData = {
                user: {
                    id: 1,
                    name: 'asd',
                    email: 'asd',
                    teamId: 111,
                },
                link: 'fakelink'
            }

            await this.sender.send(data, 'Verificação de email')
            // const msg = `${this.data.id}|${this.data.email}|${this.data.teamId}|${this.data.subdomain}`
            // const code = crypto.createHash('md5').update(msg).digest('hex');
            //
            // await this.userModel.upsertEmailValidationCode(
            //     this.data.id,
            //     this.data.email,
            //     code,
            // )
            //
            // const subject = 'Beedoo - Verificação de email'
            //
            // const protocol = (process.env.NODE_ENV === 'dev') ? 'http' : 'https';
            // const domain = (process.env.NODE_ENV === 'dev') ? '.localhost' : '.beedoo.io';
            //
            // const link = `${protocol}://${this.data.subdomain}${domain}/feed?email-validation=${code}`
            //
            // const data: EmailValidationData = {
            //     user: {
            //         id: this.data.id,
            //         name: this.data.name,
            //         email: this.data.email
            //     },
            //     link
            // }
            //
            // await this.send(data, subject);
        }
    }
}
