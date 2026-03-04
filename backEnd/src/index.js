import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { errorMiddleware } from './middleware/error.js';
import cors from 'cors';
import { pool } from '../config/database.js';
import userRoutes from './routes/usuario.rutas.js';
import crudRoutes from './routes/crud.rutas.js';
import loginRoutes from './routes/login.rutas.js';
import ordenRoutes from './routes/OrdenTrabajo.rutas.js';
import { authMiddleware } from './middleware/auth.js';
import { setupSwagger } from './docs/swagger.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: 'http://localhost:4200', credentials: true
}));

app.use(express.json());
setupSwagger(app);
app.use('/api/auth', loginRoutes);
app.use('/api', authMiddleware, crudRoutes);
app.use('/api', authMiddleware, userRoutes);
app.use('/api', authMiddleware, ordenRoutes);

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`✓ Servidor iniciado en http://localhost:${PORT}`);
});