import Knex from "knex";

interface Contato {
    email: string,
    telefone: string,
    celular: string,
    chEsMembro: number
}

export async function seed(knex: Knex) {
    await knex('cem_new.contato as c')
        .join("cem_new.membros as m", "m.chEsContato", "c.id")
        .join("cem_testes.membros as mt", "mt.nome", "m.nome")
        .select("c.email", "c.telefone", "c.celular", "mt.id as chEsMembro")
        .then(async (response: Contato[]) => {

            await Promise.all(response.map(async contato => {
                const insertedId = await knex('contatos').insert({
                    email: contato.email,
                    telefone: contato.telefone,
                    celular: contato.celular
                });
                console.log(insertedId[0])
                await knex("membro_contato")
                    .insert({
                        chEsMembro: contato.chEsMembro,
                        chEsContato: insertedId[0]
                    });
            }));

        });
    ;
}