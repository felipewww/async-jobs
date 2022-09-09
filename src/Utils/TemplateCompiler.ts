import handlebars from "handlebars";

export abstract class TemplateCompiler<DATA> {
    constructor(
        // protected data: DATA,
        protected template: string,
    ) {

    }

    abstract compile(data: { [key: string]: any }): string
}

export interface IEntryData {
    user: {
        name: string,
        email: string,
    },
}

export interface IEmailConfirmationData extends IEntryData {
    // user: {
    //     name: string,
    //     email: string,
    // },
    confirmationUrl: string
}

export class EmailConfirmationCompiler extends TemplateCompiler<IEmailConfirmationData>{
    constructor(
        template: string
    )
    {
        super(template)
    }

    public compile(data: IEmailConfirmationData) {
        const compiled = handlebars.compile(this.template)
        const output = compiled(data)

        return output
    }
}
