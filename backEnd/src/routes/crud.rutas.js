import express from 'express';
import { checkAdmin } from '../middleware/auth.js';
import {
    createActivo, createEdificio, createPiso, createSector,
    createTarea, createUbicacion, deleteActivo, deleteEdificio,
    deletePiso, deleteSector, deleteTarea, deleteUbicacion,
    getActivos, getEdificios, getPisos, getSectores,
    getTareas, getUbicaciones, updateActivo, updateEdificio,
    updatePiso, updateSector, updateTarea, updateUbicacion
} from '../controllers/catalogo.controller.js';

const router = express.Router();

router.get('/activo', checkAdmin, getActivos);
router.post('/activo/create', checkAdmin, createActivo);
router.put('/activo/edit/:id', checkAdmin, updateActivo);
router.delete('/activo/delete/:id', checkAdmin, deleteActivo);

router.get('/piso', checkAdmin, getPisos);
router.post('/piso/create', checkAdmin, createPiso);
router.put('/piso/edit/:id', checkAdmin, updatePiso);
router.delete('/piso/delete/:id', checkAdmin, deletePiso);

router.get('/sector', checkAdmin, getSectores);
router.post('/sector/create', checkAdmin, createSector);
router.put('/sector/edit/:id', checkAdmin, updateSector);
router.delete('/sector/delete/:id', checkAdmin, deleteSector);

router.get('/edificio', checkAdmin, getEdificios);
router.post('/edificio/create', checkAdmin, createEdificio);
router.put('/edificio/edit/:id', checkAdmin, updateEdificio);
router.delete('/edificio/delete/:id', checkAdmin, deleteEdificio);

router.get('/ubicacion', checkAdmin, getUbicaciones);
router.post('/ubicacion/create', checkAdmin, createUbicacion);
router.put('/ubicacion/edit/:id', checkAdmin, updateUbicacion);
router.delete('/ubicacion/delete/:id', checkAdmin, deleteUbicacion);

router.get('/tareas', checkAdmin, getTareas);
router.post('/tareas/create', checkAdmin, createTarea);
router.put('/tareas/edit/:id', checkAdmin, updateTarea);
router.delete('/tareas/delete/:id', checkAdmin, deleteTarea);

export default router;
