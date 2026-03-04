import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-gestion',
    templateUrl: './gestion.component.html',
    styleUrls: ['./gestion.component.css']
})
export class GestionComponent implements OnInit {

    sections: { name: string; key: string; data: { id: number; Nombre: string; Mail?: string; Rol?: string }[] }[] = [];
    isLoading = true;

    showNotification = false;
    notificationMessage = '';
    notificationType = 'success';

    showUserDeleteDialog = false;
    pendingDeleteMessage = '';
    pendingDeleteId = 0;

    constructor(
        private api: ApiService,
        private userService: UserService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.loadAll();
    }

    loadAll(): void {
        this.isLoading = true;

        let loaded = 0;
        const total = 7;

        let edificios: { id: number; Nombre: string }[] = [];
        let pisos: { id: number; Nombre: string }[] = [];
        let sectores: { id: number; Nombre: string }[] = [];
        let ubicaciones: { id: number; Nombre: string }[] = [];
        let activos: { id: number; Nombre: string }[] = [];
        let usuarios: { id: number; Nombre: string; Mail?: string; Rol?: string }[] = [];
        let tareas: { id: number; Nombre: string }[] = [];

        const checkDone = () => {
            loaded++;
            if (loaded === total) {
                this.sections = [
                    { name: 'Edificios', key: 'edificio', data: edificios },
                    { name: 'Pisos', key: 'piso', data: pisos },
                    { name: 'Sectores', key: 'sector', data: sectores },
                    { name: 'Ubicaciones', key: 'ubicacion', data: ubicaciones },
                    { name: 'Activos', key: 'activo', data: activos },
                    { name: 'Usuarios', key: 'usuario', data: usuarios },
                    { name: 'Tareas', key: 'tarea', data: tareas }
                ];
                this.isLoading = false;
            }
        };

        this.api.getEdificios().subscribe({
            next: (res) => {
                edificios = res.map(e => ({ id: e.id, Nombre: e.Nombre }));
                checkDone();
            },
            error: () => checkDone()
        });

        this.api.getPisos().subscribe({
            next: (res) => {
                pisos = res.map(p => ({ id: p.id, Nombre: p.Nombre }));
                checkDone();
            },
            error: () => checkDone()
        });

        this.api.getSectores().subscribe({
            next: (res) => {
                sectores = res.map(s => ({ id: s.id, Nombre: s.Sector }));
                checkDone();
            },
            error: () => checkDone()
        });

        this.api.getUbicaciones().subscribe({
            next: (res) => {
                ubicaciones = res.map(u => ({ id: u.id, Nombre: u.Nombre }));
                checkDone();
            },
            error: () => checkDone()
        });

        this.api.getActivos().subscribe({
            next: (res) => {
                activos = res.map(a => ({ id: a.id, Nombre: a.Nombre }));
                checkDone();
            },
            error: () => checkDone()
        });

        this.api.getUsuarios().subscribe({
            next: (res) => {
                usuarios = res.map(u => ({ id: u.id, Nombre: u.nombre, Mail: u.mail, Rol: u.rol }));
                checkDone();
            },
            error: () => checkDone()
        });

        this.api.getTareas().subscribe({
            next: (res) => {
                tareas = res.map(t => ({ id: t.id, Nombre: t.Descripcion }));
                checkDone();
            },
            error: () => checkDone()
        });
    }

    getSectionIcon(name: string): string {
        switch (name) {
            case 'Edificios': return 'apartment';
            case 'Pisos': return 'layers';
            case 'Sectores': return 'domain';
            case 'Ubicaciones': return 'place';
            case 'Activos': return 'build';
            case 'Usuarios': return 'people';
            case 'Tareas': return 'task';
            default: return 'folder';
        }
    }

    add(model: { Nombre: string }, collection: string): void {
        if (!model.Nombre) {
            this.showError('Completa el nombre');
            return;
        }

        switch (collection) {
            case 'edificio':
                this.api.createEdificio({ Nombre: model.Nombre, Direccion: '' }).subscribe({
                    next: () => { this.showSuccess('Edificio creado'); this.loadAll(); },
                    error: (err) => this.handleAddError(err)
                });
                break;
            case 'piso':
                this.api.createPiso({ Nombre: model.Nombre }).subscribe({
                    next: () => { this.showSuccess('Piso creado'); this.loadAll(); },
                    error: (err) => this.handleAddError(err)
                });
                break;
            case 'sector':
                this.api.createSector({ Sector: model.Nombre, IdEdificio: 1, IdPiso: 1 }).subscribe({
                    next: () => { this.showSuccess('Sector creado'); this.loadAll(); },
                    error: (err) => this.handleAddError(err)
                });
                break;
            case 'ubicacion':
                this.api.createUbicacion({ Nombre: model.Nombre }).subscribe({
                    next: () => { this.showSuccess('Ubicacion creada'); this.loadAll(); },
                    error: (err) => this.handleAddError(err)
                });
                break;
            case 'activo':
                this.api.createActivo({ Nombre: model.Nombre }).subscribe({
                    next: () => { this.showSuccess('Activo creado'); this.loadAll(); },
                    error: (err) => this.handleAddError(err)
                });
                break;
            case 'tarea':
                this.api.createTarea({ descripcion: model.Nombre }).subscribe({
                    next: () => { this.showSuccess('Tarea creada'); this.loadAll(); },
                    error: (err) => this.handleAddError(err)
                });
                break;
        }
    }

