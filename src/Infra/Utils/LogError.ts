
import {ErrorTypes, MongoLog} from "@Data/Source/Mongo/MongoLog";
import {IHttpRequest} from "@Presentation/Http/Http";

export class LogError {

    public static save(request: IHttpRequest, error: Error) {
        let logError = new LogError();
        logError.save(request, error);
    }

    public save(request: IHttpRequest, error: Error) {
        const model = new MongoLog(process.env.MONGO_LOG_DB)

        model.save({
                request: {
                    headers: request.headers,
                    body: request.body,
                    params: request.params,
                },
                error: {
                    name: error.name,
                    message: error.message,
                    stack: error.stack,
                }
            }, ErrorTypes.WithRequest)
            .catch((err) => {
                console.log('Failed to save error in LogError collection');
                console.log(err);
            })
            .finally(() => {
                this.consoleLogDevelopmentMode(request, error);
            })
    }

    consoleLogDevelopmentMode(request: IHttpRequest, error: Error) {
        if (process.env.NODE_ENV === 'dev') {
            console.log('\n')
            console.log('(500) Internal server error - Development mode')
            console.log(error)
            console.log('> errored request is: ')
            console.log(request.body)
            console.log(request.params)
            console.log('\n')
        }
    }

    public static saveUnexpected(params: any, error: Error) {
        let logError = new LogError();
        logError.saveUnexpected(params, error);
    }

    public saveUnexpected(params: any, error: Error) {
        const model = new MongoLog(process.env.MONGO_LOG_DB)

        model.save({
            params: params,
            error: {
                name: error.name,
                message: error.message,
                stack: error.stack,
            }
        }, ErrorTypes.Unexpected)
            .catch((err) => {
                console.log('Failed to save error in LogError collection');
                console.log(err);
            })
            .finally(() => {
                this.consoleLogDevelopmentMode(params, error);
                if (process.env.NODE_ENV === 'dev') {
                    console.log('\n')
                    console.log('(500) Internal server error - Development mode');
                    console.log(error)
                    console.log(params)
                    console.log('\n')
                }
            })
    }
}
