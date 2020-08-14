import Knex from "knex";

interface Evento {
    id: number,
    descricao: string,
    dataInicio: string,
    dataFim: string,
    valor: string,
    ativo: boolean
}

export async function seed(knex: Knex) {
    await knex("cem_new.eventos")
        .then(async (response: Evento[]) => {
            await Promise.all(response.map(async evento => {

                await knex("eventos").insert({
                    descricao: evento.descricao,
                    dataInicio: evento.dataInicio,
                    dataFim: evento.dataFim,
                    valor: evento.valor,
                    ativo: evento.ativo
                });
            }))
        })
}