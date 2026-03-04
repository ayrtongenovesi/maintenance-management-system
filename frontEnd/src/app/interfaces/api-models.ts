export interface ApiMessageResponse {
    message: string;
}

export type UserRole = 'administrador' | 'operario';

export interface AuthLoginResponse {
    message: string;
    token: string;
    rol: UserRole;
}

export interface AuthRegisterResponse {
    message: string;
    userId: number;
    rol: UserRole;
}

export interface LoginCredentials {
    mail: string;
    contraseña: string;
}

export interface RegisterPayload {
    nombre: string;
    mail: string;
    contraseña: string;
}

export interface ActivoApi {
    id: number;
    Nombre: string;
}

export interface PisoApi {
    id: number;
    Nombre: string;
}

export interface SectorApi {
    id: number;
    Sector: string;
    IdEdificio: number;
    IdPiso: number;
}

export interface EdificioApi {
    id: number;
    Nombre: string;
    Direccion: string;
}

export interface UbicacionApi {
    id: number;
    Nombre: string;
}

export interface TareaApi {
    id: number;
    Descripcion: string;
}

export interface UsuarioApi {
    id: number;
    nombre: string;
    mail: string;
    rol?: UserRole;
    Nombre?: string;
    Mail?: string;
    Rol?: string;
}

export interface TareaDetalleOT {
    ottId: number;
    tareaId: number;
    descripcion: string;
    completada: boolean;
}

export interface OrdenTrabajo {
    id: number;
    edificio: string;
    piso: string;
    ubicacion: string;
    sector: string;
    tipoActivo: string;
    usuario: string;
    tareas: string;
    tareasDetalle: TareaDetalleOT[];
    fecha?: string;
    estado?: string;
    expanded?: boolean;
}

export interface CreateOTPayload {
    edificioId: number;
    sectorId: number;
    pisoId: number;
    ubicacionId: number;
    activoId: number;
    usuarioId: number;
    tareasIds: number[];
    fecha: string;
    estado: string;
}

export interface CreateOTResponse {
    message: string;
    id: number;
}
