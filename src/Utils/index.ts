import { FiltrosConstantes } from "../Utils/FiltrosConstantes";

interface Filter {
    dataInicio: string,
    dataFim: string,
    minsiterio: string
}

class Utils {
    montarQuery(filters: Filter) {
        let where = "";
        const values = [];

        Object.keys(filters).forEach((key) => {
            if (where) {
                where += " AND ";
            }

            where += FiltrosConstantes[key];
            if (FiltrosConstantes[key].indexOf("?") !== -1) {
                values.push(filters[key]);
            }
        });

        return { where, values };
    }
}

export default Utils;
