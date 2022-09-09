import {BasePresenter} from "@felipewww/clean-type";
import {SendRegisterMailUseCase} from "@Domain/SendRegisterMailUseCase";

export class SecondPresenter extends BasePresenter<any, any> {
    constructor(
        private sendRegisterMailUseCase: SendRegisterMailUseCase
    ) {
        super();
    }

    async handle() {
        const result = await this.sendRegisterMailUseCase.handle()
        return this.response.Success(result)
    }
}
