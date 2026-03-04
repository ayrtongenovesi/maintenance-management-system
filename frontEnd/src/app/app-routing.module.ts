import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdenTrabajoComponent } from './components/orden-trabajo/orden-trabajo.component';
import { LoginComponent } from './components/login/login.component';
import { HistorialComponent } from './components/historial/historial.component';
import { GestionComponent } from './components/gestion/gestion.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'ot',
    component: OrdenTrabajoComponent,
    canActivate: [AuthGuard],
    data: { roles: ['administrador'] }
  },
  {
    path: 'historial',
    component: HistorialComponent,
    canActivate: [AuthGuard],
    data: { roles: ['administrador', 'operario'] }
  },
  {
    path: 'gestion',
    component: GestionComponent,
    canActivate: [AuthGuard],
    data: { roles: ['administrador'] }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }