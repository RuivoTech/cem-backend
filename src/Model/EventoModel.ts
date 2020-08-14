import knex from "../database/connection";

import { Evento } from "../interfaces/EventoInterface";

interface Quantidade {
    quantidade: number
}

class EventoModel {
    async index() {
        const eventos = await knex("eventos");

        return eventos;
    }

    async create(evento: Evento) {
        try {
            const eventoInserir = {
                ativo: evento.ativo,
                dataInicio: evento.dataInicio.split("T")[0],
                dataFim: evento.dataFim.split("T")[0],
                descricao: evento.descricao,
                valor: evento.valor
            }

            const insertedIds = await knex("eventos")
                .insert(eventoInserir);

            const eventoId = insertedIds[0];

            evento.id = eventoId;

            return evento;
        } catch (error) {
            return { error };
        }
    }

    async update(evento: Evento) {
        try {
            const eventoInserir = {
                id: evento.id,
                ativo: evento.ativo,
                dataInicio: evento.dataInicio.split("T")[0],
                dataFim: evento.dataFim.split("T")[0],
                descricao: evento.descricao,
                valor: evento.valor
            }

            await knex("eventos")
                .update(eventoInserir)
                .where("id", String(evento.id));

            return evento;
        } catch (error) {
            return { error };
        }
    }

    async delete(id: Number) {
        try {
            await knex("eventos")
                .delete()
                .where("id", id);

            return { mensagem: "Evento removido com sucesso." };
        } catch (error) {
            return { error };
        }
    }
}

export default EventoModel;