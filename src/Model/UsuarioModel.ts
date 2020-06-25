import { Request, Response } from "express";
import knex from "../database/connection";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import { Usuario } from "../interfaces/UsuarioInterface";

class UsuariosController {
    async index() {
        try {
            const trx = await knex.transaction();

            const usuarios = await trx<Usuario[]>("usuarios")
                .transacting(trx)
                .select("nome", "email", "nivel")

            await trx.commit();

            return usuarios;
        } catch (error) {
            return { error: error };
        }

    }

    async show(id: string) {
        try {
            const trx = await knex.transaction();

            const usuario = await trx("usuarios").transacting(trx)
                .where("id", id)
                .select("nome", "email", "nivel")
                .first();
            if (usuario) {
                usuario.permissao = await trx<Permissao>("permissao")
                    .transacting(trx)
                    .where("chEsUsuario", id)
            }
            trx.commit();

            return usuario
        } catch (error) {
            return { error: error };
        }

    }

    async create(usuario: Usuario) {
        try {

            const senha = crypto.randomBytes(6).toString("hex");

            const trx = await knex.transaction();

            const salt = crypto.randomBytes(16).toString('hex');

            const hash = crypto.pbkdf2Sync(senha, salt,
                1000, 64, `sha512`).toString(`hex`);

            usuario.senha = hash;

            const insertedIds = await trx<Usuario>('usuarios').transacting(trx).insert(usuario);
            const usuarioId = insertedIds[0];

            await trx.commit();

            usuario.id = usuarioId;

            return usuario;
        } catch (error) {
            return { error: error }
        }
    }

    async update(request: Request, response: Response) {
        const {
            id,
            nome,
            email,
            nivel
        } = request.body;
        try {
            const trx = await knex.transaction();

            const usuario = {
                id,
                nome,
                email,
                nivel
            }

            await trx<Usuario>('usuarios').transacting(trx).update(usuario).where({ id });

            await trx.commit();

            return usuario
        } catch (error) {
            return { error: error }
        }

    }

    async updatePerfil(request: Request, response: Response) {
        const {
            id,
            nome,
            email,
            senha

        } = request.body;
        try {
            const trx = await knex.transaction();

            const salt = crypto.randomBytes(16).toString('hex');

            const novaSenha = crypto.pbkdf2Sync(senha, salt,
                1000, 64, `sha512`).toString(`hex`);

            const usuario = {
                id,
                nome,
                email,
                senha: novaSenha,
                salt
            }

            await trx<Usuario>('usuarios').transacting(trx).update(usuario).where({ id });

            await trx.commit();

            return usuario
        } catch (error) {
            return { error: error }
        }

    }

    async delete(request: Request, response: Response) {
        const { id } = request.params;
        try {
            const trx = await knex.transaction();

            await trx.delete().transacting(trx).from("usuarios").where({ id });

            const usuarios = await trx<Usuario[]>('usuarios').transacting(trx);

            trx.commit();

            return usuarios
        } catch (error) {
            return { error: error }
        }

    }

    async getUsuario(authorization: String) {

        const trx = await knex.transaction();

        const autorizado = jwt.verify(String(authorization).split(' ')[1], "RuivoTech-BibliotecaDD") as Usuario;
        const usuario = await trx<Usuario>("usuarios").transacting(trx)
            .where({ email: autorizado.email })
            .first();

        trx.commit();

        return usuario;
    }
}

export default UsuariosController;