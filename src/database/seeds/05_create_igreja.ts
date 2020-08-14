import Knex from "knex";

interface Igreja {
    ehBatizado: boolean,
    dataBatismo: string,
    igrejaBatizado: string,
    ultimoPastor: string,
    ultimaIgreja: string,
    chEsMembro: number
}

export async function seed(knex: Knex) {
    await knex('cem_new.dadosIgreja as di')
        .join("cem_new.membros as m", "m.chEsIgreja", "di.id")
        .join("cem_testes.membros as mt", "mt.nome", "m.nome")
        .select(
            "di.isBatizado as ehBatizado",
            "di.dataBatismo",
            "di.igrejaBatizado",
            "di.ultimoPastor",
            "di.ultimaIgreja",
            "mt.id as chEsMembro"
        )
        .then(async (response: Igreja[]) => {
            await Promise.all(response.map(async igreja => {
                await knex('igreja').insert({
                    ehBatizado: igreja.ehBatizado,
                    dataBatismo: igreja.dataBatismo,
                    igrejaBatizado: igreja.igrejaBatizado,
                    ultimoPastor: igreja.ultimoPastor,
                    ultimaIgreja: igreja.ultimaIgreja,
                    chEsMembro: igreja.chEsMembro
                });
            }));

        });
    ;
}