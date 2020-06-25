import knex from "../database/connection";
import { response } from "express";

import ContatoModel from "../Model/ContatoModel";
import EnderecoModel from "../Model/EnderecoModel";
import IgrejaModel from "../Model/IgrejaModel";
import FamiliaModel from "./FamiliaModel";

import { Membro } from "../interfaces/MembroInterface";

const contatoModel = new ContatoModel();
const enderecoModel = new EnderecoModel();
const igrejaModel = new IgrejaModel();
const familiaModel = new FamiliaModel();

class MembroModel {
    async index() {
        let membros = await knex<Membro>('membros').select("*");

        const membrosFiltrados = await Promise.all(membros.map(async (membro) => {
            const contato = await contatoModel.findMembro(Number(membro.id));
            const endereco = await enderecoModel.findMembro(Number(membro.id));
            const igreja = await igrejaModel.findMembro(Number(membro.id));
            const parentes = await familiaModel.findMembro(Number(membro.id));

            return (
                {
                    membro,
                    contato,
                    endereco,
                    igreja,
                    parentes
                }
            )
        }));

        return membrosFiltrados;
    }

    async show(id: Number) {

        const membro = await knex<Membro>("membros").where("id", String(id)).first();

        if (!membro) {
            return { message: "Membro não existe" };
        }

        membro.contato = await contatoModel.findMembro(id);
        membro.endereco = await enderecoModel.findMembro(id);
        membro.igreja = await igrejaModel.findMembro(id);
        membro.parentes = await familiaModel.findMembro(id);

        return membro;
    }

    async create(membro: Membro) {
        const trx = await knex.transaction();

        const membroIserir = {
            nome: membro.nome,
            identidade: membro.identidade,
            dataNascimento: membro.dataNascimento,
            dataCadastro: knex.raw("now()"),
            estadoCivil: membro.estadoCivil,
            sexo: membro.sexo,
            profissao: membro.profissao,
            ativo: true
        }

        const insertedId = await trx("membros").transacting(trx).insert(membroIserir);
        const membroId = insertedId[0];

        const novoContato = await contatoModel.create(membro.contato);
        const novoEndereco = await enderecoModel.create(membro.endereco);
        const novaIgreja = await igrejaModel.create(membro.igreja, membroId);
        const novaFamilia = await familiaModel.create(membro.parentes, membroId);

        await trx("membro_contato")
            .transacting(trx)
            .insert({
                chEsMembro: membroId,
                chEsContato: novoContato.id
            });

        await trx("membro_endereco")
            .transacting(trx)
            .insert({
                chEsMembro: membroId,
                chEsEndereco: novoEndereco.id
            })

        trx.commit();

        membro.id = membroId;

        return {
            membro,
            contatos: novoContato,
            endereco: novoEndereco,
            igreja: novaIgreja,
            parentes: novaFamilia
        }
    }

    async update(membro: Membro) {
        const trx = await knex.transaction();

        const membroAtualizar = {
            id: membro.id,
            nome: membro.nome,
            identidade: membro.identidade,
            dataNascimento: membro.dataNascimento,
            dataCadastro: membro.dataCadastro,
            estadoCivil: membro.estadoCivil,
            sexo: membro.sexo,
            profissao: membro.profissao,
            ativo: membro.ativo
        }

        await trx("membros")
            .transacting(trx)
            .where("id", membro.id)
            .update(membroAtualizar);

        const novoContato = await contatoModel.update(membro.contato);
        const novoEndereco = await enderecoModel.update(membro.endereco);
        const novaIgreja = await igrejaModel.update(membro.igreja, membro.id);
        const novaFamilia = await familiaModel.update(membro.parentes, membro.id);

        trx.commit();

        return {
            membro,
            contatos: novoContato,
            endereco: novoEndereco,
            igreja: novaIgreja,
            parentes: novaFamilia
        }
    }

    async remove(id: Number) {
        try {
            const trx = await knex.transaction();

            await contatoModel.removeMembro(id);
            await enderecoModel.removeMembro(id);
            await igrejaModel.removeMembro(id);
            await familiaModel.removeMembro(id);

            await trx("membros")
                .transacting(trx)
                .where({ id })
                .delete();

            trx.commit();

            return response.json({ success: "Membro Removido com sucesso!" })
        } catch (error) {
            return response.json({ error: error })
        }
    }
}

export default MembroModel;