import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { PdfService } from '../../services/pdf.service';
import { ActivoApi, CreateOTPayload, EdificioApi, PisoApi, SectorApi, TareaApi, UbicacionApi, UsuarioApi } from '../../interfaces/api-models';

@Component({
    selector: 'app-orden-trabajo',
    templateUrl: './orden-trabajo.component.html',
    styleUrl: './orden-trabajo.component.css'
})
export class OrdenTrabajoComponent implements OnInit {
    ordenForm!: FormGroup;
    minFecha: string = new Date().toISOString().split('T')[0];
    pdfUrl: string = '';
    isLoading = false;
    isSaving = false;

    notificationMessage = '';
    notificationType = 'info';
    showNotification = false;
    private timeoutRef: ReturnType<typeof setTimeout> | null = null;

    datosPiso: PisoApi[] = [];
    datosEdificio: EdificioApi[] = [];
    datosUsuario: UsuarioApi[] = [];
    datosActivo: ActivoApi[] = [];
    datosUbicacion: UbicacionApi[] = [];
    datosSector: SectorApi[] = [];
    sectoresFiltrados: SectorApi[] = [];
    datosTareas: TareaApi[] = [];

    constructor(
        private fb: FormBuilder,
        private api: ApiService,
        private userService: UserService,
        private pdf: PdfService,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.initForm();
        this.loadAllData();
        this.setupPisoListener();
    }

    private initForm(): void {
        this.ordenForm = this.fb.group({
            edificio: ['', Validators.required],
            piso: ['', Validators.required],
            sector: ['', Validators.required],
            ubicacion: ['', Validators.required],
            tipoActivo: ['', Validators.required],
            usuario: ['', Validators.required],
            tareas: [[], Validators.required],
            fecha: [this.minFecha, Validators.required]
        });
    }

    private loadAllData(): void {
        this.isLoading = true;
        Promise.all([
            this.dataPiso(),
            this.dataEdificio(),
            this.dataUsuario(),
            this.dataActivo(),
            this.dataUbicacion(),
            this.dataSector(),
            this.dataTareas()
        ]).finally(() => {
            this.isLoading = false;
        });
    }

    private setupPisoListener(): void {
        this.ordenForm.get('piso')?.valueChanges.subscribe((pisoNombre: string) => {
            const pisoSeleccionado = this.datosPiso.find(p => p.Nombre === pisoNombre);
            if (pisoSeleccionado) {
                this.sectoresFiltrados = this.datosSector.filter(s => s.IdPiso === pisoSeleccionado.id);
            } else {
                this.sectoresFiltrados = [];
            }
            this.ordenForm.get('sector')?.setValue('');
        });
    }

    private mostrarNotificacion(message: string, type: string): void {
        this.notificationMessage = message;
        this.notificationType = type;
        this.showNotification = true;
        if (this.timeoutRef !== null) clearTimeout(this.timeoutRef);
        this.timeoutRef = setTimeout(() => this.showNotification = false, 3000);
    }

    logout(): void {
        this.userService.logout();
        window.location.href = '/login';
    }

    mostrarAyuda(): void {
        this.dialog.open(AyudaDialogComponent, {
            width: '600px',
            maxWidth: '90vw'
        });
    }

    private dataPiso(): Promise<void> {
        return new Promise((resolve) => {
            this.api.getPisos().subscribe({
                next: (data: PisoApi[]) => {
                    this.datosPiso = data;
                    resolve();
                },
                error: () => resolve()
            });
        });
    }

    private dataEdificio(): Promise<void> {
        return new Promise((resolve) => {
            this.api.getEdificios().subscribe({
                next: (data: EdificioApi[]) => {
                    this.datosEdificio = data;
                    resolve();
                },
                error: () => resolve()
            });
        });
    }

    private dataSector(): Promise<void> {
        return new Promise((resolve) => {
            this.api.getSectores().subscribe({
                next: (data: SectorApi[]) => {
                    this.datosSector = data;
                    resolve();
                },
                error: () => resolve()
            });
        });
    }

    private dataUsuario(): Promise<void> {
        return new Promise((resolve) => {
            this.api.getUsuarios().subscribe({
                next: (data: UsuarioApi[]) => {
                    this.datosUsuario = data.map((u) => ({
                        ...u,
                        rol: u.rol === 'administrador' || u.rol === 'operario' ? u.rol : undefined,
                    }));
                    resolve();
                },
                error: () => resolve()
            });
        });
    }

