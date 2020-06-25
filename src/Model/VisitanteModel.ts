import knex from "../database/connection";
import { response } from "express";

import { Visitante } from "../interfaces/VisitanteInterface";

import ContatoModel from "../Model/ContatoModel";
import EnderecoModel from "../Model/EnderecoModel";

const contatoModel = new ContatoModel();
const enderecoModel = new EnderecoModel();

class VisitanteModel {
    async index() {
        let visitantes = await knex<Visitante>('visitantes').select("*");

        const visitantesFiltrados = await Promise.all(visitantes.map(async (visitante) => {
            const contato = await contatoModel.findVisitante(Number(visitante.id));
            const endereco = await enderecoModel.findVisitante(Number(visitante.id));

            return (
                {
                    visitante,
                    contato,
                    endereco
                }
            )
        }));

        return visitantesFiltrados;
    }

    async show(id: Number) {

        const visitante = await knex<Visitante>("visitantes").where("id", String(id)).first();

        if (!visitante) {
            return { message: "Visitante não existe" };
        }

        visitante.contato = await contatoModel.findVisitante(id);
        visitante.endereco = await enderecoModel.findVisitante(id);

        return visitante;
    }

    async create(visitante: Visitante) {
        const trx = await knex.transaction();

        const visitanteInserir = {
            nome: visitante.nome,
            dataVisita: visitante.dataVisita,
            dataCadastro: knex.raw("now()"),
            religiao: visitante.religiao,
            querVisita: visitante.querVisita
        }

        const insertedId = await trx("visitantes").transacting(trx).insert(visitanteInserir);
        const visitanteId = insertedId[0];

        const novoContato = await contatoModel.create(visitante.contato);
        const novoEndereco = await enderecoModel.create(visitante.endereco);

        await trx("visitante_contato")
            .transacting(trx)
            .insert({
                chEsVisitante: visitanteId,
                chEsContato: novoContato.id
            });

        await trx("visitante_endereco")
            .transacting(trx)
            .insert({
                chEsVisitante: visitanteId,
                chEsEndereco: novoEndereco.id
            });

        trx.commit();

        visitante.id = visitanteId;

        return {
            visitante,
            contato: novoContato,
            endereco: novoEndereco
        }
    }

    async remove(id: Number) {
        try {
            const trx = await knex.transaction();

            await contatoModel.removeVisitante(id);
            await enderecoModel.removeVisitante(id);

            await trx("visitantes")
                .transacting(trx)
                .where({ id })
                .delete();

            trx.commit();

            return response.json({ success: "Visitante removido com sucesso!" })
        } catch (error) {
            return response.json({ error: error })
        }
    }
}

export default VisitanteModel;