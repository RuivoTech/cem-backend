import express from "express";

import MembrosController from "./controllers/MembrosController";
import VisitantesController from "./controllers/VisitantesController";
import LoginController from "./controllers/LoginController";
import UsuarioController from "./controllers/UsuarioController";
import HomeController from "./controllers/HomeController";
import MenuPermisaoController from "./controllers/MenuPermissaoController";

const routes = express.Router();

const homeController = new HomeController();
const membrosController = new MembrosController();
const visitantesController = new VisitantesController();
const loginController = new LoginController();
const usuarioController = new UsuarioController();
const menuPermisaoController = new MenuPermisaoController();

routes.post("/login", loginController.login);

//routes.use(loginController.verificarToken);

routes.get("/home", homeController.index);

routes.get('/membros', membrosController.index);
routes.get("/membros/:id", membrosController.show);

routes.post("/membros", membrosController.create);

routes.put("/membros", membrosController.update);

routes.get("/visitantes", visitantesController.index);
routes.get("/visitantes/:id", visitantesController.show);

routes.post("/visitantes", visitantesController.create);

routes.put("/visitantes", visitantesController.update);

routes.get("/usuarios", usuarioController.index);
routes.get("/usuarios/:id", usuarioController.show);

routes.post("/usuarios", usuarioController.create);

routes.put("/usuarios", usuarioController.update);

routes.get("/menuPermissao", menuPermisaoController.index);

export default routes;