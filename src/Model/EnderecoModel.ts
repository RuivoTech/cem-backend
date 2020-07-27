import knex from "../database/connection";

import { Endereco } from "../interfaces/EnderecoInterface";


class EnderecoModel {

    async create(endereco: Endereco) {
        const trx = await knex.transaction();

        const enderecoIserir = {
            cep: endereco.cep,
            logradouro: endereco.logradouro,
            numero: endereco.numero,
            complemento: endereco.complemento,
            cidade: endereco.cidade,
            uf: endereco.uf
        }

        const insertedId = await trx("enderecos").transacting(trx).insert(enderecoIserir);
        const enderecoId = insertedId[0];

        trx.commit();

        return {
            id: enderecoId,
            ...enderecoIserir
        }
    }

    async update(endereco: Endereco) {
        try {
            const enderecoIserir = {
                id: endereco.id,
                cep: endereco.cep,
                logradouro: endereco.logradouro,
                numero: endereco.numero,
                complemento: endereco.complemento,
                cidade: endereco.cidade,
                uf: endereco.uf
            }

            await knex("enderecos")
                .where("id", endereco.id)
                .update(enderecoIserir);

            return enderecoIserir;
        } catch (error) {
            return error;
        }
    }

    async findMembro(id: Number) {
        const endereco = await knex("enderecos as e")
            .join("membro_endereco as me", "me.chEsEndereco", "e.id")
            .where("me.chEsMembro", id)
            .select("e.*")
            .first();

        return endereco;
    }

    async findVisitante(id: Number) {
        const endereco = await knex("enderecos as e")
            .join("visitante_endereco as ve", "ve.chEsEndereco", "e.id")
            .where("ve.chEsVisitante", id)
            .select("e.*")
            .first();

        return endereco;
    }

    async removeMembro(chEsMembro: Number) {
        const trx = await knex.transaction();

        await trx("endereco AS e")
            .transacting(trx)
            .join("membro_endereco AS me", "me.chEsEndereco", "e.id")
            .where("me.chEsMembro", chEsMembro)
            .delete();

        trx.commit();

        return "OK";
    }

    async removeVisitante(chEsMembro: Number) {
        const trx = await knex.transaction();

        await trx("endereco AS e")
            .transacting(trx)
            .join("visitante_endereco AS ve", "ve.chEsEndereco", "e.id")
            .where("ve.chEsMembro", chEsMembro)
            .delete();

        trx.commit();

        return "OK";
    }
}

export default EnderecoModel;