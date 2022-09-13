import {debug} from "./app";
import {EmailSenderFactory} from "@Infra/EmailSender/EmailSender";

setTimeout(() => {

    const data = {
        user: {
            id: 16650,
            name: 'fake teste',
            teamId: 182,
            // email: 'felipewww@outlook.com.br',
            // email: 'bounce@simulator.amazonses.com'
            // email: 'felipee.php@gmail.com'
            email: 'bounceteste@promosimples.io'
            // email: 'complaint@simulator.amazonses.com'
            // email: 'supressionlist@simulator.amazonses.com'
        },
        confirmationUrl: 'http://fake.url'
    }

    const emailSender = EmailSenderFactory('register-email-confirmation')

    emailSender
        .send(data, 'Final email confirmation')
        .then(res => {
            debug('EMAIL SENT!', 'ok')
            debug(res)
        })
        .catch(err => {
            debug('error', 'error')
            debug(err)
        })
}, 3000)
