import Knex from "knex";
import crypto from "crypto";

import Mailer from "../../config/Mailer";

interface Usuario {
    id: number,
    nome: string,
    email: string,
    nivel: string,
    senha: string,
    salt: string
}

const mailer = new Mailer();

export async function seed(knex: Knex) {
    await knex("cem_new.usuarios AS un")
        .join("cem_new.membros AS nm", "nm.id", "un.chEsMembro")
        .join("cem_testes.membros AS tm", "tm.nome", "nm.nome")
        .join("membro_contato AS mc", "mc.chEsMembro", "tm.id")
        .join("cem_testes.contatos AS c", "c.id", "mc.chEsContato")
        .select("tm.nome", "c.email")
        .then(async (response: Usuario[]) => {
            await Promise.all(response.map(async usuario => {
                const senha = crypto.randomBytes(6).toString("hex");

                const salt = crypto.randomBytes(16).toString('hex');

                const hash = crypto.pbkdf2Sync(senha, salt,
                    1000, 64, `sha512`).toString(`hex`);

                await knex("usuarios").insert({
                    nome: usuario.nome,
                    email: usuario.email,
                    nivel: "Geral",
                    senha: hash,
                    salt
                });

                //await mailer.sendMail(usuario.email, usuario.nome, senha);
            }))
        })
}