    private dataActivo(): Promise<void> {
        return new Promise((resolve) => {
            this.api.getActivos().subscribe({
                next: (data: ActivoApi[]) => {
                    this.datosActivo = data;
                    resolve();
                },
                error: () => resolve()
            });
        });
    }

    private dataUbicacion(): Promise<void> {
        return new Promise((resolve) => {
            this.api.getUbicaciones().subscribe({
                next: (data: UbicacionApi[]) => {
                    this.datosUbicacion = data;
                    resolve();
                },
                error: () => resolve()
            });
        });
    }

    private dataTareas(): Promise<void> {
        return new Promise((resolve) => {
            this.api.getTareas().subscribe({
                next: (data: TareaApi[]) => {
                    this.datosTareas = data;
                    resolve();
                },
                error: () => resolve()
            });
        });
    }

    validarYGuardar(): void {
        if (this.ordenForm.invalid) {
            this.mostrarNotificacion('Por favor, complete todos los campos requeridos.', 'error');
            Object.keys(this.ordenForm.controls).forEach(key => {
                this.ordenForm.get(key)?.markAsTouched();
            });
            return;
        }
        this.guardarEnOT();
    }

    guardarEnOT(): void {
        this.isSaving = true;
        const formValue = this.ordenForm.value;

        const fechaNormalizada = formValue.fecha ? new Date(formValue.fecha).toISOString().split('T')[0] : this.minFecha;

        const tareasArray: string[] = Array.isArray(formValue.tareas)
            ? (formValue.tareas as string[])
            : [formValue.tareas as string];
        const tareasJoin = tareasArray.filter((t: string) => !!t && t.trim().length > 0).join(', ');

        if (tareasJoin.length > 500) {
            this.mostrarNotificacion(`Las tareas seleccionadas (${tareasJoin.length} caracteres) exceden el límite de 500. Deseleccione algunas tareas.`, 'error');
            this.isSaving = false;
            return;
        }

        const edificioSeleccionado = this.datosEdificio.find(e => e.Nombre === formValue.edificio);
        const pisoSeleccionado = this.datosPiso.find(p => p.Nombre === formValue.piso);
        const sectorSeleccionado = this.datosSector.find(s => s.Sector === formValue.sector);
        const ubicacionSeleccionada = this.datosUbicacion.find(u => u.Nombre === formValue.ubicacion);
        const activoSeleccionado = this.datosActivo.find(a => a.Nombre === formValue.tipoActivo);
        const usuarioIdSeleccionado = Number(formValue.usuario);
        const usuarioSeleccionado = this.datosUsuario.find(u => u.id === usuarioIdSeleccionado);

        if (!edificioSeleccionado || !pisoSeleccionado || !sectorSeleccionado ||
            !ubicacionSeleccionada || !activoSeleccionado || !usuarioSeleccionado) {
            this.mostrarNotificacion('Error al mapear los datos seleccionados', 'error');
            this.isSaving = false;
            return;
        }

        const edificioId = edificioSeleccionado.id;
        const pisoId = pisoSeleccionado.id;
        const sectorId = sectorSeleccionado.id;
        const ubicacionId = ubicacionSeleccionada.id;
        const activoId = activoSeleccionado.id;
        const usuarioId = usuarioSeleccionado.id;
        const tareasIds = this.datosTareas
            .filter(t => tareasArray.includes(t.Descripcion))
            .map(t => t.id);

        const datosNormalizados: CreateOTPayload = {
            edificioId,
            pisoId,
            sectorId,
            ubicacionId,
            activoId,
            usuarioId,
            tareasIds,
            fecha: fechaNormalizada,
            estado: 'Pendiente'
        };

        this.api.createOT(datosNormalizados).subscribe({
            next: async () => {
                this.isSaving = false;
                this.mostrarNotificacion('Orden de trabajo creada exitosamente', 'success');
                await this.generatePDF();
                this.borradoForm();
            },
            error: (err) => {
                this.isSaving = false;
                const backendMsg = err?.error?.message || err?.message || 'Error al guardar la orden de trabajo';
                this.mostrarNotificacion(backendMsg, 'error');
            }
        });
    }

    borradoForm(): void {
        this.ordenForm.reset({
            fecha: this.minFecha
        });
        this.sectoresFiltrados = [];
        this.pdfUrl = '';
    }

    imprimirPagina(): void {
        window.print();
    }

