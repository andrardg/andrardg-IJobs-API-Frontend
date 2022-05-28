import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminCompanyGuard } from 'app/guards/admin-company.guard';
import { AuthGuard } from 'app/guards/auth.guard';
import { CompaniesComponent } from 'app/pages/companies/companies.component';
import { CompanyDetailComponent } from 'app/pages/companies/companyDetail/company-detail/company-detail.component';
import { CompanyEditComponent } from 'app/pages/companies/companyEdit/company-edit/company-edit.component';


const routes: Routes = [
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class CompanyRoutingModule { }
