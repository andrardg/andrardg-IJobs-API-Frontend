import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpErrorsInterceptor } from './interceptors/http-errors.interceptor';
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
import { ToastrModule } from 'ngx-toastr';
import { MatSelectModule } from '@angular/material/select';


import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { UsersComponent } from './pages/users/users.component';
import { AuthService } from './services/auth.service';
import { PrivateService } from './services/private.service';
import { AuthGuard } from './guards/auth.guard';
import { NewInterceptor } from './interceptors/new.interceptor';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { JobsComponent } from './pages/jobs/jobs.component';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { JobsService } from './pages/jobs/jobs.service';
import { UsersService } from './pages/users/users.service';
import { CompaniesService } from './pages/companies/companies.service';
import { CompanyModule } from './modules/company.module';
import { CompanyRoutingModule } from './modules/company-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    ProfileComponent,
    UsersComponent,
    AdminDashboardComponent,
    JobsComponent,
    // CompanyDetailComponent,
    // CompanyEditComponent,
    // CompaniesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CompanyModule,
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
    AdminAuthGuard,
    AuthService,
    PrivateService,
    CompaniesService,
    JobsService,
    UsersService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
