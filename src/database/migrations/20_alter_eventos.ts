import Knex from "knex";

export async function up(knex: Knex) {
    return knex.schema.alterTable('eventos', table => {
        table.renameColumn("descricao", "titulo");
        table.integer("tipo", 2).notNullable().defaultTo(0);
        table.renameColumn("ativo", "status");
        table.boolean("repete").defaultTo(false).notNullable();
        table.integer("diaSemana", 2);
        table.integer("frequencia", 2);
        table.boolean("ehPago").defaultTo(false).notNullable();
        table.time("horaInicio");
        table.time("horaFim");
    })
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('eventos');
}