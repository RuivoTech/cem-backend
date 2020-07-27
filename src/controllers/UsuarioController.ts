import { Request, Response } from "express";

import UsuarioModel from "../Model/UsuarioModel";

const usuarioModel = new UsuarioModel();

class UsuarioController {
    async index(request: Request, response: Response) {
        const usuarios = await usuarioModel.index();

        return response.json(usuarios);
    }

    async show(request: Request, response: Response) {
        const { id } = request.params;

        const usuario = await usuarioModel.show(id);

        return response.json(usuario);
    }

    async create(request: Request, response: Response) {
        try {
            const usuario = request.body;

            const novoUsuario = await usuarioModel.create(usuario);

            return response.json(novoUsuario);
        } catch (error) {
            return response.json({ error: error });
        }
    }

    async update(request: Request, response: Response) {
        try {
            const usuario = request.body;

            const novoUsuario = await usuarioModel.update(usuario);

            return response.json(novoUsuario);
        } catch (error) {
            return response.json({ error: error });
        }
    }
}

export default UsuarioController;