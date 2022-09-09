import {Request, Response} from "express";
import {HttpResponse, IHttpRequest} from "@Presentation/Http/Http";
import {Presenter} from "@Presentation/Http/Presenter";
import {CustomError} from "@Infra//Utils/HttpResponse/Errors/CustomError";
import {LogError} from "@Infra//Utils/LogError";

export class ResponseAdapter {

    private presenter: Presenter;

    constructor(
        private presenterFactory: Function,
        private request: IHttpRequest,
        private response: Response
    )
    {
        if( this.tryInstancePresenter() ) {
            this.handlePresenter();
        }
    }

    private tryInstancePresenter() {
        try {
            this.presenter = this.presenterFactory(this.request, this.response.locals.session)
        } catch (err) {

            let status = 500;

            if (err instanceof CustomError) {
                status = 400;
            }
            else if (err instanceof HttpResponse) {
                status = err.getStatusCode()
            }

            if (status === 500) {
                LogError.save(this.request, err);
            }

            this.response.status(status);
            this.response.json(err);

            return false;
        }

        return true;
    }

    private handlePresenter() {
        this.presenter.handle()
            .then((result: HttpResponse) => {
                let jsonResponse: any = {};

                this.response.status(result.getStatusCode());

                if (result.getStatusCode() === 200) {
                    jsonResponse.data = result.data;
                } else {
                    jsonResponse.error = result.error;
                }

                this.response.json(jsonResponse);
            })
            .catch((err: any) => {
                this.response.status(500);
                LogError.save(this.request, err);
            })
    }

    public static adapt(presenterFactory: Function, request: IHttpRequest, response: Response) {
        new ResponseAdapter(presenterFactory, request, response);
    }

    public static sendStatus(response: Response, httpResponse: HttpResponse) {
        response.sendStatus(httpResponse.getStatusCode());
    }
}
