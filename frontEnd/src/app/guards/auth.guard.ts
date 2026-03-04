import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(private userService: UserService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        if (!this.userService.isLoggedIn()) {
            this.userService.logout();
            this.router.navigate(['/login']);
            return false;
        }

        const allowedRoles = route.data['roles'] as string[];
        if (allowedRoles && allowedRoles.length > 0) {
            const currentRole = this.userService.getRole();
            if (!currentRole || !allowedRoles.includes(currentRole)) {
                this.router.navigate([this.userService.getHomeRouteByRole()]);
                return false;
            }
        }

        return true;
    }
}
