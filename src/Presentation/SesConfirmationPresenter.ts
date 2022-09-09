import axios from "axios";

export class SesConfirmationPresenter {

    constructor(
        private confirmationURL: string
    ) {
    }

    async handle() {
        return axios.get(this.confirmationURL)
    }
}