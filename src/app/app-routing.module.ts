import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { AuthGuard } from './guards/auth.guard';
import { Child1Component } from './pages/communication/child1/child1.component';
import { Child2Component } from './pages/communication/child2/child2.component';
import { Parent1Component } from './pages/communication/parent1/parent1.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { JobCreateComponent } from './pages/jobs/job-create/job-create.component';
import { JobDetailsComponent } from './pages/jobs/job-details/job-details.component';
import { JobEditComponent } from './pages/jobs/job-edit/job-edit.component';
import { JobsComponent } from './pages/jobs/jobs.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RegisterCompanyComponent } from './pages/register-company/register-company.component';
import { RegisterComponent } from './pages/register/register.component';
import { UsersComponent } from './pages/users/users.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
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
    component: DashboardComponent
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'users',
    component : UsersComponent,
  },
  {
    path:'jobs',
    component: JobsComponent,
  },
  {
    path:'jobs/create',
    component: JobCreateComponent,
    canActivate: [AuthGuard],
  },
  {
    path:'jobs/:id',
    component: JobDetailsComponent,
  },
  {
    path:'jobs/edit/:id',
    component: JobEditComponent,
    canActivate: [AuthGuard],
  },
  {
    path:'registerCompany',
    component: RegisterCompanyComponent,
  },
  {
    path:'parent1',
    component: Parent1Component,
  },
  {
    path:'child1',
    component: Child1Component,
  },
  {
    path:'child2',
    component: Child2Component,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
