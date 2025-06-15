"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UserController_1 = require("../controllers/UserController");
const routes = (0, express_1.Router)();
const controller = new UserController_1.UserController();
routes.post("/", controller.register);
routes.post("/login", controller.login);
exports.default = routes;
