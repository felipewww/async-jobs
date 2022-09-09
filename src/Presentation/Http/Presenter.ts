import {HttpResponse, IHttpRequest} from "@Presentation/Http/Http";
import {ITokenPayload} from "@Infra//Utils/JWTHelper";

export abstract class Presenter {

    protected constructor(
        protected request: IHttpRequest,
        protected session: ITokenPayload,
    ) {

    }

    public abstract handle(): Promise<HttpResponse>;
}
