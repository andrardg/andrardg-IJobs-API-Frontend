import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompaniesComponent } from '../pages/companies/companies.component';
import { CompanyDetailComponent } from '../pages/companies/companyDetail/company-detail/company-detail.component';
import { CompanyEditComponent } from '../pages/companies/companyEdit/company-edit/company-edit.component';
import { SharedModule } from './shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompanyRoutingModule } from './company-routing.module';

@NgModule({
  declarations: [
    CompaniesComponent,
    CompanyEditComponent,
    CompanyDetailComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    CompanyRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class CompanyModule { }