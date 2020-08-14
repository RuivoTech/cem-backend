import Knex from "knex";

interface Oferta {
    id: number,
    valorOferta: string,
    dataOferta: string,
}

export async function seed(knex: Knex) {
    await knex("cem_new.ofertas")
        .then(async (response: Oferta[]) => {
            await Promise.all(response.map(async oferta => {

                await knex("ofertas").insert({
                    valor: oferta.valorOferta,
                    data: oferta.dataOferta,
                });
            }))
        })
}