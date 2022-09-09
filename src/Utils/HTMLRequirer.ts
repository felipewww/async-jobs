import fs from "fs";
import path from "path";

export class HTMLRequirer {

    require(templateFileName: string) {
        const templatePath = `../../templates/${templateFileName}.html`;

        return  fs.readFileSync(path.resolve(__dirname, templatePath), 'utf8')
    }
}
