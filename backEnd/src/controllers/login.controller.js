import { pool } from '../../config/database.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function register(req, res, next) {
    const { nombre, mail, contraseña } = req.body;
    if (!nombre || !mail || !contraseña) {
        return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }
    const rol = 'operario';
    try {
        const [existingUserByEmail] = await pool.query('SELECT * FROM usuario WHERE mail = ?', [mail]);
        if (existingUserByEmail.length > 0) return res.status(400).json({ message: 'El correo ya está en uso' });
        const [existingUserByName] = await pool.query('SELECT * FROM usuario WHERE nombre = ?', [nombre]);
        if (existingUserByName.length > 0) return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
        const hashedPassword = await bcrypt.hash(contraseña, 10);
        const [result] = await pool.query(
            'INSERT INTO usuario (nombre, mail, contraseña, rol) VALUES (?, ?, ?, ?)',
            [nombre, mail, hashedPassword, rol]
        );
        res.status(201).json({ message: 'Usuario registrado', userId: result.insertId, rol });
    } catch (e) { next(e); }
}

export async function login(req, res, next) {
    const { mail, contraseña } = req.body;
    if (!mail || !contraseña) return res.status(400).json({ message: 'El correo y la contraseña son requeridos' });
    try {
        const [rows] = await pool.query('SELECT * FROM usuario WHERE mail = ?', [mail]);
        if (rows.length === 0) return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
        const user = rows[0];
        const isMatch = await bcrypt.compare(contraseña, user.contraseña);
        if (!isMatch) return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
        const rol = user.rol || 'operario';
        const token = jwt.sign(
            { id: user.id, nombre: user.nombre, mail: user.mail, rol },
            process.env.JWT_SECRET || 'tu_secreto',
            { expiresIn: process.env.JWT_EXPIRATION || '1h' }
        );
        res.json({ message: 'Login exitoso', token, rol });
    } catch (e) { next(e); }
}
