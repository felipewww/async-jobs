import fs from "fs";
import path from "path";

export class HTMLLoader {

    static require(templateFileName: string) {
        // pasta /templates na raiz do projeto - html não é transpilado com typescript
        const templatePath = `../../templates/${templateFileName}.html`;

        return  fs.readFileSync(path.resolve(__dirname, templatePath), 'utf8')
    }
}
