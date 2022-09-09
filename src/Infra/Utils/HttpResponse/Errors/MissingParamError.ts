import {CustomError} from "@Infra/Utils/HttpResponse/Errors/CustomError";

export class MissingParamError extends CustomError {
    constructor(param: string) {
        super();
        this.message = `Missing param ${param}`
    }
}