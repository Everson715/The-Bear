import { Router } from "express";
import { UserController } from "../controllers/UserController";

const routes = Router();
const controller = new UserController();

routes.post("/", controller.register);
routes.post("/login", controller.login);

export default routes;
