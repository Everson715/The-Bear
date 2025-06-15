"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/purchaseRoutes.ts
const express_1 = require("express");
const purchaseController_1 = require("../controllers/purchaseController");
const router = (0, express_1.Router)();
router.post("/", purchaseController_1.purchaseController.create);
router.get("/", purchaseController_1.purchaseController.getAll);
exports.default = router;
