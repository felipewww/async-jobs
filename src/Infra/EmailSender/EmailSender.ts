import {AWSEmailSender} from "@Infra/EmailSender/AWSEmailSender";
import { TemplateCompiler } from "@Infra/TemplateCompiler";
import {HTMLLoader} from "@Infra/HTMLLoader";

export interface IEmailTemplateEstruct {
    user: {
        id: number|string,
        name: string,
        email: string,
        teamId: number
    },
}

export interface IEmailHeader {
    name: string,
    value: string
}

export class EmailSender<TEMPLATE_DATA_ESTRUCT extends IEmailTemplateEstruct> {

    private headers: Array<IEmailHeader> = [];

    constructor(
        // protected data: TEMPLATE_DATA_ESTRUCT,
        protected templateCompiler: TemplateCompiler<TEMPLATE_DATA_ESTRUCT>,
        protected AWSEmailSender: AWSEmailSender,
    ) {
    }

    public send(
        data: TEMPLATE_DATA_ESTRUCT,
        subject: string,
    ) {
        this.setDefaultHeaders(data);

        this.AWSEmailSender.setHeaders(this.headers)

        return this.AWSEmailSender.send(
            data.user.email,
            this.templateCompiler.compile(data),
            subject
        )
    }

    private setDefaultHeaders(data: TEMPLATE_DATA_ESTRUCT) {
        this.headers.push({ name: 'team-id', value: data.user.teamId.toString() })
        this.headers.push({ name: 'user-id', value: data.user.id.toString() })
    }
}

export function EmailSenderFactory<TEMPLATE_DATA_ESTRUCT extends IEmailTemplateEstruct>(templateName: string) {
    const html = HTMLLoader.require(templateName)

    return new EmailSender(
        // data,
        new TemplateCompiler<TEMPLATE_DATA_ESTRUCT>(html),
        new AWSEmailSender()
    )
}