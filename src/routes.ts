import express from "express";

import MembrosController from "./controllers/MembrosController";
import VisitantesController from "./controllers/VisitantesController";
import LoginController from "./controllers/LoginController";
import UsuarioController from "./controllers/UsuarioController";

const routes = express.Router();

const membrosController = new MembrosController();
const visitantesController = new VisitantesController();
const loginController = new LoginController();
const usuarioController = new UsuarioController();

routes.post("/login", loginController.login);

//routes.use(loginController.verificarToken);

routes.get('/membros', membrosController.index);
routes.get("/membros/:id", membrosController.show);

routes.post("/membros", membrosController.create);

routes.get("/visitantes", visitantesController.index);

routes.get("/usuarios", usuarioController.index);
routes.get("/usuarios/:id", usuarioController.show);

routes.post("/usuarios", usuarioController.create);

export default routes;