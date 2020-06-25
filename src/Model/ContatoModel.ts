import knex from "../database/connection";

import { Contato } from "../interfaces/ContatoInterface";

class ContatoModel {
    async findMembro(id: Number) {
        const contato = await knex("contatos as c")
            .join("membro_contato as mc", "mc.chEsContato", "c.id")
            .where("mc.chEsMembro", id)
            .select("c.*")
            .first();

        return contato;
    }

    async create(contato: Contato) {
        const trx = await knex.transaction();

        const contatoIserir = {
            email: contato.email,
            telefone: contato.telefone,
            celular: contato.celular
        }

        const insertedId = await trx("contatos").transacting(trx).insert(contatoIserir);
        const contatoId = insertedId[0];

        trx.commit();

        return {
            id: contatoId,
            ...contatoIserir
        }
    }

    async update(contato: Contato) {
        const trx = await knex.transaction();

        const contatoAtualizar = {
            id: contato.id,
            email: contato.email,
            telefone: contato.telefone,
            celular: contato.celular
        }

        await trx("contatos")
            .transacting(trx)
            .where("id", contato.id)
            .update(contatoAtualizar);

        trx.commit();

        return contatoAtualizar;
    }

    async removeMembro(chEsMembro: Number) {
        const trx = await knex.transaction();

        await trx("contatos AS c")
            .transacting(trx)
            .join("membro_contato AS mc", "mc.chEsContato", "c.id")
            .where("mc.chEsMembro", chEsMembro)
            .delete();

        trx.commit();

        return "OK";
    }

    async findVisitante(id: Number) {
        const contato = await knex("contatos as c")
            .join("visitante_contato as mc", "mc.chEsContato", "c.id")
            .where("mc.chEsVisitante", id)
            .select("c.*")
            .first();

        return contato;
    }

    async removeVisitante(chEsVisitante: Number) {
        const trx = await knex.transaction();

        await trx("contatos AS c")
            .transacting(trx)
            .join("visitante_contato AS mc", "mc.chEsContato", "c.id")
            .where("mc.chEsVisitante", chEsVisitante)
            .delete();

        trx.commit();

        return "OK";
    }
}

export default ContatoModel;