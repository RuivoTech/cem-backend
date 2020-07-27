import knex from "../database/connection";

import { Parentes } from "../interfaces/ParentesInterface";
import { Familia } from "../interfaces/FamiliaInterface";
import { Filhos } from "../interfaces/FilhosInterface";

class FamiliaModel {
    async create(parentes: Parentes, chEsMembro: Number) {
        const trx = await knex.transaction();

        const familiaInserir = {
            chEsMembro,
            chEsConjuge: parentes.familia?.chEsConjuge,
            chEsPai: parentes.familia?.chEsPai,
            chEsMae: parentes.familia?.chEsMae
        }

        const filhos = parentes.filhos?.map(async filho => {
            await trx("filhos").transacting(trx).insert({
                chEsMembro,
                chEsFilho: filho.chEsFilho
            });

            return {
                chEsMembro,
                chEsFilho: filho.chEsFilho
            }
        })

        await trx("familia").transacting(trx).insert(familiaInserir);

        trx.commit();

        return {
            familiaInserir,
            filhos
        }
    }

    async update(parentes: Parentes, chEsMembro: Number) {
        try {
            const familiaAtualizar = {
                chEsMembro,
                chEsConjuge: parentes.familia?.chEsConjuge,
                chEsPai: parentes.familia?.chEsPai,
                chEsMae: parentes.familia?.chEsMae
            }

            const filhos = parentes.filhos?.map(async filho => {
                await knex("filhos")
                    .where("chEsMembro", chEsMembro)
                    .update({
                        chEsMembro,
                        chEsFilho: filho.chEsFilho
                    });

                return {
                    chEsMembro,
                    chEsFilho: filho.chEsFilho
                }
            })

            await knex("familia")
                .where("chEsMembro", chEsMembro)
                .update(familiaAtualizar);

            return {
                familiaAtualizar,
                filhos
            }
        } catch (error) {
            return error;
        }
    }

    async findMembro(id: Number) {
        const familia: Familia = await knex<Familia>("familia")
            .join("membros as conjuge", "conjuge.id", "familia.chEsConjuge")
            .leftJoin("membros as pai", "pai.id", "familia.chEsPai")
            .leftJoin("membros as mae", "mae.id", "familia.chEsMae")
            .where("familia.chEsMembro", id)
            .select("familia.*", "conjuge.nome as nomeConjge", "pai.nome as nomePai", "mae.nome as nomeMae")
            .first();

        const filhos: Filhos[] = await knex<Filhos[]>("filhos AS f")
            .where("f.chEsMembro", String(id))
            .join("membros AS m", "m.id", "f.chEsFilho")
            .join("membro_contato AS mc", "mc.chEsMembro", "f.chEsFilho")
            .join("contatos AS c", "c.id", "mc.chEsContato")
            .select("f.*", "m.nome AS nomeFilho", "c.email", "c.telefone", "c.celular");

        return { familia, filhos };
    }

    async removeMembro(chEsMembro: Number) {
        const trx = await knex.transaction();

        await trx("familia")
            .transacting(trx)
            .where({ chEsMembro })
            .delete();

        await trx("filhos")
            .transacting(trx)
            .where({ chEsMembro })
            .delete();

        trx.commit();

        return "OK";
    }
}

export default FamiliaModel;