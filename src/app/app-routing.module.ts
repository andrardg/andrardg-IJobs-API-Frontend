import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { AuthGuard } from './guards/auth.guard';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { JobCreateComponent } from './pages/jobs/job-create/job-create.component';
import { JobDetailsComponent } from './pages/jobs/job-details/job-details.component';
import { JobEditComponent } from './pages/jobs/job-edit/job-edit.component';
import { JobsComponent } from './pages/jobs/jobs.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RegisterComponent } from './pages/register/register.component';
import { UsersComponent } from './pages/users/users.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [AdminAuthGuard],
  },
  {
    path: 'users',
    component : UsersComponent,
    canActivate: [AdminAuthGuard],
  },
  {
    path:'jobs',
    component: JobsComponent,
    canActivate: [AuthGuard],
  },
  {
    path:'jobs/create',
    component: JobCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path:'jobs/:id',
    component: JobDetailsComponent,
    canActivate: [AuthGuard],
  },
  {
    path:'jobs/edit/:id',
    component: JobEditComponent,
    canActivate: [AuthGuard],
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
