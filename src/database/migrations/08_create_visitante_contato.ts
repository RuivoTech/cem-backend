import Knex from "knex";

export async function up(knex: Knex) {
    return knex.schema.createTable('visitante_contato', table => {
        table.integer('chEsVisitante').notNullable().unsigned().references('id').inTable('visitantes');
        table.integer('chEsContato').notNullable().unsigned().references('id').inTable('contatos');
    })
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('visitante_contato');
}