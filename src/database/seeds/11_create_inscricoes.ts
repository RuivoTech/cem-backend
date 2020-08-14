import Knex from "knex";

interface Inscricao {
    id: number,
    nome: string,
    email: string,
    celular: string,
    telefone: string,
    pago: boolean,
    chEsEvento: number
}

export async function seed(knex: Knex) {
    await knex("cem_new.inscricoes AS ni")
        .join("cem_new.eventos AS ne", "ne.id", "ni.idEvento")
        .join("cem_testes.eventos AS te", "te.descricao", "ne.descricao")
        .select("ni.nome", "ni.email", "ni.celular", "te.id AS chEsEvento", "ni.pago")
        .then(async (response: Inscricao[]) => {
            await Promise.all(response.map(async inscricao => {

                await knex("inscricoes").insert({
                    nome: inscricao.nome,
                    email: inscricao.email,
                    celular: inscricao.celular,
                    telefone: inscricao.telefone,
                    pago: inscricao.pago,
                    chEsEvento: inscricao.chEsEvento
                });
            }))
        })
}