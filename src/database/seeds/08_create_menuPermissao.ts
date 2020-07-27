import Knex from "knex";

interface MenuPermissao {
    id: number,
    nome: string,
    descricao: string,
    grupo: string
}

export async function seed(knex: Knex) {
    await knex("cem_new.menuPermissao")
        .then(async (response: MenuPermissao[]) => {
            await Promise.all(response.map(async menuPermissao => {

                await knex("menuPermissao").insert({
                    nome: menuPermissao.nome,
                    descricao: menuPermissao.descricao,
                    grupo: menuPermissao.grupo
                });
            }))
        })
}