    remove(id: number, collection: string): void {
        if (collection === 'usuario') {
            this.pendingDeleteId = id;
            this.pendingDeleteMessage = 'Este usuario puede tener ordenes de trabajo asignadas. ¿Desea eliminarlo de todos modos?';
            this.showUserDeleteDialog = true;
            return;
        }

        switch (collection) {
            case 'edificio':
                this.api.deleteEdificio(id).subscribe({
                    next: () => { this.showSuccess('Edificio eliminado'); this.loadAll(); },
                    error: (err) => this.handleDeleteError(err)
                });
                break;
            case 'piso':
                this.api.deletePiso(id).subscribe({
                    next: () => { this.showSuccess('Piso eliminado'); this.loadAll(); },
                    error: (err) => this.handleDeleteError(err)
                });
                break;
            case 'sector':
                this.api.deleteSector(id).subscribe({
                    next: () => { this.showSuccess('Sector eliminado'); this.loadAll(); },
                    error: (err) => this.handleDeleteError(err)
                });
                break;
            case 'ubicacion':
                this.api.deleteUbicacion(id).subscribe({
                    next: () => { this.showSuccess('Ubicacion eliminada'); this.loadAll(); },
                    error: (err) => this.handleDeleteError(err)
                });
                break;
            case 'activo':
                this.api.deleteActivo(id).subscribe({
                    next: () => { this.showSuccess('Activo eliminado'); this.loadAll(); },
                    error: (err) => this.handleDeleteError(err)
                });
                break;
            case 'tarea':
                this.api.deleteTarea(id).subscribe({
                    next: () => { this.showSuccess('Tarea eliminada'); this.loadAll(); },
                    error: (err) => this.handleDeleteError(err)
                });
                break;
        }
    }

    update(item: { id: number; Nombre: string; Mail?: string; Rol?: string }, collection: string): void {
        switch (collection) {
            case 'edificio':
                this.api.updateEdificio(item.id, { Nombre: item.Nombre, Direccion: '' }).subscribe({
                    next: () => { this.showSuccess('Edificio actualizado'); },
                    error: () => this.showError('Error al actualizar')
                });
                break;
            case 'piso':
                this.api.updatePiso(item.id, { Nombre: item.Nombre }).subscribe({
                    next: () => { this.showSuccess('Piso actualizado'); },
                    error: () => this.showError('Error al actualizar')
                });
                break;
            case 'sector':
                this.api.updateSector(item.id, { Sector: item.Nombre, IdEdificio: 1, IdPiso: 1 }).subscribe({
                    next: () => { this.showSuccess('Sector actualizado'); },
                    error: () => this.showError('Error al actualizar')
                });
                break;
            case 'ubicacion':
                this.api.updateUbicacion(item.id, { Nombre: item.Nombre }).subscribe({
                    next: () => { this.showSuccess('Ubicacion actualizada'); },
                    error: () => this.showError('Error al actualizar')
                });
                break;
            case 'activo':
                this.api.updateActivo(item.id, { Nombre: item.Nombre }).subscribe({
                    next: () => { this.showSuccess('Activo actualizado'); },
                    error: () => this.showError('Error al actualizar')
                });
                break;
            case 'tarea':
                this.api.updateTarea(item.id, { descripcion: item.Nombre }).subscribe({
                    next: () => { this.showSuccess('Tarea actualizada'); },
                    error: () => this.showError('Error al actualizar')
                });
                break;
            case 'usuario':
                const tokenData = this.userService.getTokenPayload();
                if (tokenData && tokenData.mail === item.Mail && item.Rol !== 'administrador') {
                    this.showError('No podes quitarte el rol de administrador a vos mismo');
                    this.loadAll();
                    return;
                }
                this.api.updateUsuario(item.id, { nombre: item.Nombre, mail: item.Mail || '', rol: item.Rol || 'operario' }).subscribe({
                    next: () => { this.showSuccess('Usuario actualizado'); },
                    error: () => this.showError('Error al actualizar usuario')
                });
                break;
        }
    }

    confirmUserDelete(): void {
        this.showUserDeleteDialog = false;
        this.api.deleteUsuario(this.pendingDeleteId, true).subscribe({
            next: () => {
                this.showSuccess('Usuario eliminado');
                this.loadAll();
            },
            error: () => this.showError('Error al eliminar usuario')
        });
    }

    cancelUserDelete(): void {
        this.showUserDeleteDialog = false;
        this.pendingDeleteId = 0;
        this.pendingDeleteMessage = '';
    }

    handleAddError(err: { status?: number; error?: { message?: string } }): void {
        if (err.status === 409 || (err.error && err.error.message && err.error.message.includes('Duplicate'))) {
            this.showError('Ya existe un registro con ese ID');
        } else {
            this.showError('Error al crear el registro');
        }
    }

    handleDeleteError(err: { status?: number }): void {
        if (err.status === 409) {
            this.showError('No se puede eliminar: tiene registros asociados');
        } else {
            this.showError('Error al eliminar');
        }
    }

    logout(): void {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
    }

    showSuccess(message: string): void {
        this.notificationMessage = message;
        this.notificationType = 'success';
        this.showNotification = true;
        setTimeout(() => { this.showNotification = false; }, 3000);
    }

    showError(message: string): void {
        this.notificationMessage = message;
        this.notificationType = 'error';
        this.showNotification = true;
        setTimeout(() => { this.showNotification = false; }, 4000);
    }
}
