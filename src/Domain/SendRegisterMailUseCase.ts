import {IEmailConfirmationData} from "@Utils/TemplateCompiler";
import {EmailSenderUseCase} from "@Domain/EmailSenderUseCase";

// https://docs.aws.amazon.com/ses/latest/DeveloperGuide/send-email-simulator.html

export class SendRegisterMailUseCase extends EmailSenderUseCase<IEmailConfirmationData, IEmailConfirmationData> {

    async handle(): Promise<any> {
        this.send(this.entryData[0]);

        return Promise.resolve({status: "WooHoo from useCase!"});
    }

}
