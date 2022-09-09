import { RabbitMQ } from "kiwiki-infra-modules";
import {EmailSender, EmailSenderFactory, IEmailTemplateEstruct} from "@Infra/EmailSender/EmailSender";

export interface FeedUpdateEmailData extends IEmailTemplateEstruct {
    url: string,
    post: {
        title: string,
        content: string
    }
}

/**
 * Este accountable recebe requisiõs de envio de e-mail e dispara com EmailSender
 * todo - limitar a queue para o mesmo limite de envio da AWS por segundo ou fazer essa vlaidação aqui?
 */
export namespace SendFeedUpdateEmail {
    export type IMessageParsed = {
        userId: number,
        userName: string,
        userEmail: string,
        postTitle: string,
        postContent: string,
        postId: string,
        teamId: number,
        subdomain: string
    }

    // export class Accountable extends EmailSender<IMessageParsed, FeedUpdateEmailData> implements RabbitMQ.IMessageAccountable<IMessageParsed> {
    export class Accountable implements RabbitMQ.IMessageAccountable<IMessageParsed> {

        constructor(
            private data: IMessageParsed,
            private sender: EmailSender<FeedUpdateEmailData>
        ) {

        }

        async exec(): Promise<any> {
            const {data, subject} = this.parseMessage(this.data);

            await this.sender.send(data, subject)
        }

        private parseMessage(msg: IMessageParsed) {

            const nameCapital = msg.userName.charAt(0).toUpperCase() + msg.userName.slice(1);

            let protocol = 'https://';
            let domain = `${msg.subdomain}.kiwiki.io`;

            if (msg.subdomain === 'dev') {
                protocol = 'http://'
                domain = 'dev.localhost'
            }

            const url = `${protocol}${domain}/feed/${msg.postId}/${this.toSlug(msg.postTitle)}`

            const content = (msg.postContent.length > 250) ? msg.postContent.slice(0, 250) : msg.postContent

            const data: FeedUpdateEmailData = {
                user: {
                    id: msg.userId,
                    name: nameCapital,
                    email: msg.userEmail,
                    teamId: msg.teamId
                },
                post: {
                    title: msg.postTitle,
                    content
                },
                url
            }

            return {
                data,
                subject: `Kiwiki - Fique ligado no artigo ${msg.postTitle}`
            }
        }

        toSlug(text: string): string {
            let slug = text.normalize("NFD").replace(/\p{Diacritic}/gu, "")
            slug = slug.replace(/[^\w\s]/gi, '') // all special chars
            slug = slug.replace(/[^a-zA-Z0-9]+/g,'-');
            slug = slug.toLowerCase();

            return slug;
        }
    }
}
