import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Application } from 'app/classes/application';
import { Company } from 'app/classes/company';
import { Domain } from 'app/classes/domain';
import { Interview } from 'app/classes/interview';
import { Subdomain } from 'app/classes/subdomain';
import { ApplicationService } from 'app/services/application.service';
import { AuthService } from 'app/services/auth.service';
import { CompaniesService } from 'app/services/companies.service';
import { DomainService } from 'app/services/domain.service';
import { FileService } from 'app/services/file.service';
import { InterviewService } from 'app/services/interview.service';
import { PreviousRouteService } from 'app/services/previous-route.service';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit {

  @Input() id:any;
  @Input() Company:any;
  @Input() User:any;
  ApplicationList:Array<Application> = [];
  applications:Array<Application> = [];
  CompanyList: Array<Company> = [];
  filterByCompanyId : string = '';
  selectedCompany = new Company();
  filterByJobId :string = '';
  schedule = new Application();
  seeRejected: boolean = false;
  interviewsList : Array<Interview> = [];
  interviews : Array<Interview> = [];
  seeApplication = new Application();
  newInterview = new Interview();
  seeInterview  = new Interview();
  admin:any;
  comp = sessionStorage.getItem('Company');
  user = sessionStorage.getItem('User');
  seeUserApplication: boolean = false;
  editInterview : boolean = false;
  isOnline:string = '';  
  DomainList:Array<Domain> = [];
  domainFilter:any = 'All';
  SubdomainList:Array<Subdomain> = [];
  subdomainFilter : any = 'All';

  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private service: CompaniesService,
    private authService: AuthService,
    private applicationsService : ApplicationService,
    private companyService: CompaniesService,
    private interviewsService : InterviewService,
    private domainService: DomainService,
    private sanitizer: DomSanitizer,
    private fileService: FileService) {
    }

  ngOnInit(): void {
    sessionStorage.removeItem('jobId');
    sessionStorage.removeItem('companyId');
    if (sessionStorage.getItem("Admin") != null)
      {
        this.admin = JSON.parse(sessionStorage.getItem('Admin') || "");
        if(this.admin.id == this.id)
          this.getAllCompanies();
      }
    if(this.Company)
      this.selectedCompany = this.Company;
    this.getAllApplications();
    this.getAllInterviews();
    this.getDomains();

  }
  getAllApplications(){
    this.applicationsService.getApplications().subscribe(data =>{
      this.ApplicationList = data;
      if(this.comp || (this.admin && this.admin.id != this.id))
        this.ApplicationList = this.ApplicationList.filter( data => data.job?.companyId == this.id);
      else if((this.user && this.seeUserApplication == true) || (this.admin && this.admin.id != this.id))
        this.ApplicationList = this.ApplicationList.filter( data => data.job?.userId == this.id);
      else if((this.user && this.seeUserApplication == false) || (this.admin && this.admin.id != this.id))
        this.ApplicationList = this.ApplicationList.filter( data => data.userId == this.id);
      this.applications = this.ApplicationList.filter(x=> x.status != 'Rejected');
      console.log(this.ApplicationList)
    });
  }
  getAllCompanies(){
    this.companyService.getCompanies().subscribe(data=>{
      this.CompanyList = data;
    })
  }
  filter(){
    console.log(this.filterByCompanyId, this.filterByJobId, this.domainFilter, this.subdomainFilter, this.seeRejected)
    this.applications = this.ApplicationList;
    if(this.filterByCompanyId == 'All' || this.filterByCompanyId == '')
      {
        this.filterByJobId = 'All';
        this.selectedCompany = new Company();
      }
    if(this.filterByCompanyId != '' && this.filterByCompanyId != 'All'){
      this.applications = this.applications.filter(x => x.job?.companyId == this.filterByCompanyId);
      this.selectedCompany = this.CompanyList.filter( x=> x.id == this.filterByCompanyId)[0];
    }

    if(this.filterByJobId != '' && this.filterByJobId != 'All')
      this.applications = this.applications.filter(x => x.jobId == this.filterByJobId);

      
    if(this.seeRejected == true)
      this.applications = this.applications.filter( x => x.status == 'Rejected');
    else
      this.applications = this.applications.filter( x => x.status != 'Rejected');
    if(this.domainFilter == 'All' || this.domainFilter == '')
      this.subdomainFilter = 'All'
    if(this.domainFilter != 'All' && this.domainFilter != ''){
      this.SubdomainList = this.DomainList.filter(x => x.id == this.domainFilter)[0].subdomains!;
      if(this.subdomainFilter != 'All' && this.subdomainFilter != '')
        this.applications = this.applications.filter( x=> x.job!.subdomainId == this.subdomainFilter);
      else
        this.applications  = this.applications.filter( x=> x.job!.subdomain!.domainId == this.domainFilter);
    }

  }
  getApplicationsForCompany(){
    if(this.filterByCompanyId == 'All')
      this.applications = this.ApplicationList;
    else if(this.filterByCompanyId != ''){
      this.applications = this.ApplicationList.filter(x => x.job?.companyId == this.filterByCompanyId);
      this.selectedCompany = this.CompanyList.filter( x=> x.id == this.filterByCompanyId)[0];
    }
  }
  getApplicationsForJob(){
    console.log(this.filterByJobId);
    this.schedule.id = '';
    if(this.filterByJobId == 'All')
      this.applications = this.ApplicationList;
    else if(this.filterByJobId != '')
      this.applications = this.ApplicationList.filter(x => x.jobId == this.filterByJobId);
    if(this.seeRejected == true)
      this.applications = this.applications.filter( x => x.status == 'Rejected');
    else
      this.applications = this.applications.filter( x => x.status != 'Rejected');
    console.log(this.applications);
  }

  getInterviewsForApplication(id:any){
    this.interviews = this.interviewsList.filter( x=> x.applicationId == id)
    console.log(this.interviews);
  }
  createInterview(app:any){
    this.newInterview.applicationId = app.id;
    if(!this.admin)
      this.newInterview.responseCompany = true;
    else
      this.newInterview.responseCompany = false;

    let yearDifference = new Date(this.newInterview.date).getFullYear() - new Date().getFullYear()
    let monthDifference = new Date(this.newInterview.date).getMonth() - new Date().getMonth()
    let dayDifference = new Date(this.newInterview.date).getDate() - new Date().getDate()
    let timeDifference = new Date(this.newInterview.date).getTime() - new Date().getTime()
    console.log(dayDifference, timeDifference)
    if(yearDifference>0 || (yearDifference == 0 && (monthDifference > 0 || (monthDifference ==0 && (dayDifference >0 || (dayDifference ==0 && timeDifference /1000 / 60 / 60 > 1))))))
      {this.newInterview.responseUser = false;
      this.interviewsService.createInterview(this.newInterview).subscribe(data=>{
        app.interviews.push(this.newInterview);
        console.log("Created successfully");
        alert("Created sucessfully");
        if(app.status == 'Pending')
          {
            app.status = 'Interview stage';
            console.log(app);
            this.saveApplication(app);
        }
        this.seeInterview.applicationId = '';
        this.getAllInterviews();
        this.schedule.id = '';
        this.newInterview = new Interview();
      },
      error =>{
        console.log(error);
      });
    }
    else
      alert("The interview has to be at least one hour later than now.");
  }
  getAllInterviews(){
    this.interviewsService.getInterviews().subscribe(data =>{
      this.interviewsList = data;
      if(this.comp)
        this.interviewsList = this.interviewsList.filter( data => data.application?.job?.companyId == this.id);
      else if(this.user && this.seeUserApplication == true)
      this.interviewsList = this.interviewsList.filter( data => data.application?.job?.userId == this.id);
      else if(this.user && this.seeUserApplication == false)
        this.interviewsList = this.interviewsList.filter( data => data.application?.userId == this.id);
        
      this.interviews = this.interviewsList;
      if(this.newInterview.applicationId != ''){
        this.interviews = this.interviews.filter(x => x.applicationId == this.newInterview.applicationId);
      }
      console.log(this.interviews);
      this.filterByJobId = '';
    });
  }
  scheduleTrue(row:any){
    this.schedule.id = row.id;
    this.seeApplication.id = '';
    this.newInterview.date = new Date();
  }
  scheduleFalse(){
    this.schedule.id = '';
    this.newInterview = new Interview();
  }
  saveApplication(app:any){
    delete app.interviews;
    delete app.job;
    delete app.user;
    var keepGoing = true;
    app.status = this.seeApplication.status;
    if(app.status == 'Rejected')
      if(!confirm('Are you sure you want to mark the application as rejected? All the interviews will be deleted.')){
        keepGoing = false;
        alert("The process has been stopped");
      }
    if(keepGoing == true){
      this.applicationsService.saveApplication(app).subscribe(data =>{
        console.log('Application status updated successfully');
        alert('Application status updated successfully');
        this.seeApplication.id = '';
      this.getAllApplications();
      },
      error =>{
        console.log(error);
      })
    }
  }
  seeApplicationTrue(app:any){
    this.scheduleFalse();
    this.seeApplication.id = JSON.parse(JSON.stringify( app.id));
    this.seeApplication.status = app.status;
  }
  seeApplicationFalse(app?:any){
    this.seeApplication.id = '';
  }
  convertIsOnline(){
    if(this.isOnline == 'Online')
      this.newInterview.isOnline = true;
    else
    this.newInterview.isOnline = false;
  }
  
  seeInterviewTrue(app:any){
    this.seeInterview.applicationId = app.id;
    this.getInterviewsForApplication(app.id);
  }
  seeInterviewFalse(){
    this.seeInterview.applicationId = '';
  }
  editInterviewTrue(intv:any){
    this.editInterview = true;
    this.newInterview = intv;
    if(intv.isOnline == true)
      this.isOnline = 'Online';
    else
      this.isOnline = 'In person';
  }
  editInterviewFalse(){
    this.editInterview = false;
  }
  saveInterview(){
    delete this.newInterview.application;
    if(!this.admin)
      this.newInterview.responseCompany = true;
    else
      this.newInterview.responseCompany = false;
    this.newInterview.responseUser = false;
    console.log(this.newInterview);
    this.interviewsService.saveInterview(this.newInterview).subscribe(data=>{
      console.log("Updated sucessfully");
      alert("Updated sucessfully");
      this.newInterview = new Interview();
      this.getAllInterviews();
      this.editInterviewFalse();
    })
  }
  deleteInterview(interview:any){
    console.log(interview)
    if (confirm('Are you sure you want to delete this interview?')) {
      this.interviewsService.removeInterview(interview.id).subscribe(data=>{
        this.getAllApplications();
        this.seeInterviewFalse();
        console.log("Deleted sucessfully");
        alert("Deleted sucessfully");
        this.interviewsList = this.interviewsList.filter( x=> x.id != interview.id);
      })
    }
    else
      console.log("Delete process cancelled");
  }
  confirm(interview:any){
    this.newInterview = interview;
    this.newInterview.responseCompany = true;
    delete this.newInterview.application;
    this.interviewsService.saveInterview(this.newInterview).subscribe(data=>{
      console.log("Updated sucessfully");
      alert("Updated sucessfully");
      this.newInterview = new Interview();
      this.getAllInterviews();
      this.editInterviewFalse();
    })
  }
  getCV(application: any){
    this.fileService.getPdf(application.cv);
  }
  downloadCV(application: any){
    this.fileService.downloadPdf(application.cv, application.user.firstName + '-' + application.user.lastName + '-' + 'CV')
  }
  toggleSeeRejected(event:any){
    if(this.seeRejected == false && event.pointerId == 1)
      {
        this.seeRejected = true;
        this.applications = this.ApplicationList.filter( x => x.status == 'Rejected');
        if(this.filterByCompanyId != '' && this.filterByCompanyId != 'All')
          this.applications = this.applications.filter( x => x.job?.companyId == this.filterByCompanyId);
        if(this.filterByJobId != '' && this.filterByJobId != 'All')
          this.applications = this.applications.filter( x => x.jobId == this.filterByJobId);
      }
    else if(event.pointerId == 1)
    {
      this.seeRejected = false;
      this.applications = this.ApplicationList.filter( x => x.status != 'Rejected');
      if(this.filterByCompanyId != '' && this.filterByCompanyId != 'All')
        this.applications = this.applications.filter( x => x.job?.companyId == this.filterByCompanyId);
      if(this.filterByJobId != '' && this.filterByJobId != 'All')
        this.applications = this.applications.filter( x => x.jobId == this.filterByJobId);
    }
  }
  getUserDetails(id: any){
    console.log(id);
    this.router.navigate(['/users', id]);
  }  
  getJobDetails(id: any){
    console.log(id);
    this.router.navigate(['/jobs', id]);
  }
  getSafeUrl(file:string){
    return this.fileService.getSafeUrl(file);
  }
  rejectInterview(interview:any){
    if (confirm('By confirming, all of your interview for this job will be deleted and your application will be marked as rejected. Are you sure?')) {
      var app = interview.application;
      app.status = 'Rejected';
      this.interviews = this.interviewsList;
      delete app.job;
      delete app.user;
      this.applicationsService.saveApplication(app).subscribe(data =>{
        alert("Application marked as rejected");
        console.log("Application marked as rejected");
      })
    }
  }
  
getDomains(){
  this.domainService.getDomains().subscribe(data=>{
    this.DomainList = data;
    console.log(data);
    this.DomainList = this.DomainList.filter( x => x.subdomains!.length > 0);
    console.log(this.DomainList);
  },
  error =>{
    console.log(error);
  });
}
getSubdomains(){
  if(this.domainFilter != 'All')
    this.SubdomainList = this.DomainList.filter(x => x.id == this.domainFilter)[0].subdomains!;
  //console.log(this.SubdomainList);
  //console.log(this.domainFilter);
}
doneFilter(){
  console.log(this.domainFilter, this.subdomainFilter);

  this.applications = this.ApplicationList;
  if(this.domainFilter != 'All'){
    if(this.subdomainFilter != 'All')
      this.applications = this.applications.filter( x=> x.job!.subdomainId == this.subdomainFilter);
    else
      {console.log("here");this.applications  = this.applications.filter( x=> x.job!.subdomain!.domainId == this.domainFilter);}
  }
  if(this.seeRejected == false)
    this.applications = this.applications.filter( x => x.status != 'Rejected');
  else
  this.applications = this.applications.filter( x => x.status == 'Rejected');
}
}
