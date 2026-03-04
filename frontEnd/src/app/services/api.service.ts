import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
    ActivoApi,
    EdificioApi,
    PisoApi,
    SectorApi,
    UbicacionApi,
    TareaApi,
    UsuarioApi,
    CreateOTPayload,
    CreateOTResponse,
    OrdenTrabajo,
    ApiMessageResponse,
    TareaDetalleOT
} from '../interfaces/api-models';

@Injectable({ providedIn: 'root' })
export class ApiService {
    private baseUrl = environment.apiBaseUrl;

    constructor(private http: HttpClient) { }

    private getHeaders(): { headers: HttpHeaders } {
        const token = localStorage.getItem('token');
        return {
            headers: new HttpHeaders({
                'Authorization': 'Bearer ' + (token || '')
            })
        };
    }

    getActivos(): Observable<ActivoApi[]> {
        return this.http.get<ActivoApi[]>(this.baseUrl + '/activo', this.getHeaders());
    }

    createActivo(data: { Nombre: string }): Observable<ActivoApi> {
        return this.http.post<ActivoApi>(this.baseUrl + '/activo/create', data, this.getHeaders());
    }

    updateActivo(id: number, data: { Nombre: string }): Observable<ActivoApi> {
        return this.http.put<ActivoApi>(this.baseUrl + '/activo/edit/' + id, data, this.getHeaders());
    }

    deleteActivo(id: number): Observable<void> {
        return this.http.delete<void>(this.baseUrl + '/activo/delete/' + id, this.getHeaders());
    }

    getPisos(): Observable<PisoApi[]> {
        return this.http.get<PisoApi[]>(this.baseUrl + '/piso', this.getHeaders());
    }

    createPiso(data: { Nombre: string }): Observable<PisoApi> {
        return this.http.post<PisoApi>(this.baseUrl + '/piso/create', data, this.getHeaders());
    }

    updatePiso(id: number, data: { Nombre: string }): Observable<PisoApi> {
        return this.http.put<PisoApi>(this.baseUrl + '/piso/edit/' + id, data, this.getHeaders());
    }

    deletePiso(id: number): Observable<void> {
        return this.http.delete<void>(this.baseUrl + '/piso/delete/' + id, this.getHeaders());
    }

    getSectores(): Observable<SectorApi[]> {
        return this.http.get<SectorApi[]>(this.baseUrl + '/sector', this.getHeaders());
    }

    getSectoresByPiso(pisoId: number): Observable<SectorApi[]> {
        return this.http.get<SectorApi[]>(this.baseUrl + '/sector?pisoId=' + pisoId, this.getHeaders());
    }

    createSector(data: { Sector: string; IdEdificio: number; IdPiso: number }): Observable<SectorApi> {
        return this.http.post<SectorApi>(this.baseUrl + '/sector/create', data, this.getHeaders());
    }

    updateSector(id: number, data: { Sector: string; IdEdificio: number; IdPiso: number }): Observable<SectorApi> {
        return this.http.put<SectorApi>(this.baseUrl + '/sector/edit/' + id, data, this.getHeaders());
    }

    deleteSector(id: number): Observable<void> {
        return this.http.delete<void>(this.baseUrl + '/sector/delete/' + id, this.getHeaders());
    }

    getEdificios(): Observable<EdificioApi[]> {
        return this.http.get<EdificioApi[]>(this.baseUrl + '/edificio', this.getHeaders());
    }

    createEdificio(data: { Nombre: string; Direccion: string }): Observable<EdificioApi> {
        return this.http.post<EdificioApi>(this.baseUrl + '/edificio/create', data, this.getHeaders());
    }

    updateEdificio(id: number, data: { Nombre: string; Direccion: string }): Observable<EdificioApi> {
        return this.http.put<EdificioApi>(this.baseUrl + '/edificio/edit/' + id, data, this.getHeaders());
    }

    deleteEdificio(id: number): Observable<void> {
        return this.http.delete<void>(this.baseUrl + '/edificio/delete/' + id, this.getHeaders());
    }

    getUbicaciones(): Observable<UbicacionApi[]> {
        return this.http.get<UbicacionApi[]>(this.baseUrl + '/ubicacion', this.getHeaders());
    }

    createUbicacion(data: { Nombre: string }): Observable<UbicacionApi> {
        return this.http.post<UbicacionApi>(this.baseUrl + '/ubicacion/create', data, this.getHeaders());
    }

    updateUbicacion(id: number, data: { Nombre: string }): Observable<UbicacionApi> {
        return this.http.put<UbicacionApi>(this.baseUrl + '/ubicacion/edit/' + id, data, this.getHeaders());
    }

    deleteUbicacion(id: number): Observable<void> {
        return this.http.delete<void>(this.baseUrl + '/ubicacion/delete/' + id, this.getHeaders());
    }

    getTareas(): Observable<TareaApi[]> {
        return this.http.get<TareaApi[]>(this.baseUrl + '/tareas', this.getHeaders());
    }

    createTarea(data: { descripcion: string }): Observable<TareaApi> {
        return this.http.post<TareaApi>(this.baseUrl + '/tareas/create', data, this.getHeaders());
    }

    updateTarea(id: number, data: { descripcion: string }): Observable<TareaApi> {
        return this.http.put<TareaApi>(this.baseUrl + '/tareas/edit/' + id, data, this.getHeaders());
    }

    deleteTarea(id: number): Observable<void> {
        return this.http.delete<void>(this.baseUrl + '/tareas/delete/' + id, this.getHeaders());
    }

    getUsuarios(): Observable<UsuarioApi[]> {
        return this.http.get<UsuarioApi[]>(this.baseUrl + '/usuario', this.getHeaders());
    }

    createUsuario(data: { nombre: string; mail: string; contraseña: string; rol: string }): Observable<{ message: string; id: number; rol: string }> {
        return this.http.post<{ message: string; id: number; rol: string }>(this.baseUrl + '/usuario/create', data, this.getHeaders());
    }

    updateUsuario(id: number, data: { nombre: string; mail: string; rol: string }): Observable<UsuarioApi> {
        return this.http.put<UsuarioApi>(this.baseUrl + '/usuario/edit/' + id, data, this.getHeaders());
    }

    deleteUsuario(id: number, force: boolean = false): Observable<void> {
        const url = this.baseUrl + '/usuario/delete/' + id + (force ? '?force=true' : '');
        return this.http.delete<void>(url, this.getHeaders());
    }

    getOTs(): Observable<OrdenTrabajo[]> {
        return this.http.get<OrdenTrabajo[]>(this.baseUrl + '/ot', this.getHeaders());
    }

    createOT(data: CreateOTPayload): Observable<CreateOTResponse> {
        return this.http.post<CreateOTResponse>(this.baseUrl + '/ot/create', data, this.getHeaders());
    }

    deleteOT(id: number): Observable<void> {
        return this.http.delete<void>(this.baseUrl + '/ot/delete/' + id, this.getHeaders());
    }

    updateEstadoOT(id: number, estado: string): Observable<ApiMessageResponse> {
        return this.http.put<ApiMessageResponse>(this.baseUrl + '/ot/edit/' + id, { estado }, this.getHeaders());
    }

    toggleTareaOT(otId: number, ottId: number, completada: boolean): Observable<{ message: string; estado: string }> {
        return this.http.put<{ message: string; estado: string }>(
            this.baseUrl + '/ot/' + otId + '/tarea/' + ottId,
            { completada },
            this.getHeaders()
        );
    }
}
