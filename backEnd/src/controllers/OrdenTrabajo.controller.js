import { pool } from '../../config/database.js';

export async function getOT(req, res, next) {
  try {
    const isOperario = req.user?.rol === 'operario';
    const usuarioId = Number(req.user?.id);
    const usuarioMail = req.user?.mail;
    const sql = `
      SELECT 
        o.id AS id,
        e.Nombre AS Edificio,
        p.Nombre AS Piso,
        ub.Nombre AS Ubicacion,
        s.Sector AS Sector,
        a.Nombre AS Tipo_Activo,
        u.nombre AS usuarios,
        o.fecha AS fecha,
        o.estado AS disponible
      FROM orden_trabajo o
      JOIN edificio e ON e.id = o.edificio_id
      JOIN piso_nivel p ON p.id = o.piso_id
      JOIN ubicacion ub ON ub.id = o.ubicacion_id
      JOIN sector s ON s.id = o.sector_id
      JOIN activo a ON a.id = o.activo_id
      JOIN usuario u ON u.id = o.usuario_id
      ${isOperario ? 'WHERE (o.usuario_id = ? OR u.mail = ?)' : ''}
    `;

    const [rows] = isOperario
      ? await pool.query(sql, [usuarioId, usuarioMail])
      : await pool.query(sql);

    // Fetch tasks with completion status for all OTs
    const otIds = rows.map(r => r.id);
    let tareasMap = {};
    if (otIds.length > 0) {
      const placeholders = otIds.map(() => '?').join(',');
      const [tareasRows] = await pool.query(
        `SELECT ott.id AS ottId, ott.orden_trabajo_id, ott.tarea_id, ott.completada, t.Descripcion
         FROM orden_trabajo_tarea ott
         JOIN tareas t ON t.id = ott.tarea_id
         WHERE ott.orden_trabajo_id IN (${placeholders})
         ORDER BY ott.orden_trabajo_id, t.id`,
        otIds
      );
      for (const t of tareasRows) {
        if (!tareasMap[t.orden_trabajo_id]) tareasMap[t.orden_trabajo_id] = [];
        tareasMap[t.orden_trabajo_id].push({
          ottId: t.ottId,
          tareaId: t.tarea_id,
          descripcion: t.Descripcion,
          completada: t.completada === 1
        });
      }
    }

    const mapped = rows.map(r => {
      const tareasDetalle = tareasMap[r.id] || [];
      return {
        id: r.id,
        edificio: r.Edificio,
        piso: r.Piso,
        ubicacion: r.Ubicacion,
        sector: r.Sector,
        tipoActivo: r.Tipo_Activo,
        tareas: tareasDetalle.map(t => t.descripcion).join(', '),
        tareasDetalle,
        usuario: r.usuarios,
        fecha: r.fecha,
        estado: r.disponible
      };
    });
    res.json(mapped);
  } catch (e) { next(e); }
}

export async function createOT(req, res, next) {
  try {
    const { edificioId, sectorId, pisoId, ubicacionId, activoId, usuarioId, tareasIds, fecha, estado } = req.body;
    if (!edificioId || !sectorId || !pisoId || !ubicacionId || !activoId || !usuarioId || !fecha) {
      return res.status(400).json({ message: 'Campos requeridos faltantes (IDs)' });
    }
    const estadoFinal = estado || 'Pendiente';
    const [result] = await pool.query(
      'INSERT INTO orden_trabajo (edificio_id, sector_id, piso_id, ubicacion_id, activo_id, usuario_id, fecha, estado) VALUES (?,?,?,?,?,?,?,?)',
      [edificioId, sectorId, pisoId, ubicacionId, activoId, usuarioId, fecha, estadoFinal]
    );
    const otId = result.insertId;
    if (Array.isArray(tareasIds) && tareasIds.length) {
      const values = tareasIds.map(id => [otId, id]);
      const placeholders = values.map(() => '(?,?)').join(',');
      await pool.query(`INSERT INTO orden_trabajo_tarea (orden_trabajo_id, tarea_id) VALUES ${placeholders}`, values.flat());
    }
    return res.status(201).json({ message: 'Orden creada', id: otId });
  } catch (e) { next(e); }
}

export async function deleteOT(req, res, next) {
  try {
    const { id } = req.params;
    const [result] = await pool.query('DELETE FROM orden_trabajo WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'OT no encontrada' });
    return res.status(204).send();
  } catch (e) { next(e); }
}

export async function updateEstadoOT(req, res, next) {
  try {
    const { id } = req.params;
    const { estado, disponible } = req.body;
    const valor = estado || disponible;
    if (!valor) return res.status(400).json({ message: 'Estado requerido' });

    const isOperario = req.user?.rol === 'operario';
    const [result] = isOperario
      ? await pool.query('UPDATE orden_trabajo SET estado = ? WHERE id = ? AND usuario_id = ?', [valor, id, req.user.id])
      : await pool.query('UPDATE orden_trabajo SET estado = ? WHERE id = ?', [valor, id]);

    if (result.affectedRows === 0) return res.status(404).json({ message: 'OT no encontrada' });
    return res.json({ message: 'Estado actualizado' });
  } catch (e) { next(e); }
}

export async function toggleTareaOT(req, res, next) {
  try {
    const { otId, ottId } = req.params;
    const { completada } = req.body;
    const isOperario = req.user?.rol === 'operario';

    // Verify the OT belongs to the user if operario
    if (isOperario) {
      const [ot] = await pool.query('SELECT id FROM orden_trabajo WHERE id = ? AND usuario_id = ?', [otId, req.user.id]);
      if (ot.length === 0) return res.status(403).json({ message: 'No tiene permiso para modificar esta orden' });
    }

    const [result] = await pool.query(
      'UPDATE orden_trabajo_tarea SET completada = ? WHERE id = ? AND orden_trabajo_id = ?',
      [completada ? 1 : 0, ottId, otId]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Tarea no encontrada en la OT' });

    // Auto-update OT estado based on task completion
    const [tareas] = await pool.query(
      'SELECT completada FROM orden_trabajo_tarea WHERE orden_trabajo_id = ?',
      [otId]
    );
    const todasCompletadas = tareas.length > 0 && tareas.every(t => t.completada === 1);
    const algunaCompletada = tareas.some(t => t.completada === 1);
    let nuevoEstado = 'Pendiente';
    if (todasCompletadas) nuevoEstado = 'Finalizada';
    else if (algunaCompletada) nuevoEstado = 'En Proceso';

    await pool.query('UPDATE orden_trabajo SET estado = ? WHERE id = ?', [nuevoEstado, otId]);

    return res.json({ message: 'Tarea actualizada', estado: nuevoEstado });
  } catch (e) { next(e); }
}