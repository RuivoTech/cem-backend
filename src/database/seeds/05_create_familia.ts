import Knex from "knex";

interface Familia {
    chEsConjuge: number,
    chEsMembro: number
}

export async function seed(knex: Knex) {
    await knex.raw(`SELECT
	nm.id AS chEsMembro,
	nm.nome AS membro,
	tm.id AS chEsConjuge,
	tm.nome AS conjuge
FROM 
	cem_testes.membros AS tm
INNER JOIN (    
    SELECT
    	m.nome AS nomeMembro,
        con.id AS idConjuge,
        con.nome AS conjuge
    FROM 
        cem_new.membros AS m
    JOIN
        cem_new.membros AS con ON con.chEsConjuge = m.id
    ) AS c ON c.conjuge = tm.nome
JOIN 
	cem_testes.membros as nm ON c.nomeMembro = nm.nome`)
        .then(async (response) => {
            console.log(response)
            await Promise.all(response[0].map(async (familia: Familia) => {
                await knex('familia').insert({
                    chEsMembro: familia.chEsMembro,
                    chEsConjuge: familia.chEsConjuge
                });
            }));

        });
    ;
}