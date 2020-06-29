import Knex from "knex";

interface Contato {
    email: string,
    telefone: string,
    celular: string,
    chEs: number
}

export async function seed(knex: Knex) {
    await knex('cem_new.contato as c')
        .join("cem_new.membros as m", "m.chEsContato", "c.id")
        .join("cem_testes.membros as mt", "mt.nome", "m.nome")
        .select("c.email", "c.telefone", "c.celular", "mt.id as chEs")
        .then(async (response: Contato[]) => {

            await Promise.all(response.map(async contato => {
                const insertedId = await knex('contatos').insert({
                    email: contato.email,
                    telefone: contato.telefone,
                    celular: contato.celular
                });
                console.log("Contato membro", insertedId[0])
                await knex("membro_contato")
                    .insert({
                        chEsMembro: contato.chEs,
                        chEsContato: insertedId[0]
                    });
            }));

        });
    await knex("cem_new.visitante AS v")
        .join("cem_testes.visitantes AS vt", "vt.nome", "v.nome")
        .select("v.email", "v.telefone", "v.celular", "vt.id AS chEs")
        .then(async (response: Contato[]) => {
            await Promise.all(response.map(async contato => {
                const insertedId = await knex("contatos").insert({
                    email: contato.email,
                    telefone: contato.telefone,
                    celular: contato.celular
                });
                console.log("Contato visitante", insertedId[0]);
                await knex("visitante_contato")
                    .insert({
                        chEsVisitante: contato.chEs,
                        chEsContato: insertedId[0]
                    });
            }));
        });
}