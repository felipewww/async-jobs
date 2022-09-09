import {FirstPresenter} from "@Presentation/FirstPresenter";

export function FirstPresenterFactory(req: any) {
    return new FirstPresenter()
}
