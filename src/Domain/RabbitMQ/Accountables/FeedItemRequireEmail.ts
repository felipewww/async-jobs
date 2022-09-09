import { RabbitMQ } from "kiwiki-infra-modules";
import {SendFeedUpdateEmail} from "@Domain/RabbitMQ/Accountables/SendFeedUpdateEmail";

/**
 * Quando um item do feed requer envio de email, a fila chama este Accountable
 * para pesquisar os users que devem receber o e-mail.
 *
 * Este Accountable enfileira cada um destes usuários numa outra fila, apenas de envio de emails [SendFeedUpdateEmail]
 */
export namespace FeedItemRequireEmail {
    export type IMessageParsed = {
        id: number,
        teamId: number,
        subdomain: string
    }

    export class Accountable implements RabbitMQ.IMessageAccountable<IMessageParsed> {
        constructor(
            // private model: PostModel,
            private model: any,

            private message: IMessageParsed,
            private producer: RabbitMQ.Producer<SendFeedUpdateEmail.IMessageParsed>
        ) {

        }

        async exec() {
            console.log('EXECUTING!!!!!!!!!!!!!! TODO!')
            // const users = await this.model.findUsersWithEmail(this.message.id)
            // const posts = await this.model.findPostById(this.message.id, this.message.teamId)
            //
            // if (!users.length || !posts.length) {
            //     return;
            // }
            //
            // for (let user of users) {
            //     const msg: SendFeedUpdateEmail.IMessageParsed = {
            //         userId: user.userId,
            //         userName: user.userName,
            //         userEmail: user.userEmail,
            //         postTitle: posts[0].title,
            //         postContent: posts[0].content.replace(/<[^>]*>?/gm, ''),
            //         postId: posts[0].id,
            //         teamId: this.message.teamId,
            //         subdomain: this.message.subdomain,
            //     }
            //
            //     this.producer.publish(msg)
            // }
        }
    }
}

