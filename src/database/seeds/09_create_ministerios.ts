import Knex from "knex";

interface Ministerio {
    id: number,
    nome: string,
    descricao: string
}

export async function seed(knex: Knex) {
    await knex("cem_new.ministerios")
        .then(async (response: Ministerio[]) => {
            await Promise.all(response.map(async ministerio => {

                await knex("ministerios").insert({
                    nome: ministerio.nome,
                    descricao: ministerio.descricao
                });
            }))
        })
}