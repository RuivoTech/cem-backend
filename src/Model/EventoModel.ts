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
                titulo: evento.titulo,
                tipo: evento.tipo,
                status: evento.status,
                repete: evento.repete,
                diaSemana: evento.diaSemana,
                frequencia: evento.frequencia,
                ehPago: evento.ehPago,
                valor: evento.valor,
                dataInicio: evento.dataInicio,
                dataFim: evento.dataFim,
                horaInicio: evento.horaInicio,
                horaFim: evento.horaFim
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
                status: evento.status,
                dataInicio: evento.dataInicio.split("T")[0],
                dataFim: evento.dataFim.split("T")[0],
                titulo: evento.titulo,
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