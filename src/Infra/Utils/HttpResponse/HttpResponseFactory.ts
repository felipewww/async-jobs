import {HttpResponse} from "@Presentation/Http/Http";
import { Success } from "./Success";
import { NotFound } from "./NotFound";
import { InternalServerError } from "./InternalServerError";
import { BadRequest } from "./BadRequest";
import { Unauthorized } from "./Unauthorized";
import { Forbidden } from "./Forbidden";

export class HttpResponseFactory {

    public static Success(data: any, code: 200|201|204 = 200): HttpResponse {
        return new Success(data, code)
    }

    public static NotFound(): HttpResponse {
        return new NotFound();
    }

    public static InternalServerError(e: Error): HttpResponse {
        return new InternalServerError(e);
    }

    public static BadRequest(e: Error): HttpResponse {
        return new BadRequest(e);
    }

    public static Unauthorized(): HttpResponse {
        return new Unauthorized();
    }

    public static Forbidden(): HttpResponse {
        return new Forbidden();
    }
}