import Knex from "knex";

interface MinisterioMembro {
    id: number,
    chEsMembro: number,
    chEsMinisterio: number,
    checked: boolean
}

export async function seed(knex: Knex) {
    await knex("cem_new.ministerioMembro AS nmn")
        .join("cem_new.membros AS nm", "nm.id", "nmn.chEsMembro")
        .join("cem_testes.membros AS tm", "tm.nome", "nm.nome")
        .join("cem_new.ministerios AS min", "nmn.chEsMinisterio", "min.id")
        .join("cem_testes.ministerios AS tmin", "tmin.nome", "min.nome")
        .select("tm.id AS chEsMembro", "tmin.id AS chEsMinisterio", "nmn.checked")
        .then(async (response: MinisterioMembro[]) => {
            await Promise.all(response.map(async ministerio => {

                await knex("ministerioMembro").insert({
                    chEsMembro: ministerio.chEsMembro,
                    chEsMinisterio: ministerio.chEsMinisterio,
                    checked: ministerio.checked
                });
            }))
        })
}