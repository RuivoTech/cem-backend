import Knex from "knex";

export async function up(knex: Knex) {
    return knex.schema.createTable('permissao', table => {
        table.increments('id').primary();
        table.string('chEsUsuario').notNullable();
        table.string('chEsMenuPermissao').notNullable();
        table.boolean('inserir').nullable();
        table.boolean('alterar').nullable();
        table.boolean('visualizar').nullable();
        table.boolean("remover").nullable();
    })
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('permissao');
}