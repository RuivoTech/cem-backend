import Knex from "knex";

export async function seed(knex: Knex) {
    await knex('cem_new.membros')
        .select(
            "nome",
            "rg as identidade",
            "dataNasc as dataNascimento",
            "estadoCivil", "sexo", "profissao", "ativo")
        .then(async response => {
            await knex('membros').insert(response);
        });
    ;
}