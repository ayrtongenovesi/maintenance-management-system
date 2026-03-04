import { pool } from '../../config/database.js';

export async function getUser(req, res, next) {
    try {
        const [rows] = await pool.query('SELECT id, nombre, mail, rol FROM usuario');
        res.json(rows);
    } catch (e) { next(e); }
}

export async function createUser(req, res, next) {
    try {
        const { nombre, mail, contraseña, rol = 'operario' } = req.body;
        if (!nombre || !mail || !contraseña) return res.status(400).json({ message: 'Campos requeridos faltantes' });
        if (!['administrador', 'operario'].includes(rol)) return res.status(400).json({ message: 'Rol inválido' });

        const bcrypt = (await import('bcrypt')).default;
        const hashed = await bcrypt.hash(contraseña, 10);
        const [result] = await pool.query(
            'INSERT INTO usuario (nombre, mail, contraseña, rol) VALUES (?, ?, ?, ?)',
            [nombre, mail, hashed, rol]
        );
        res.status(201).json({ message: 'Usuario creado', id: result.insertId, rol });
    } catch (e) { next(e); }
}

export async function deleteUser(req, res, next) {
    try {
        const { id } = req.params;
        const force = String(req.query.force).toLowerCase() === 'true';
        const [currentRows] = await pool.query('SELECT rol, mail FROM usuario WHERE id = ?', [id]);
        if (currentRows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
        if (currentRows[0].mail === 'admin@gmail.com') {
            return res.status(400).json({ message: 'No se puede eliminar la cuenta admin' });
        }
        const [otRows] = await pool.query('SELECT COUNT(*) AS total FROM orden_trabajo WHERE usuario_id = ?', [id]);
        const totalOt = otRows[0]?.total || 0;
        if (totalOt > 0 && !force) {
            return res.status(409).json({ message: `El usuario tiene ${totalOt} orden(es) asignada(s).`, count: totalOt });
        }
        if (totalOt > 0 && force) {
            await pool.query('DELETE FROM orden_trabajo WHERE usuario_id = ?', [id]);
        }
        const [result] = await pool.query('DELETE FROM usuario WHERE id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.status(204).send();
    } catch (e) { next(e); }
}

export async function updateUser(req, res, next) {
    try {
        const { id } = req.params;
        const { nombre, mail, rol = 'operario' } = req.body;
        if (!['administrador', 'operario'].includes(rol)) return res.status(400).json({ message: 'Rol inválido' });

        const [currentRows] = await pool.query('SELECT nombre, mail, rol FROM usuario WHERE id = ?', [id]);
        if (currentRows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
        const usuarioActual = currentRows[0];

        const nombreFinal = typeof nombre === 'string' ? nombre.trim() : usuarioActual.nombre;
        const mailFinal = typeof mail === 'string' ? mail.trim() : usuarioActual.mail;

        if (!nombreFinal || !mailFinal) {
            return res.status(400).json({ message: 'Nombre y mail son requeridos' });
        }

        if (usuarioActual.mail === 'admin@gmail.com' && rol !== 'administrador') {
            return res.status(400).json({ message: 'La cuenta admin no puede cambiar de rol' });
        }

        const [result] = await pool.query(
            'UPDATE usuario SET nombre = ?, mail = ?, rol = ? WHERE id = ?',
            [nombreFinal, mailFinal, rol, id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json({ id, nombre: nombreFinal, mail: mailFinal, rol });
    } catch (e) { next(e); }
}