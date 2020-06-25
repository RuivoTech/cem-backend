import Knex from "knex";

export async function up(knex: Knex) {
    return knex.schema.createTable('filhos', table => {
        table.integer('chEsMembro').notNullable().unsigned().references("id").inTable("membros");
        table.integer("chEsFilho").notNullable().unsigned().references('id').inTable("membros");
    })
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('filhos');
}