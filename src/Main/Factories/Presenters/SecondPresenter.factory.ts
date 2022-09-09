import {SecondPresenter} from "@Presentation/SecondPresenter";
import {HTMLRequirer} from "@Utils/HTMLRequirer";
import {EmailConfirmationCompiler, IEmailConfirmationData, TemplateCompiler} from "@Utils/TemplateCompiler";
import {SendRegisterMailUseCase} from "@Domain/SendRegisterMailUseCase";
import {EmailSender} from "@Utils/EmailSender";

export function SecondPresenterFactory(req: any) {
    const htmlRequirer = new HTMLRequirer();
    const html = htmlRequirer.require('register-email-confirmation')

    const dataForCompile = [
        {
            confirmationUrl: 'teste',
            user: {
                name: 'Felipe',
                email: 'teste'
            }
        }
    ];

    // new EmailConfirmationCompiler()
    const sendRegisterMailUseCase = new SendRegisterMailUseCase(
        dataForCompile,
        dataForCompile,
        new EmailConfirmationCompiler(html),
        new EmailSender()
    )

    return new SecondPresenter(
        sendRegisterMailUseCase
    );
}
