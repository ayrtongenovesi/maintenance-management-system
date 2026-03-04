import express from 'express'
import { createOT, deleteOT, getOT, updateEstadoOT, toggleTareaOT } from '../controllers/OrdenTrabajo.controller.js'
import { checkAdmin } from '../middleware/auth.js';

const router = express.Router()

router.get('/ot', getOT)

router.put('/ot/edit/:id', updateEstadoOT);

router.put('/ot/:otId/tarea/:ottId', toggleTareaOT);

router.delete('/ot/delete/:id', checkAdmin, deleteOT)

router.post('/ot/create', checkAdmin, createOT)

export default router
