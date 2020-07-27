import knex from "../database/connection";

class MenuPermissaoModel {
    async index() {
        const menuPermissao = knex("menuPermissao").orderBy([{ column: "grupo", order: "asc" }, { column: "id", order: "asc" }]);

        return menuPermissao;
    }
}

export default MenuPermissaoModel;