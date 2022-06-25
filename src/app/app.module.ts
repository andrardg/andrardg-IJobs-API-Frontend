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
import { TokenInterceptor } from './interceptors/token.interceptor';
import { JobsComponent } from './pages/jobs/jobs.component';
import { AdminAuthGuard } from './guards/admin-auth.guard';
import { JobsService } from './services/jobs.service';
import { UsersService } from './services/users.service';
import { CompaniesService } from './services/companies.service';
import { JobTitlePipe } from './pages/jobs/jobtitle.pipe';
import { HoldableDirective } from './directives/holdable.directive';
import { JobDetailsComponent } from './pages/jobs/job-details/job-details.component';
import { JobEditComponent } from './pages/jobs/job-edit/job-edit.component';
import { JobCreateComponent } from './pages/jobs/job-create/job-create.component';
import { RegisterCompanyComponent } from './pages/register-company/register-company.component';
import { HeaderComponent } from './pages/header/header.component';
import { FooterComponent } from './pages/footer/footer.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UserEditComponent } from './pages/users/userEdit/user-edit.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { SearchComponent } from './pages/search/search.component';
import { UserDetailComponent } from './pages/users/user-detail/user-detail.component';
import { PreviousRouteService } from './services/previous-route.service';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { TutorialsComponent } from './pages/tutorials/tutorials.component';
import { DomainsComponent } from './pages/domains/domains.component';
import { SubdomainsComponent } from './pages/subdomains/subdomains.component';
import { DomainService } from './services/domain.service';
import { SubdomainService } from './services/subdomain.service';
import { TutorialService } from './services/tutorial.service';
import {MatDialogModule} from '@angular/material/dialog';
import { InviteComponent } from './pages/invite/invite.component';
import { InviteDetailsComponent } from './pages/invite/invite-details/invite-details.component';
import { InviteService } from './services/invite.service';
import { InterviewService } from './services/interview.service';
import { FileService } from './services/file.service';
import { Application } from './classes/application';
import { ApplicationService } from './services/application.service';
import { CompaniesComponent } from './pages/companies/companies.component';
import { CompanyEditComponent } from './pages/companies/companyEdit/company-edit/company-edit.component';
import { CompanyDetailComponent } from './pages/companies/companyDetail/company-detail/company-detail.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    ProfileComponent,
    UsersComponent,
    JobsComponent,
    JobTitlePipe,
    HoldableDirective,
    JobDetailsComponent,
    JobEditComponent,
    JobCreateComponent,
    RegisterCompanyComponent,
    CompaniesComponent,
    CompanyEditComponent,
    CompanyDetailComponent,
    HeaderComponent,
    FooterComponent,
    UserEditComponent,
    SearchComponent,
    UserDetailComponent,
    TutorialsComponent,
    DomainsComponent,
    SubdomainsComponent,
    InviteComponent,
    InviteDetailsComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CommonModule,
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
    MatIconModule,
    MatCheckboxModule,
    PdfViewerModule,
    NgxExtendedPdfViewerModule,
    MatDialogModule
    //DropDownsModule,
  ],
  providers: [
    {provide:HTTP_INTERCEPTORS,useClass : HttpErrorsInterceptor, multi:true,},
    {provide:HTTP_INTERCEPTORS,useClass : TokenInterceptor, multi:true,},
    AuthGuard,
    AdminAuthGuard,
    ApplicationService,
    AuthService,
    CompaniesService,
    DomainService,
    FileService,
    InterviewService,
    InviteService,
    JobsService,
    PreviousRouteService,
    PrivateService,
    SubdomainService,
    TutorialService,
    UsersService,
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
