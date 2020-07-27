import knex from "../database/connection";

import { Igreja } from "../interfaces/IgrejaInterface";

class IgrejaModel {
    async create(igreja: Igreja, chEsMembro: Number) {
        try {
            const igrejaIserir = {
                ehBatizado: igreja.ehBatizado,
                dataBatismo: igreja.dataBatismo,
                igrejaBatizado: igreja.igrejaBatizado,
                ultimoPastor: igreja.ultimoPastor,
                ultimaIgreja: igreja.ultimaIgreja,
                chEsMembro
            }

            const insertedId = await knex("contatos").insert(igrejaIserir);
            const igrejaId = insertedId[0];

            return {
                id: igrejaId,
                ...igrejaIserir
            }
        } catch (error) {
            return error;
        }
    }

    async update(igreja: Igreja, chEsMembro: Number) {
        try {
            const igrejaAtualizar = {
                id: igreja.id,
                ehBatizado: igreja.ehBatizado,
                dataBatismo: igreja.dataBatismo,
                igrejaBatizado: igreja.igrejaBatizado,
                ultimoPastor: igreja.ultimoPastor,
                ultimaIgreja: igreja.ultimaIgreja,
                chEsMembro
            }

            await knex("contatos")
                .where("id", igreja.id)
                .insert(igrejaAtualizar);

            return igrejaAtualizar;
        } catch (error) {
            return error;
        }
    }

    async findMembro(id: Number) {
        const igreja = await knex("igreja")
            .where("chEsMembro", id)
            .first();

        return igreja;
    }

    async removeMembro(chEsMembro: Number) {
        const trx = await knex.transaction();

        await trx("igreja")
            .transacting(trx)
            .where({ chEsMembro })
            .delete();

        trx.commit();

        return "OK";
    }
}

export default IgrejaModel;