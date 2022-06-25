import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { AdminCompanyGuard } from './guards/admin-company.guard';
import { AdminUserGuard } from './guards/admin-user.guard';
import { AuthGuard } from './guards/auth.guard';
import { SessionGuard } from './guards/session.guard';
import { CompaniesComponent } from './pages/companies/companies.component';
import { CompanyDetailComponent } from './pages/companies/companyDetail/company-detail/company-detail.component';
import { CompanyEditComponent } from './pages/companies/companyEdit/company-edit/company-edit.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DomainsComponent } from './pages/domains/domains.component';
import { JobCreateComponent } from './pages/jobs/job-create/job-create.component';
import { JobDetailsComponent } from './pages/jobs/job-details/job-details.component';
import { JobEditComponent } from './pages/jobs/job-edit/job-edit.component';
import { JobsComponent } from './pages/jobs/jobs.component';
import { LoginComponent } from './pages/login/login.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RegisterCompanyComponent } from './pages/register-company/register-company.component';
import { RegisterComponent } from './pages/register/register.component';
import { SearchComponent } from './pages/search/search.component';
import { SubdomainsComponent } from './pages/subdomains/subdomains.component';
import { TutorialsComponent } from './pages/tutorials/tutorials.component';
import { UserDetailComponent } from './pages/users/user-detail/user-detail.component';
import { UserEditComponent } from './pages/users/userEdit/user-edit.component';
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
    canActivate: [AuthGuard, SessionGuard],
  },
  {
    path: 'search/:search',
    component: SearchComponent,
  },
  {
    path: 'users',
    component : UsersComponent,
  },
  {
    path: 'users/:id',
    component : UserDetailComponent,
  },
  {
    path: 'users/edit/:id',
    component : UserEditComponent,
    canActivate: [AdminUserGuard, SessionGuard],
  },
  {
    path:'jobs',
    component: JobsComponent,
  },
  {
    path:'jobs/create',
    component: JobCreateComponent,
    canActivate: [AdminCompanyGuard, SessionGuard],
  },
  {
    path:'jobs/:id',
    component: JobDetailsComponent,
  },
  {
    path:'jobs/edit/:id',
    component: JobEditComponent,
    canActivate: [AdminCompanyGuard, SessionGuard],
  },
  {
    path:'registerCompany',
    component: RegisterCompanyComponent,
  },   
  {
    path: 'companies',
    component: CompaniesComponent,
  },
  {
    path: 'companies/:id',
    component: CompanyDetailComponent,
  },
  {
    path: 'companies/edit/:id',
    component: CompanyEditComponent,
    canActivate: [AdminCompanyGuard],
  },
  {
    path:'tutorials',
    component: TutorialsComponent,
  },
  {
    path:'tutorials/:domainId',
    component: TutorialsComponent,
  },
  {
    path:'tutorials/:domainId/:subdomainId',
    component: TutorialsComponent,
  },
  {
    path:'tutorials/create',
    component: TutorialsComponent,
    canActivate: [AdminCompanyGuard, SessionGuard],
  },
  {
    path:'tutorials/edit/:id',
    component: TutorialsComponent,
    canActivate: [AdminCompanyGuard, SessionGuard],
  },
  {
    path:'domains/create',
    component: DomainsComponent,
    canActivate: [AdminCompanyGuard, SessionGuard],
  },
  {
    path:'domains/edit/:id',
    component: DomainsComponent,
    canActivate: [AdminCompanyGuard, SessionGuard],
  },
  {
    path:'subdomains/create',
    component: SubdomainsComponent,
    canActivate: [AdminCompanyGuard, SessionGuard],
  },
  {
    path:'subdomains/edit/:id',
    component: SubdomainsComponent,
    canActivate: [AdminCompanyGuard, SessionGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
