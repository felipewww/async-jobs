import { MySQL } from "@Data/Source/MySQL/MySQL";

export class UserModel extends MySQL {
    upsertEmailValidationCode(
        userId: number,
        email: string,
        code: string,
    ) {
        const q = this.builder
            .table('user_email_validation')
        // knex('table')
            .insert({
                id: userId,
                email,
                code,
                status: 0
            })
            // @ts-ignore
            .onConflict<any>('id')
            .merge({
                id: userId,
                email,
                code,
                status: 0
            })

        return this.exec(q);
    }
}
