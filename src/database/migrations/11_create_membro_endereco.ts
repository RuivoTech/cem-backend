import Knex from "knex";

export async function up(knex: Knex) {
    return knex.schema.createTable('membro_endereco', table => {
        table.integer('chEsMembro').notNullable().unsigned().references('id').inTable('membros');
        table.integer('chEsEndereco').notNullable().unsigned().references('id').inTable('enderecos');
    })
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('membro_endereco');
}