// import {CustomError} from "@Presentation/Utils/HttpResponse/Errors/CustomError";

import {CustomError} from "@Infra/Utils/HttpResponse/Errors/CustomError";

export class InvalidParamError extends CustomError {
    constructor(param: string, message: string, code?: number) {
        super(code);
        this.message = `${param} ${message}`;
    }
}