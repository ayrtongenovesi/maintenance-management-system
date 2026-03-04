import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { OrdenTrabajo } from '../../interfaces/api-models';

@Component({
    selector: 'app-historial',
    templateUrl: './historial.component.html',
    styleUrls: ['./historial.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class HistorialComponent implements OnInit {

    ots: OrdenTrabajo[] = [];
    filteredOts: OrdenTrabajo[] = [];
    edificios: string[] = [];
    pisos: string[] = [];
    ubicaciones: string[] = [];
    sectores: string[] = [];
    activos: string[] = [];
    operarios: string[] = [];

    selectedEdificio: string = '';
    selectedPiso: string = '';
    selectedUbicacion: string = '';
    selectedSector: string = '';
    selectedActivo: string = '';
    selectedOperario: string = '';
    datosTareas: string[] = [];
    isLoading: boolean = false;
    showDeleteDialog: boolean = false;
    deleteId: number = 0;

    notificationMessage = '';
    notificationType = 'info';
    showNotification = false;
    private timeoutRef: ReturnType<typeof setTimeout> | null = null;
    isAdmin = false;

    constructor(private api: ApiService, private userService: UserService) { }

    ngOnInit(): void {
        this.isAdmin = this.userService.isAdmin();
        this.loadData();
    }

    private mostrarNotificacion(message: string, type: string): void {
        this.notificationMessage = message;
        this.notificationType = type;
        this.showNotification = true;
        if (this.timeoutRef !== null) clearTimeout(this.timeoutRef);
        this.timeoutRef = setTimeout(() => this.showNotification = false, 3000);
    }

    loadData(): void {
        this.isLoading = true;
        this.api.getOTs().subscribe({
            next: (ots) => {
                this.ots = ots;
                this.extractUniqueValues();
                this.applyFilters();
                this.isLoading = false;
            },
            error: () => {
                this.mostrarNotificacion('Error al cargar órdenes', 'error');
                this.isLoading = false;
            }
        });
    }

    extractUniqueValues() {
        this.edificios = [...new Set(this.ots.map(ot => ot.edificio))];
        this.pisos = [...new Set(this.ots.map(ot => ot.piso))];
        this.ubicaciones = [...new Set(this.ots.map(ot => ot.ubicacion))];
        this.sectores = [...new Set(this.ots.map(ot => ot.sector))];
        this.activos = [...new Set(this.ots.map(ot => ot.tipoActivo))];
        this.operarios = [...new Set(this.ots.map(ot => ot.usuario))];
    }

    applyFilters() {
        this.filteredOts = this.ots.filter(ot =>
            (!this.selectedEdificio || ot.edificio.includes(this.selectedEdificio)) &&
            (!this.selectedPiso || ot.piso.includes(this.selectedPiso)) &&
            (!this.selectedUbicacion || ot.ubicacion.includes(this.selectedUbicacion)) &&
            (!this.selectedSector || ot.sector.includes(this.selectedSector)) &&
            (!this.selectedActivo || ot.tipoActivo.includes(this.selectedActivo)) &&
            (!this.selectedOperario || ot.usuario.includes(this.selectedOperario))
        );
    }

    filtrarOTs() { this.applyFilters(); }

    promptdeleteOT(id: number) {
        if (!this.isAdmin) return;
        this.deleteId = id;
        this.showDeleteDialog = true;
    }

    confirmDelete(): void {
        this.api.deleteOT(this.deleteId).subscribe({
            next: () => {
                this.loadData();
                this.mostrarNotificacion('Orden eliminada correctamente', 'success');
            },
            error: () => {
                this.mostrarNotificacion('Error al eliminar la orden', 'error');
            }
        });
        this.showDeleteDialog = false;
    }

    cancelDelete(): void {
        this.showDeleteDialog = false;
    }

    reiniciar(): void {
        this.selectedEdificio = '';
        this.selectedPiso = '';
        this.selectedUbicacion = '';
        this.selectedSector = '';
        this.selectedActivo = '';
        this.selectedOperario = '';
        this.applyFilters();
    }

    cambiarEstado(id: number, estado: boolean): void {
        const nuevoEstado = estado ? 'Finalizada' : 'Pendiente';
        const orden = this.ots.find(o => o.id === id);
        if (orden) {
            orden.estado = nuevoEstado;
            if (nuevoEstado === 'Finalizada' && orden.tareasDetalle) {
                orden.tareasDetalle.forEach(t => t.completada = true);
            } else if (nuevoEstado === 'Pendiente' && orden.tareasDetalle) {
                orden.tareasDetalle.forEach(t => t.completada = false);
            }
            this.applyFilters();
        }

        this.api.updateEstadoOT(id, nuevoEstado).subscribe({
            next: () => {
                this.mostrarNotificacion('Orden marcada como ' + nuevoEstado.toLowerCase(), 'success');
            },
            error: () => {
                this.mostrarNotificacion('Error al actualizar el estado', 'error');
                this.loadData();
            }
        });
    }

    toggleExpand(ot: OrdenTrabajo): void {
        ot.expanded = !ot.expanded;
    }

    toggleTarea(ot: OrdenTrabajo, ottId: number, completada: boolean): void {
        const tarea = ot.tareasDetalle?.find(t => t.ottId === ottId);
        if (tarea) {
            tarea.completada = completada;
        }

        this.api.toggleTareaOT(ot.id, ottId, completada).subscribe({
            next: (resp) => {
                ot.estado = resp.estado;
                this.applyFilters();
                this.mostrarNotificacion(
                    completada ? 'Tarea marcada como realizada' : 'Tarea desmarcada',
                    'success'
                );
            },
            error: () => {
                if (tarea) tarea.completada = !completada;
                this.mostrarNotificacion('Error al actualizar la tarea', 'error');
            }
        });
    }

    getTareasCompletadas(ot: OrdenTrabajo): number {
        return ot.tareasDetalle?.filter(t => t.completada).length || 0;
    }

    getTareasTotal(ot: OrdenTrabajo): number {
        return ot.tareasDetalle?.length || 0;
    }

    getProgresoTareas(ot: OrdenTrabajo): number {
        const total = this.getTareasTotal(ot);
        if (total === 0) return 0;
        return Math.round((this.getTareasCompletadas(ot) / total) * 100);
    }

    logout() {
        this.userService.logout();
        window.location.href = '/login';
    }
}
