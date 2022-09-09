import { EmailValidationData, EmailValidationRequest } from "@Domain/RabbitMQ/Accountables/EmailValidationRequest";
import {EmailSenderFactory} from "@Infra/EmailSender/EmailSender";

export function EmailValidationRequestFactory(message: EmailValidationRequest.IMessageParsed) {
    return new EmailValidationRequest.Accountable(
        message,
        EmailSenderFactory<EmailValidationData>('email-validation')
    )
}
