import Knex from "knex";

export async function up(knex: Knex) {
    return knex.schema.createTable('familia', table => {
        table.integer('chEsMembro').notNullable().unsigned().references("id").inTable("membros");
        table.integer('chEsConjuge').notNullable().unsigned().references('id').inTable("membros");
        table.integer('chEsPai').notNullable();
        table.integer('chEsMae').notNullable();
    })
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('familia');
}