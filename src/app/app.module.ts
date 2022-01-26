import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ProfileComponent } from './pages/profile/profile.component';
import { HttpErrorsInterceptor } from './interceptors/http-errors.interceptor';
import { UsersComponent } from './pages/users/users.component';
import { CompaniesComponent } from './pages/companies/companies.component';
import { MatTableModule } from '@angular/material/table' 
import { MatCardModule } from '@angular/material/card'; 
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button'; 
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from './services/auth.service';
import { PrivateService } from './services/private.service';
import { AuthGuard } from './services/auth.guard';
import { NewInterceptor } from './interceptors/new.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { CompanyDetailComponent } from './pages/companies/companyDetail/company-detail/company-detail.component';
import { CompanyEditComponent } from './pages/companies/companyEdit/company-edit/company-edit.component';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    ProfileComponent,
    UsersComponent,
    CompaniesComponent,
    CompanyDetailComponent,
    CompanyEditComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatInputModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatMenuModule,
    ToastrModule.forRoot(),
    MatSelectModule,
  ],
  providers: [
    {provide:HTTP_INTERCEPTORS,useClass : HttpErrorsInterceptor, multi:true,},
    {provide:HTTP_INTERCEPTORS,useClass : NewInterceptor, multi:true,},
    AuthGuard,
    AuthService,
    PrivateService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
