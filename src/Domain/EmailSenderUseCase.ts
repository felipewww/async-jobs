import {IEntryData, TemplateCompiler} from "@Utils/TemplateCompiler";
import {Domain} from "@felipewww/clean-type";
import {EmailSender} from "@Utils/EmailSender";

export abstract class EmailSenderUseCase<ENTRY_DATA extends IEntryData, COMPILER_DATA> extends Domain.UseCase<any> {

    constructor(
        protected entryData: Array<ENTRY_DATA>,
        protected dataForCompile,
        protected templateCompiler: TemplateCompiler<COMPILER_DATA>,
        protected emailSender: EmailSender,
    ) {
        super();
    }

    send(data: COMPILER_DATA) {
        this.emailSender.send(
            this.getEmailsArray(),
            this.templateCompiler.compile(data)
        )
    }

    getEmailsArray(): Array<string> {
        const list = [];
        for (let item of this.entryData) {
            if (!item.user || !item.user.email) {
                throw new Error('Cannot get email from entry data')
            }

            list.push(item.user.email);
        }

        return list;
    };
}
