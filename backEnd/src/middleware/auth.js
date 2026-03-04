import jwt from 'jsonwebtoken';

export function authMiddleware(req, res, next) {
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Token requerido' });
    }
    try {
        const token = auth.slice(7);
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'tu_secreto');
        req.user = {
            id: payload.id,
            nombre: payload.nombre,
            mail: payload.mail,
            rol: payload.rol
        };
        next();
    } catch (e) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
}

export function checkAdmin(req, res, next) {
    if (req.user.rol !== 'administrador') {
        return res.status(403).json({ message: 'No tiene permisos para esta acción' });
    }
    next();
}
