import express from 'express';
import MenuItemController from '../controllers/MenuItemController';
import { isAdmin } from '../middlewares/isAdmin';

const router = express.Router();

// Public - ver o cardápio
router.get('/', MenuItemController.getAll);

// Privado - apenas admin
router.post('/', isAdmin, MenuItemController.create);
router.put('/:id', isAdmin, MenuItemController.update);
router.delete('/:id', isAdmin, MenuItemController.delete);

export default router;
