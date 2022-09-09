import { HttpResponse } from "@Presentation/Http/Http";

export class Unauthorized extends HttpResponse {

    constructor() {
        super(401);
    }
}