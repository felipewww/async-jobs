import {Express, NextFunction, Request, Response} from "express";
import {NotFound} from "@Infra/Utils/HttpResponse/NotFound";

import {SesConfirmationPresenter} from "@Presentation/SesConfirmationPresenter";
import {SesBouncedPresenter} from "@Presentation/SesBouncedPresenter";

export class Routes {
    constructor(
        private app: Express
    ) {

    }

    setRoutes() {

        this.app.post('/ses-bounced', (req: Request, res: Response) => {

            // aws always send message as a text/plain
            const body = JSON.parse(req.body)

            if (
                req.headers['x-amz-sns-message-type']
            ) {
                console.log("req.headers['x-amz-sns-message-type']".yellow.bold)
                console.log(req.headers['x-amz-sns-message-type'])

                const messageType: string = req.headers['x-amz-sns-message-type'] as string

                let presenter;
                switch (messageType){
                    /**
                     * Remeber to register NGROK endpoint into AWS SNS notification HTTPS type
                     * */
                    case 'SubscriptionConfirmation':
                        presenter = new SesConfirmationPresenter(body.SubscribeURL)
                        break;

                    case 'Notification':
                        presenter = new SesBouncedPresenter(body)
                        break;

                    default:
                        res.status(501)
                        res.send('not implemented for type ' + messageType)

                }

                presenter.handle()
                    .then(res => {
                        console.log(messageType + ' handler success'.green.bold)
                        console.log(res)
                    })
                    .catch(res => {
                        console.log(messageType + ' handler error'.red.bold)
                        console.log(res)
                    })

                res.end();
            } else {
                console.log('message type is required')
                res.status(400)
                res.send('message type is required')

                return;
            }
        })
    }

    private notFound() {
        this.app.use('/api/v1', (req: Request, res: Response) => {
            const notFoundResult = new NotFound();
            res.sendStatus(notFoundResult.getStatusCode());
        })
    }
}
