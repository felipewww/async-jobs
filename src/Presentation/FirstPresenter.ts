import {BasePresenter} from "@felipewww/clean-type";

export class FirstPresenter extends BasePresenter<any, any>{
    constructor() {
        super();
    }

    async handle(): Promise<any> {
        return this.response.Success({status: "Woohoo!"})
    }
}
