import knex from "../database/connection";

import { Igreja } from "../interfaces/IgrejaInterface";

class IgrejaModel {
    async create(igreja: Igreja, chEsMembro: Number) {
        const trx = await knex.transaction();

        const igrejaIserir = {
            ehBatizado: igreja.ehBatizado,
            dataBatismo: igreja.dataBatismo,
            igrejaBatizado: igreja.igrejaBatizado,
            ultimoPastor: igreja.ultimoPastor,
            ultimaIgreja: igreja.ultimaIgreja,
            chEsMembro
        }

        const insertedId = await trx("contatos").transacting(trx).insert(igrejaIserir);
        const igrejaId = insertedId[0];

        trx.commit();

        return {
            id: igrejaId,
            ...igrejaIserir
        }
    }

    async update(igreja: Igreja, chEsMembro: Number) {
        const trx = await knex.transaction();

        const igrejaAtualizar = {
            id: igreja.id,
            ehBatizado: igreja.ehBatizado,
            dataBatismo: igreja.dataBatismo,
            igrejaBatizado: igreja.igrejaBatizado,
            ultimoPastor: igreja.ultimoPastor,
            ultimaIgreja: igreja.ultimaIgreja,
            chEsMembro
        }

        await trx("contatos")
            .transacting(trx)
            .where("id", igreja.id)
            .insert(igrejaAtualizar);

        trx.commit();

        return igrejaAtualizar;
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