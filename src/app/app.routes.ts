import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { NoAuthGuard } from './guards/no-auth.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CreateBookingComponent } from './create-booking/create-booking.component';
import { MyBookingComponent } from './my-booking/my-booking.component';
import { CancelBookingComponent } from './cancel-booking/cancel-booking.component';



export const routes: Routes = [
    { path: 'login', component: LoginComponent, canActivate : [NoAuthGuard] },
    { path: '', component: LoginComponent, canActivate : [NoAuthGuard] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'create-booking/:roomId', component: CreateBookingComponent,canActivate: [AuthGuard] },
    { path: 'my-booking', component: MyBookingComponent,canActivate: [AuthGuard] },
    { path: '**', component: PageNotFoundComponent,canActivate: [AuthGuard]},
    { path: 'cancel-booking/:reservationId', component: CancelBookingComponent ,canActivate: [AuthGuard]}
];


