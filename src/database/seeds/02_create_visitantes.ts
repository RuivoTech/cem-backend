import Knex from "knex";

export async function seed(knex: Knex) {
    await knex('cem_new.visitante')
        .select("nome", "dataVisita", "religiao", "visita AS querVisita")
        .then(async response => {
            await knex('visitantes').insert(response);
        });
    ;
}