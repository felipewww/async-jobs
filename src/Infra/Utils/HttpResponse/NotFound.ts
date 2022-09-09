import { HttpResponse } from "@Presentation/Http/Http";

export class NotFound extends HttpResponse {

    constructor() {
        super(404);
    }
}