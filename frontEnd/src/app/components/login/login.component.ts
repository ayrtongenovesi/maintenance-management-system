import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { LoginCredentials, RegisterPayload } from '../../interfaces/api-models';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    loginForm!: FormGroup;
    registerForm!: FormGroup;
    isLoginMode = true;
    isLoading = false;
    hidePassword = true;
    notificationMessage = '';
    notificationType = 'info';
    showNotification = false;
    private timeoutRef: ReturnType<typeof setTimeout> | null = null;

    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.initForms();
    }

    private initForms(): void {
        this.loginForm = this.fb.group({
            mail: ['', [Validators.required, Validators.email]],
            contrasena: ['', [Validators.required, Validators.minLength(3)]]
        });

        this.registerForm = this.fb.group({
            nombre: ['', [Validators.required, Validators.minLength(2)]],
            mail: ['', [Validators.required, Validators.email]],
            contrasena: ['', [Validators.required, Validators.minLength(3)]]
        });
    }

    toggleMode(): void {
        this.isLoginMode = !this.isLoginMode;
        this.loginForm.reset();
        this.registerForm.reset();
    }

    private mostrarNotificacion(message: string, type: string): void {
        this.notificationMessage = message;
        this.notificationType = type;
        this.showNotification = true;
        if (this.timeoutRef !== null) clearTimeout(this.timeoutRef);
        this.timeoutRef = setTimeout(() => this.showNotification = false, 1000);
    }

    login(): void {
        if (this.loginForm.invalid) {
            this.mostrarNotificacion('Por favor, complete todos los campos correctamente.', 'error');
            Object.keys(this.loginForm.controls).forEach(key => {
                this.loginForm.get(key)?.markAsTouched();
            });
            return;
        }

        this.isLoading = true;
        const credentials: LoginCredentials = {
            mail: this.loginForm.value.mail,
            contraseña: this.loginForm.value.contrasena
        };

        this.userService.login(credentials).subscribe({
            next: (response) => {
                this.userService.saveToken(response.token);
                this.mostrarNotificacion('Inicio de sesión exitoso.', 'success');
                setTimeout(() => {
                    this.isLoading = false;
                    this.router.navigate([this.userService.getHomeRouteByRole()]);
                }, 1000);
            },
            error: (error: unknown) => {
                console.error('Error en login:', error);
                this.isLoading = false;
                this.mostrarNotificacion('Contraseña o correo incorrecto.', 'error');
            }
        });
    }

    register(): void {
        if (this.registerForm.invalid) {
            this.mostrarNotificacion('Por favor, complete todos los campos correctamente.', 'error');
            Object.keys(this.registerForm.controls).forEach(key => {
                this.registerForm.get(key)?.markAsTouched();
            });
            return;
        }

        this.isLoading = true;
        const userData: RegisterPayload = {
            nombre: this.registerForm.value.nombre,
            mail: this.registerForm.value.mail,
            contraseña: this.registerForm.value.contrasena
        };

        this.userService.register(userData).subscribe({
            next: () => {
                this.mostrarNotificacion('Usuario creado exitosamente.', 'success');
                setTimeout(() => {
                    this.isLoading = false;
                    this.isLoginMode = true;
                    this.loginForm.patchValue({ mail: userData.mail, contrasena: '' });
                }, 1500);
            },
            error: (error: { status?: number }) => {
                console.error('Error en registro:', error);
                this.isLoading = false;
                if (error.status === 400) {
                    this.mostrarNotificacion('El correo o nombre ya está en uso.', 'error');
                } else {
                    this.mostrarNotificacion('Error al registrar. Intente nuevamente.', 'error');
                }
            }
        });
    }

    get emailControl() {
        return this.isLoginMode ? this.loginForm.get('mail') : this.registerForm.get('mail');
    }

    get passwordControl() {
        return this.isLoginMode ? this.loginForm.get('contrasena') : this.registerForm.get('contrasena');
    }

    get nombreControl() {
        return this.registerForm.get('nombre');
    }
}
