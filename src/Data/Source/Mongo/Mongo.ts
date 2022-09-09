import {Db, MongoClient} from "mongodb";

export abstract class Mongo {

    protected connection: MongoClient;

    protected connectionURL: string;
    constructor(
        protected dbUser,
        protected dbPass,
        protected dbName,
        protected dbHost,
        protected dbPort,
    ) {
    }

    public connectionSettings(
        dbUser: string,
        dbPass: string,
        dbName: string,
        dbHost: string,
        dbPort: string,
    ) {
        this.dbUser = dbUser;
        this.dbPass = dbPass;
        this.dbName = dbName;
        this.dbHost = dbHost;
        this.dbPort = dbPort;

        return this;
    }

    protected async db(): Promise<Db> {

        await this.connect();
        return this.connection.db(this.dbName)

    }

    protected async exec(query: Promise<any>): Promise<any> {

        // Uma instancia de model que executa 2 queries, a primeira query sempre encerra a conexão. Conectar de novo
        if (!this.connection) {
            await this.connect();
        }

        return new Promise((resolve, reject) => {
            query
                .then(res => {
                    resolve(res);
                })
                .catch(res => {
                    reject(res);
                })
                .finally(() => {
                    this.connection.close();
                })
        });
    }

    private async connect() {
        const user = encodeURIComponent(this.dbUser);
        const pass = encodeURIComponent(this.dbPass);

        this.connectionURL = `mongodb://${user}:${pass}@${this.dbHost}:${this.dbPort}`;

        const client = new MongoClient(this.connectionURL, { useUnifiedTopology: true });
        this.connection = await client.connect();
    }
}
