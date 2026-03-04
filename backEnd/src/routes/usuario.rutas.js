import express from 'express';
import { getUser, updateUser, deleteUser, createUser } from '../controllers/usuario.controllers.js';
import { checkAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/usuario', checkAdmin, getUser);

router.post('/usuario/create', checkAdmin, createUser);

router.put('/usuario/edit/:id', checkAdmin, updateUser);

router.delete('/usuario/delete/:id', checkAdmin, deleteUser);

export default router;
