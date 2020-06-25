import Knex from "knex";

export async function up(knex: Knex) {
    return knex.schema.createTable('visitante_endereco', table => {
        table.integer('chEsVisitante').notNullable().unsigned().references('id').inTable('visitantes');
        table.integer('chEsEndereco').notNullable().unsigned().references('id').inTable('enderecos');
    })
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('visitante_endereco');
}