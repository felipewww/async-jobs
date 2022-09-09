import { HttpResponse } from "@Presentation/Http/Http";

export class Forbidden extends HttpResponse {

    constructor() {
        super(403);
    }
}