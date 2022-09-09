import { HttpResponse } from "@Presentation/Http/Http";

export class InternalServerError extends HttpResponse {
    constructor(e: Error) {
        super(500);
        this.logError(e);
    }
}