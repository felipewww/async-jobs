import Knex from "knex";
import {Filterable} from "@Data/Source/MySQL/Utils/QueryFilters/Filterable";

export abstract class MySQL {
    public builder: Knex;
    private filters: Array<Filterable>;

    constructor(teamSubdomain: string){

        if (teamSubdomain === '' || !teamSubdomain) {
            throw new Error('Invalid team subdomain');
        }

        let dbHost: string = this.getDbHost(teamSubdomain);

        this.builder = Knex({
            client: 'mysql2',
            connection: {
                host : dbHost,
                user : process.env.DB_USER,
                password : process.env.DB_PASS,
                database : process.env.DB_NAME,
                port: 3306
            },
            pool: {
                min: 0,
                max: 1
            }
        });
    }

    public withFilters(filters: Array<Filterable>) {
        this.filters = filters;
    }

    protected async exec(query: Knex.QueryBuilder): Promise<Array<any>> {

        if (this.filters && this.filters.length) {
            this.filters.forEach((filter: Filterable) => {
                filter.apply(query);
            });
        }

        return query;
    }

    private getDbHost(teamSubdomain: string|number) {
        switch (teamSubdomain) {
            case 'fis':
            case 'fisnovatos':
            case 'fisacesso':
            case 'fisafinz':
            case 'fiscencosud':
            case 'fiscolombo':
            case 'fisdaycoval':
            case 'fishsfinanceira':
            case 'fisleader':
            case 'fisoriginal':
            case 'fispan':
            case 'fissafra':
            case 'fislearning':
            case 'cxcommunicationfis':
            case 'fismercadopago':
            case 'fissantander':
            case 'fisdigio':
            case 'fiscredz':
            case 'fisbradesco':
            case 'fisbrb':
            case 'fispicpay':
                return process.env.DB_HOST_FIS;

            case 'jv':
                return process.env.DB_HOST_JV;

            case 'mapfre':
            case 'mapfrecsc':
            case 'mapfresinistro':
            case 'mapfreemissao':
            case 'bancomapfre':
                return process.env.DB_HOST_MAPFRE;

            default:
                return process.env.DB_HOST;
        }
    }

    private clearBuilder() {
        this.builder.clearCounters();
        this.builder.clearGroup();
        this.builder.clearHaving();
        this.builder.clearOrder();
        this.builder.clearSelect();
        this.builder.clearWhere();
    }
}