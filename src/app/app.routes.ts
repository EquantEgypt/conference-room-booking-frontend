import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent, canActivate : [NoAuthGuard] },
    { path: '', component: LoginComponent, canActivate : [NoAuthGuard] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
];
