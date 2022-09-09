import {QueryBuilder} from "knex";
import {Filterable} from "@Data/Source/MySQL/Utils/QueryFilters/Filterable";

export class FilterWhere extends Filterable {
    apply(query: QueryBuilder) {
        if (this.values === null) {
            query.whereNull(this.key)
        } else {
            if (typeof this.values === 'object') {
                query.whereIn(this.key, this.values);
            } else {
                query.where(this.key, this.values);
            }
        }

    }
}
