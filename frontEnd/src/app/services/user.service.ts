import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { environment } from '../../environments/environment';
import { AuthLoginResponse, AuthRegisterResponse, LoginCredentials, RegisterPayload } from '../interfaces/api-models';

@Injectable({ providedIn: 'root' })
export class UserService {
    private apiUrl = environment.authBaseUrl;

    constructor(private http: HttpClient) { }

    login(credentials: LoginCredentials): Observable<AuthLoginResponse> {
        return this.http.post<AuthLoginResponse>(this.apiUrl + '/login', credentials);
    }

    register(userData: RegisterPayload): Observable<AuthRegisterResponse> {
        return this.http.post<AuthRegisterResponse>(this.apiUrl + '/register', userData);
    }

    saveToken(token: string): void {
        localStorage.setItem('token', token);
    }

    logout(): void {
        localStorage.removeItem('token');
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isLoggedIn(): boolean {
        const token = this.getToken();
        if (!token) return false;
        try {
            const payload = jwtDecode(token) as { exp?: number };
            if (!payload.exp) return false;
            return payload.exp > Math.floor(Date.now() / 1000);
        } catch {
            return false;
        }
    }

    getTokenPayload(): { id: number; nombre: string; mail: string; rol?: string; exp?: number } | null {
        const token = this.getToken();
        if (!token) return null;
        try {
            return jwtDecode(token) as { id: number; nombre: string; mail: string; rol?: string; exp?: number };
        } catch {
            return null;
        }
    }

    getRole(): string | null {
        const payload = this.getTokenPayload();
        return payload?.rol || null;
    }

    isAdmin(): boolean {
        return this.getRole() === 'administrador';
    }

    isOperario(): boolean {
        return this.getRole() === 'operario';
    }

    getHomeRouteByRole(): string {
        return this.isAdmin() ? '/ot' : '/historial';
    }

    isTokenExpired(): boolean {
        const payload = this.getTokenPayload();
        if (!payload || !payload.exp) return true;
        return payload.exp < Math.floor(Date.now() / 1000);
    }
}