    async generatePDF(): Promise<void> {
        if (this.ordenForm.invalid) {
            this.mostrarNotificacion('Complete todos los campos antes de generar el PDF.', 'error');
            return;
        }

        const dataUrl = await this.pdf.elementToPdf('pdf-content', 'ordenDeTrabajo.pdf');
        if (dataUrl) {
            this.pdfUrl = dataUrl;
            this.mostrarNotificacion('PDF generado correctamente.', 'success');
        } else {
            this.mostrarNotificacion('Error al generar el PDF.', 'error');
        }
    }

    get edificioControl() { return this.ordenForm.get('edificio'); }
    get pisoControl() { return this.ordenForm.get('piso'); }
    get sectorControl() { return this.ordenForm.get('sector'); }
    get ubicacionControl() { return this.ordenForm.get('ubicacion'); }
    get tipoActivoControl() { return this.ordenForm.get('tipoActivo'); }
    get usuarioControl() { return this.ordenForm.get('usuario'); }
    get tareasControl() { return this.ordenForm.get('tareas'); }
    get fechaControl() { return this.ordenForm.get('fecha'); }

    get operariosDisponibles(): UsuarioApi[] {
        return this.datosUsuario.filter((usuario) => usuario.rol === 'operario');
    }

    get nombreOperarioSeleccionado(): string {
        const usuarioIdSeleccionado = Number(this.ordenForm.value.usuario);
        const usuarioSeleccionado = this.datosUsuario.find((usuario) => usuario.id === usuarioIdSeleccionado);
        return usuarioSeleccionado?.nombre || '';
    }
}


@Component({
    selector: 'app-ayuda-dialog',
    template: `
    <h2 mat-dialog-title>
      <mat-icon style="vertical-align: middle; margin-right: 8px;">help_outline</mat-icon>
      Ayuda - Orden de Trabajo
    </h2>
    <mat-dialog-content>
      <div class="ayuda-content">
        <h3><mat-icon>info</mat-icon> ¿Cómo funciona?</h3>
        <p>Esta sección permite crear nuevas órdenes de trabajo para el mantenimiento de activos en la universidad.</p>
        
        <h3><mat-icon>checklist</mat-icon> Pasos para crear una orden:</h3>
        <ol>
          <li><strong>Seleccione la ubicación:</strong> Edificio, Piso, Sector y Ubicación específica</li>
          <li><strong>Elija el activo:</strong> Tipo de activo que requiere mantenimiento</li>
          <li><strong>Asigne un operario:</strong> Personal encargado de realizar las tareas</li>
          <li><strong>Seleccione las tareas:</strong> Puede elegir múltiples tareas de mantenimiento</li>
          <li><strong>Defina la fecha:</strong> Fecha programada para la ejecución</li>
        </ol>

        <h3><mat-icon>tips_and_updates</mat-icon> Funcionalidades:</h3>
        <ul>
          <li><strong>Crear Orden:</strong> Guarda la orden en el sistema</li>
          <li><strong>Generar PDF:</strong> Crea un documento descargable con la información</li>
          <li><strong>Limpiar Formulario:</strong> Reinicia todos los campos</li>
        </ul>

        <div class="ayuda-nota">
          <mat-icon>warning</mat-icon>
          <p><strong>Nota:</strong> Todos los campos son obligatorios. El sistema validará que la información esté completa antes de crear la orden.</p>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-raised-button color="primary" mat-dialog-close>
        <mat-icon>check</mat-icon>
        Entendido
      </button>
    </mat-dialog-actions>
  `,
    styles: [`
    .ayuda-content {
      padding: 16px 0;
    }
    
    .ayuda-content h3 {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #667eea;
      margin-top: 20px;
      margin-bottom: 12px;
      font-size: 18px;
    }

    .ayuda-content p {
      margin: 8px 0;
      line-height: 1.6;
      color: #333;
    }

    .ayuda-content ol, .ayuda-content ul {
      margin: 12px 0;
      padding-left: 24px;
    }

    .ayuda-content li {
      margin: 8px 0;
      line-height: 1.6;
    }

    .ayuda-content strong {
      color: #1f6cb0;
    }

    .ayuda-nota {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 12px;
      margin-top: 20px;
      border-radius: 4px;
      display: flex;
      gap: 12px;
      align-items: flex-start;
    }

    .ayuda-nota mat-icon {
      color: #ff9800;
      margin-top: 2px;
    }

    .ayuda-nota p {
      margin: 0;
      flex: 1;
    }

    ::ng-deep .mat-mdc-dialog-title {
      display: flex;
      align-items: center;
      color: #667eea;
      font-size: 24px;
      margin-bottom: 0;
    }

    ::ng-deep .mat-mdc-dialog-actions button {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  `]
})
export class AyudaDialogComponent { }
