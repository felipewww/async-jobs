import handlebars from "handlebars";

export class TemplateCompiler<T> {
    constructor(
        protected template: string,
    ) {

    }

    public compile(data: T) {
        const compiled = handlebars.compile(this.template)
        const output = compiled(data)

        return output
    }
}
