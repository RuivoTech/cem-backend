import Knex from "knex";

interface Endereco {
    cep: number,
    logradouro: string,
    numero: number,
    complemento: string,
    cidade: string,
    uf: string,
    chEsMembro: number
}

export async function seed(knex: Knex) {
    await knex('cem_new.endereco as e')
        .join("cem_new.membros as m", "m.chEsEndereco", "e.id")
        .join("cem_testes.membros as mt", "mt.nome", "m.nome")
        .select("e.cep", "e.logradouro", "e.complemento", "e.cidade", "e.estado", "mt.id as chEsMembro")
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

                await knex("membro_endereco")
                    .insert({
                        chEsMembro: endereco.chEsMembro,
                        chEsEndereco: insertedId[0]
                    });
            }));

        });
    ;
}