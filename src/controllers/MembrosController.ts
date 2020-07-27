import { Request, Response } from "express";

import MembroModel from "../Model/MembroModel";

const membroModel = new MembroModel();

class MembrosController {
    async index(request: Request, response: Response) {
        let membros = await membroModel.index();

        return response.json(membros);
    }

    async show(request: Request, response: Response) {
        const { id } = request.params;

        const membro = await membroModel.show(Number(id));

        return response.json(membro);
    }

    async create(request: Request, response: Response) {
        try {
            const membro = request.body;

            const novoMembro = await membroModel.create(membro);

            return response.json(novoMembro);
        } catch (error) {
            return response.json(error);
        }
    }

    async update(request: Request, response: Response) {
        try {
            const membro = request.body;

            const novoMembro = await membroModel.update(membro);

            return response.json(novoMembro);
        } catch (error) {
            return response.json(error);
        }
    }
}

export default MembrosController;