import { pool } from '../../config/database.js';

export async function getActivos(req, res) {
    try {
        const [rows] = await pool.query('SELECT id, Nombre FROM activo');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor', error: err.message });
    }
}

export async function createActivo(req, res) {
    const { Nombre } = req.body;
    if (!Nombre) return res.status(400).json({ message: 'Nombre es requerido' });
    try {
        const [[{ maxId }]] = await pool.query('SELECT COALESCE(MAX(id), 0) AS maxId FROM activo');
        const newId = maxId + 1;
        await pool.query('INSERT INTO activo (id, Nombre) VALUES (?, ?)', [newId, Nombre.trim()]);
        res.status(201).json({ id: newId, Nombre: Nombre.trim() });
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor', error: err.message });
    }
}

export async function updateActivo(req, res) {
    const id = req.params.id;
    const { Nombre } = req.body;
    if (!Nombre) return res.status(400).json({ message: 'Nombre es requerido' });
    try {
        const [result] = await pool.query('UPDATE activo SET Nombre = ? WHERE id = ?', [Nombre.trim(), id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Activo no encontrado' });
        res.json({ id: Number(id), Nombre: Nombre.trim() });
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor', error: err.message });
    }
}

export async function deleteActivo(req, res) {
    const id = req.params.id;
    try {
        const [result] = await pool.query('DELETE FROM activo WHERE id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Activo no encontrado' });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor', error: err.message });
    }
}

export async function getPisos(req, res) {
    try {
        const [rows] = await pool.query('SELECT id, Nombre FROM piso_nivel');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor', error: err.message });
    }
}

export async function createPiso(req, res) {
    const { Nombre } = req.body;
    if (!Nombre) return res.status(400).json({ message: 'Nombre es requerido' });
    try {
        const [[{ maxId }]] = await pool.query('SELECT COALESCE(MAX(id), 0) AS maxId FROM piso_nivel');
        const newId = maxId + 1;
        await pool.query('INSERT INTO piso_nivel (id, Nombre) VALUES (?, ?)', [newId, Nombre.trim()]);
        res.status(201).json({ id: newId, Nombre: Nombre.trim() });
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor', error: err.message });
    }
}

export async function updatePiso(req, res) {
    const id = req.params.id;
    const { Nombre } = req.body;
    if (!Nombre) return res.status(400).json({ message: 'Nombre es requerido' });
    try {
        const [result] = await pool.query('UPDATE piso_nivel SET Nombre = ? WHERE id = ?', [Nombre.trim(), id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Piso no encontrado' });
        res.json({ id: Number(id), Nombre: Nombre.trim() });
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor', error: err.message });
    }
}

export async function deletePiso(req, res) {
    const id = req.params.id;
    try {
        const [result] = await pool.query('DELETE FROM piso_nivel WHERE id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Piso no encontrado' });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor', error: err.message });
    }
}

export async function getSectores(req, res) {
    try {
        const { pisoId } = req.query;
        if (pisoId) {
            const [rows] = await pool.query('SELECT id, Sector, IdEdificio, IdPiso FROM sector WHERE IdPiso = ?', [pisoId]);
            return res.json(rows);
        }
        const [rows] = await pool.query('SELECT id, Sector, IdEdificio, IdPiso FROM sector');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor', error: err.message });
    }
}

export async function createSector(req, res) {
    const { Sector, IdEdificio, IdPiso } = req.body;
    if (!Sector) return res.status(400).json({ message: 'Sector es requerido' });
    if (!IdEdificio) return res.status(400).json({ message: 'IdEdificio es requerido' });
    if (!IdPiso) return res.status(400).json({ message: 'IdPiso es requerido' });
    try {
        const [[{ maxId }]] = await pool.query('SELECT COALESCE(MAX(id), 0) AS maxId FROM sector');
        const newId = maxId + 1;
        await pool.query('INSERT INTO sector (id, Sector, IdEdificio, IdPiso) VALUES (?, ?, ?, ?)', [newId, Sector.trim(), IdEdificio, IdPiso]);
        res.status(201).json({ id: newId, Sector: Sector.trim(), IdEdificio, IdPiso });
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor', error: err.message });
    }
}

export async function updateSector(req, res) {
    const id = req.params.id;
    const { Sector, IdEdificio, IdPiso } = req.body;
    if (!Sector) return res.status(400).json({ message: 'Sector es requerido' });
    if (!IdEdificio) return res.status(400).json({ message: 'IdEdificio es requerido' });
    if (!IdPiso) return res.status(400).json({ message: 'IdPiso es requerido' });
    try {
        const [result] = await pool.query('UPDATE sector SET Sector = ?, IdEdificio = ?, IdPiso = ? WHERE id = ?', [Sector.trim(), IdEdificio, IdPiso, id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Sector no encontrado' });
        res.json({ id: Number(id), Sector: Sector.trim(), IdEdificio, IdPiso });
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor', error: err.message });
    }
}

export async function deleteSector(req, res) {
    const id = req.params.id;
    try {
        const [result] = await pool.query('DELETE FROM sector WHERE id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Sector no encontrado' });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor', error: err.message });
    }
}

export async function getEdificios(req, res) {
    try {
        const [rows] = await pool.query('SELECT id, Nombre, Direccion FROM edificio');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor', error: err.message });
    }
}

export async function createEdificio(req, res) {
    const { Nombre, Direccion } = req.body;
    if (!Nombre) return res.status(400).json({ message: 'Nombre es requerido' });
    try {
        const [[{ maxId }]] = await pool.query('SELECT COALESCE(MAX(id), 0) AS maxId FROM edificio');
        const newId = maxId + 1;
        await pool.query('INSERT INTO edificio (id, Nombre, Direccion) VALUES (?, ?, ?)', [newId, Nombre.trim(), (Direccion || '').trim()]);
        res.status(201).json({ id: newId, Nombre: Nombre.trim(), Direccion: (Direccion || '').trim() });
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor', error: err.message });
    }
}

export async function updateEdificio(req, res) {
    const id = req.params.id;
    const { Nombre, Direccion } = req.body;
    if (!Nombre) return res.status(400).json({ message: 'Nombre es requerido' });
    try {
        const [result] = await pool.query('UPDATE edificio SET Nombre = ?, Direccion = ? WHERE id = ?', [Nombre.trim(), (Direccion || '').trim(), id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Edificio no encontrado' });
        res.json({ id: Number(id), Nombre: Nombre.trim(), Direccion: (Direccion || '').trim() });
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor', error: err.message });
    }
}

export async function deleteEdificio(req, res) {
    const id = req.params.id;
    try {
        const [result] = await pool.query('DELETE FROM edificio WHERE id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Edificio no encontrado' });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor', error: err.message });
    }
}

export async function getUbicaciones(req, res) {
    try {
        const [rows] = await pool.query('SELECT id, Nombre FROM ubicacion');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor', error: err.message });
    }
}

export async function createUbicacion(req, res) {
    const { Nombre } = req.body;
    if (!Nombre) return res.status(400).json({ message: 'Nombre es requerido' });
    try {
        const [[{ maxId }]] = await pool.query('SELECT COALESCE(MAX(id), 0) AS maxId FROM ubicacion');
        const newId = maxId + 1;
        await pool.query('INSERT INTO ubicacion (id, Nombre) VALUES (?, ?)', [newId, Nombre.trim()]);
        res.status(201).json({ id: newId, Nombre: Nombre.trim() });
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor', error: err.message });
    }
}

export async function updateUbicacion(req, res) {
    const id = req.params.id;
    const { Nombre } = req.body;
    if (!Nombre) return res.status(400).json({ message: 'Nombre es requerido' });
    try {
        const [result] = await pool.query('UPDATE ubicacion SET Nombre = ? WHERE id = ?', [Nombre.trim(), id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Ubicacion no encontrada' });
        res.json({ id: Number(id), Nombre: Nombre.trim() });
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor', error: err.message });
    }
}

export async function deleteUbicacion(req, res) {
    const id = req.params.id;
    try {
        const [result] = await pool.query('DELETE FROM ubicacion WHERE id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Ubicacion no encontrada' });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor', error: err.message });
    }
}

export async function getTareas(req, res) {
    try {
        const [rows] = await pool.query('SELECT id, Descripcion FROM tareas');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor', error: err.message });
    }
}

export async function createTarea(req, res) {
    const { descripcion } = req.body;
    if (!descripcion) return res.status(400).json({ message: 'descripcion es requerida' });
    try {
        const [[{ maxId }]] = await pool.query('SELECT COALESCE(MAX(id), 0) AS maxId FROM tareas');
        const newId = maxId + 1;
        await pool.query('INSERT INTO tareas (id, Descripcion) VALUES (?, ?)', [newId, descripcion.trim()]);
        res.status(201).json({ id: newId, descripcion: descripcion.trim() });
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor', error: err.message });
    }
}

export async function updateTarea(req, res) {
    const id = req.params.id;
    const { descripcion } = req.body;
    if (!descripcion) return res.status(400).json({ message: 'descripcion es requerida' });
    try {
        const [result] = await pool.query('UPDATE tareas SET Descripcion = ? WHERE id = ?', [descripcion.trim(), id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Tarea no encontrada' });
        res.json({ id: Number(id), descripcion: descripcion.trim() });
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor', error: err.message });
    }
}

export async function deleteTarea(req, res) {
    const id = req.params.id;
    try {
        const [result] = await pool.query('DELETE FROM tareas WHERE id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Tarea no encontrada' });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ message: 'Error del servidor', error: err.message });
    }
}
