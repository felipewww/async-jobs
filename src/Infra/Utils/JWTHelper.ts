import * as jwt from 'jsonwebtoken';

export interface ITokenPayload {
    subdomain: string;
    teamId: number;
    userId: number;
    groups: string
}

export class JWTHelper {

    public static devAuth() {
        return jwt.sign({
            teamId: 1,
            subdomain: 'dev',
            userId: 16650,
        }, process.env.APP_SECRET)
    }

    public static validate(sentToken: string): boolean|ITokenPayload {
        try {
            let decoded = jwt.verify(sentToken, process.env.APP_SECRET);
            return <ITokenPayload>decoded;
        } catch (e) {
            return false;
        }
    }
}
