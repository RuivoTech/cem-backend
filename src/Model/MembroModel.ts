import knex from "../database/connection";

import ContatoModel from "../Model/ContatoModel";
import EnderecoModel from "../Model/EnderecoModel";
import IgrejaModel from "../Model/IgrejaModel";
import FamiliaModel from "./FamiliaModel";
import MinisterioMembroModel from "./MinisterioMembroModel";
import Utils from "../Utils";

import { Membro } from "../interfaces/MembroInterface";

const contatoModel = new ContatoModel();
const enderecoModel = new EnderecoModel();
const igrejaModel = new IgrejaModel();
const familiaModel = new FamiliaModel();
const ministerioMembroModel = new MinisterioMembroModel();

interface Filters {
    constant?: string,
    value?: [] | string
}

const utils = new Utils();

class MembroModel {
    async index() {
        const membros = await knex<Membro>('membros')
            .orderBy("nome")

        const ativos = await knex("membros")
            .where("ativo", "=", true)
            .count("id as quantidade").first() || { quantidade: 0 };

        const novos = await knex("membros")
            .where("dataCadastro", ">=", "DATE_SUB(CURDATE(),INTERVAL 30 DAY)")
            .count("id AS quantidade").first() || { quantidade: 0 };

        const batizados = await knex("membros AS m")
            .join("igreja AS i", "i.chEsMembro", "m.id")
            .where("i.ehBatizado", "=", "true")
            .count("m.id as quantidade").first() || { quantidade: 0 };

        const membrosFiltrados = await Promise.all(membros.map(async (membro) => {
            const contato = await contatoModel.findMembro(Number(membro.id));
            const endereco = await enderecoModel.findMembro(Number(membro.id));
            const igreja = await igrejaModel.findMembro(Number(membro.id));
            const parentes = await familiaModel.findMembro(Number(membro.id));
            const ministerios = await ministerioMembroModel.findMembro(Number(membro.id));

            return (
                {
                    ...membro,
                    contato,
                    endereco,
                    igreja,
                    parentes,
                    ministerios
                }
            )
        }));

        return {
            quantidadeAtivos: ativos.quantidade,
            quantidadeBatizados: batizados.quantidade,
            quantidadeNovos: novos.quantidade,
            membros: membrosFiltrados
        };
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
        membro.ministerios = await ministerioMembroModel.findMembro(Number(membro.id));

        return membro;
    }

    async create(membro: Membro) {
        try {
            const membroIserir = {
                nome: membro.nome,
                identidade: membro.identidade,
                dataNascimento: membro.dataNascimento?.split("T")[0],
                dataCadastro: knex.raw("now()"),
                estadoCivil: membro.estadoCivil,
                sexo: membro.sexo,
                profissao: membro.profissao,
                ativo: true
            }

            const insertedId = await knex("membros").insert(membroIserir);
            const membroId = insertedId[0];

            const novoContato = await contatoModel.create(membro.contato);
            const novoEndereco = await enderecoModel.create(membro.endereco);
            const novaIgreja = await igrejaModel.create(membro.igreja, membroId);
            const novaFamilia = await familiaModel.create(membro.parentes, membroId);
            const novoMinisterios = await ministerioMembroModel.create(membro.ministerios, membro.id);

            await knex("membro_contato")
                .insert({
                    chEsMembro: membroId,
                    chEsContato: novoContato.id
                });

            await knex("membro_endereco")
                .insert({
                    chEsMembro: membroId,
                    chEsEndereco: novoEndereco.id
                })

            membro.id = membroId;

            return {
                membro,
                contatos: novoContato,
                endereco: novoEndereco,
                igreja: novaIgreja,
                parentes: novaFamilia,
                ministerios: novoMinisterios
            }
        } catch (error) {
            return error;
        }
    }

    async update(membro: Membro) {
        try {
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

            await knex("membros")
                .where("id", membro.id)
                .update(membroAtualizar);

            const novoContato = await contatoModel.update(membro.contato);
            const novoEndereco = await enderecoModel.update(membro.endereco);
            const novaIgreja = await igrejaModel.update(membro.igreja, membro.id);
            const novaFamilia = await familiaModel.update(membro.parentes, membro.id);
            const novoMinisterio = await ministerioMembroModel.update(membro.ministerios, membro.id);

            return {
                membro,
                contato: novoContato,
                endereco: novoEndereco,
                igreja: novaIgreja,
                parentes: novaFamilia,
                ministerios: novoMinisterio
            }
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    async delete(id: Number) {
        try {
            await contatoModel.removeMembro(id);
            await enderecoModel.removeMembro(id);
            await igrejaModel.removeMembro(id);
            await familiaModel.removeMembro(id);
            await ministerioMembroModel.deleteMembro(id);

            await knex("membros")
                .where("id", id)
                .delete();

            return { success: "Membro Removido com sucesso!" };
        } catch (error) {
            return error;
        }
    }

    async relatorio(filters: any) {
        const query = utils.montarQuery(filters);
        console.log(query);

        const response = knex("membros AS m")
            .join("membro_contato AS mc", "mc.chEsMembro", "m.id")
            .join("contatos AS c", "c.id", "mc.chEsContato")
            .leftJoin("ministerioMembro AS mm", "m.id", "mm.chEsMembro")
            .whereRaw(query.where, query.values)
            .select(
                "m.nome",
                "m.dataNascimento",
                "c.email",
                "c.celular",
                "c.telefone"
            )
            .orderByRaw("DAY(m.dataNascimento) ASC");


        return response;
    }
}

export default MembroModel;