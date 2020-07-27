import knex from "../database/connection";
import { response } from "express";

import { Visitante } from "../interfaces/VisitanteInterface";

import ContatoModel from "../Model/ContatoModel";
import EnderecoModel from "../Model/EnderecoModel";

const contatoModel = new ContatoModel();
const enderecoModel = new EnderecoModel();

class VisitanteModel {
    async index() {
        let visitantes = await knex<Visitante>('visitantes');

        const visitantesFiltrados = await Promise.all(visitantes.map(async (visitante) => {
            const contato = await contatoModel.findVisitante(Number(visitante.id));
            const endereco = await enderecoModel.findVisitante(Number(visitante.id));

            return (
                {
                    ...visitante,
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
        try {
            const visitanteInserir = {
                nome: visitante.nome,
                dataVisita: visitante.dataVisita,
                dataCadastro: knex.raw("now()"),
                religiao: visitante.religiao,
                querVisita: visitante.querVisita
            }

            const insertedId = await knex("visitantes").insert(visitanteInserir);
            const visitanteId = insertedId[0];

            const novoContato = await contatoModel.create(visitante.contato);
            const novoEndereco = await enderecoModel.create(visitante.endereco);

            await knex("visitante_contato")
                .insert({
                    chEsVisitante: visitanteId,
                    chEsContato: novoContato.id
                });

            await knex("visitante_endereco")
                .insert({
                    chEsVisitante: visitanteId,
                    chEsEndereco: novoEndereco.id
                });

            visitante.id = visitanteId;

            return {
                visitante,
                contato: novoContato,
                endereco: novoEndereco
            }
        } catch (error) {
            return error
        }
    }

    async update(visitante: Visitante) {
        try {
            const visitanteAlterar = {
                id: visitante.id,
                nome: visitante.nome,
                dataVisita: visitante.dataVisita,
                dataCadastro: visitante.dataCadastro,
                religiao: visitante.religiao,
                querVisita: visitante.querVisita
            }

            await knex<Visitante>("visitantes").update(visitanteAlterar).where({ id: visitante.id });

            const novoContato = await contatoModel.update(visitante.contato);
            const novoEndereco = await enderecoModel.update(visitante.endereco);

            return {
                visitante,
                contato: novoContato,
                endereco: novoEndereco
            }
        } catch (error) {
            return error
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