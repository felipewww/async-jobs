import AWS from "aws-sdk";

export class EmailSender {
    constructor(
        // private emails: Array<string>,
        // private emailHTML: string,
    )
    {

    }

    public send(destination: any, template: string) {
        var credentials = new AWS.EnvironmentCredentials('AWS')
        AWS.config.credentials = credentials;
        AWS.config.update({region: process.env.AWS_REGION});

        var params = {
            Destination: { /* required */
                // CcAddresses: [
                //     'EMAIL_ADDRESS',
                //     /* more items */
                // ],
                ToAddresses: [
                    process.env.DEV_EMAIL_RECEIVER,
                    // 'success@simulator.amazonses.com',
                    /* more items */
                ]
            },
            Message: { /* required */
                Body: { /* required */
                    Html: {
                        Charset: "UTF-8",
                        Data: "<div>Teste</div><strong>teste strong!</strong>"
                        // Data: this.emailHTML
                    },
                    // Text: {
                    //     Charset: "UTF-8",
                    //     Data: "TEXT_FORMAT_BODY"
                    // }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: 'Test email'
                }
            },
            Source: 'no-reply@kiwiki.io', /* required */
            // ReplyToAddresses: [
            //     'EMAIL_ADDRESS',
            //     /* more items */
            // ],
        };

        var sendPromise = new AWS.SES(
            {apiVersion: '2010-12-01'})
            .sendEmail(params)
            .promise();

        sendPromise.then(
            function(data) {
                console.log(data.MessageId);
            }).catch(
            function(err) {
                console.error(err, err.stack);
            });
    }
}
