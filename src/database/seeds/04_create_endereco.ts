import Knex from "knex";

interface Endereco {
    cep: number,
    logradouro: string,
    numero: number,
    complemento: string,
    cidade: string,
    uf: string,
    chEs: number
}

export async function seed(knex: Knex) {
    await knex('cem_new.endereco as e')
        .join("cem_new.membros as m", "m.chEsEndereco", "e.id")
        .join("cem_testes.membros as mt", "mt.nome", "m.nome")
        .select("e.cep", "e.logradouro", "e.complemento", "e.cidade", "e.estado", "mt.id as chEs")
        .then(async (response: Endereco[]) => {

            await Promise.all(response.map(async endereco => {
                const insertedId = await knex('enderecos').insert({
                    cep: endereco.cep,
                    logradouro: endereco.logradouro,
                    numero: endereco.complemento.split(" ")[0],
                    complemento: endereco.complemento.split(" ")[1],
                    cidade: endereco.cidade,
                    uf: endereco.uf
                });
                console.log("Endereco membro", insertedId[0]);
                await knex("membro_endereco")
                    .insert({
                        chEsMembro: endereco.chEs,
                        chEsEndereco: insertedId[0]
                    });
            }));

        });
    await knex("cem_new.visitante AS v")
        .join("cem_testes.visitantes AS vt", "vt.nome", "v.nome")
        .select("v.cep", "v.logradouro", "v.complemento", "vt.id AS chEs")
        .then(async (response: Endereco[]) => {
            await Promise.all(response.map(async endereco => {
                const insertedId = await knex("enderecos").insert({
                    cep: endereco.cep,
                    logradouro: endereco.logradouro,
                    numero: endereco.complemento.split(" ")[0],
                    complemento: endereco.complemento.split(" ")[1]
                });
                console.log("Endereco visitante", insertedId[0]);
                await knex("visitante_endereco").insert({
                    chEsVisitante: endereco.chEs,
                    chEsEndereco: insertedId[0]
                });
            }));
        });
}