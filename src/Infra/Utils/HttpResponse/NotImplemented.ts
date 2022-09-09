import { HttpResponse } from "@Presentation/Http/Http";

export class NotImplemented extends HttpResponse {
    constructor() {
        super(501);
    }
}