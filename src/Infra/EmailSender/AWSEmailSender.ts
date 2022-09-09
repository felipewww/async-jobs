import AWS, {SESV2} from "aws-sdk";
import {SendRawEmailRequest} from "@aws-sdk/client-ses";

export class AWSEmailSender {

    private headers = [];

    /** todo
    * configurar uma identity para DEV e HML poderem enviar bounce sem impactar em prod
    * configurar SES-config
    * */
    public send(destination: any, template: string, subject: string) {
        const credentials = new AWS.EnvironmentCredentials('AWS');

        AWS.config.credentials = credentials;
        AWS.config.update({region: process.env.AWS_REGION});

        /*
        * TODO explicar sobre como enviar raw mail e porque, inclsive o \n em branco antes do template
        *  doc for RAW MSG
        * https://docs.aws.amazon.com/ses/latest/dg/event-publishing-send-email.html#event-publishing-using-ses-headers
        * */
        const from = "Kiwiki<no-reply@kiwiki.io>";

        const rawObj: SendRawEmailRequest = {
            Source: "Kiwiki<no-reply@kiwiki.io>",
            // Destinations: [destination],
            RawMessage: {
                Data: Buffer.from(`X-SES-CONFIGURATION-SET: SES-config
                                \n${this.headers.join("\n")}
                                \nFrom: ${from}
                                \nTo: ${destination}
                                \nSubject: ${subject}
                                \nContent-Type: text/html; charset=UTF-8
                                \nContent-Transfer-Encoding: 7bit
                                \n
                                \n${template}
                                `)
            }
        }

        return new AWS.SES()
            .sendRawEmail(rawObj)
            .promise()
    }

    public setHeaders(headers: Array<{ name: string, value: string }>) {
        for (let headerCfg of headers) {
            const asString = `X-KWK-${headerCfg.name.toUpperCase()}: ${headerCfg.value}`
            this.headers.push(asString)
        }
    }
}


