import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Application } from 'app/classes/application';
import { Company } from 'app/classes/company';
import { Domain } from 'app/classes/domain';
import { Interview } from 'app/classes/interview';
import { Subdomain } from 'app/classes/subdomain';
import { User } from 'app/classes/user';
import { ApplicationService } from 'app/services/application.service';
import { AuthService } from 'app/services/auth.service';
import { CompaniesService } from 'app/services/companies.service';
import { DomainService } from 'app/services/domain.service';
import { FileService } from 'app/services/file.service';
import { InterviewService } from 'app/services/interview.service';
import { UsersService } from 'app/services/users.service';

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
  filterByUserId : string = '';
  selectedUser = new User();
  UserList:Array<User> = [];
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
  myJobs: boolean = false;
  ownerIsCompany: boolean = true;

  constructor(
    private router:Router,
    private service: CompaniesService,
    private usersService: UsersService,
    private applicationsService : ApplicationService,
    private companyService: CompaniesService,
    private interviewsService : InterviewService,
    private domainService: DomainService,
    private fileService: FileService) {
    }

  ngOnInit(): void {
    sessionStorage.removeItem('jobId');
    sessionStorage.removeItem('companyId');
    sessionStorage.removeItem('workId');
    if (sessionStorage.getItem("Admin") != null)
      this.admin = JSON.parse(sessionStorage.getItem('Admin') || "");

    this.getAllApplications();
    this.getAllInterviews();
    this.getAllCompanies();
    if(!this.comp){
      this.getAllUsers();
    }
    else
      this.getCompany(this.id);
    this.getDomains();
  }
  getAllApplications(){
    this.applicationsService.getApplications().subscribe(data =>{
      this.ApplicationList = data;
      if(this.comp || (this.admin && this.admin.id != this.id))
        this.ApplicationList = this.ApplicationList.filter( data => data.job?.companyId == this.id);
      
      else if((this.user || this.User) && !this.admin)
        this.ApplicationList = this.ApplicationList.filter( data => data.job?.userId == this.id || data.userId == this.id);
      this.filter();
      console.log(this.applications)
    });
  }
  getAllCompanies(){
    this.companyService.getCompanies().subscribe(data=>{
      this.CompanyList = data;
      this.CompanyList = this.CompanyList.sort((a,b) => a.name!.localeCompare(b.name!));
      this.Company = this.CompanyList.filter( x=> x.id == this.id)[0];
    })
  }
  getCompany(id:any){
    this.service.getCompanyDetails(id).subscribe(data=>{
      this.Company=data;
      console.log(this.Company);
    });
  }
  getAllUsers(){
    this.usersService.getUsers().subscribe(data=>{
      this.UserList = data;
      this.UserList = this.UserList.sort((a,b) => a.firstName!.localeCompare(b.firstName!));
    })
  }
  filter(){
    if(this.comp)
      this.filterByCompanyId = this.id;
    console.log(this.filterByCompanyId, this.filterByUserId, this.filterByJobId, this.domainFilter, this.subdomainFilter, this.seeRejected)

    this.applications = this.ApplicationList;
    console.log(this.applications)
    if(this.ownerIsCompany == true){
      this.filterByUserId = '';
      if(this.filterByCompanyId == 'All' || this.filterByCompanyId == '')
      {
        this.applications = this.applications.filter(x => x.job?.companyId != null)
        this.filterByJobId = 'All';
        this.selectedCompany = new Company();
      }
      if(this.filterByCompanyId != '' && this.filterByCompanyId != 'All'){
        this.applications = this.applications.filter(x => x.job?.companyId == this.filterByCompanyId);
        this.selectedCompany = this.CompanyList.filter( x=> x.id == this.filterByCompanyId)[0];
        this.Company = this.CompanyList.filter( x=> x.id == this.filterByCompanyId)[0];
        this.selectedCompany.jobs = this.selectedCompany.jobs.sort((a,b) => a.jobTitle!.localeCompare(b.jobTitle!));
      }
    }
    else{
      this.filterByCompanyId = '';
      if(this.filterByUserId == 'All' || this.filterByUserId == '')
      {
        this.applications = this.applications.filter(x => x.job?.userId != null)
        this.filterByJobId = 'All';
        this.selectedUser = new User();
      }
      if(this.filterByUserId != '' && this.filterByUserId != 'All'){
        this.applications = this.applications.filter(x => x.job?.userId == this.filterByUserId);
        this.selectedUser = this.UserList.filter( x=> x.id == this.filterByUserId)[0];
        this.User = this.UserList.filter( x=> x.id == this.filterByUserId)[0];
        this.selectedUser.jobs = this.selectedUser.jobs!.sort((a,b) => a.jobTitle!.localeCompare(b.jobTitle!));
      }
    }


    if(this.filterByJobId != '' && this.filterByJobId != 'All')
      this.applications = this.applications.filter(x => x.jobId == this.filterByJobId);

    if(this.myJobs == true && (this.user || this.User) && !this.admin)
      this.applications = this.applications.filter( x=> x.job?.userId == this.id);
    else if(this.myJobs == false && (this.user || this.User) && !this.admin)
      this.applications = this.applications.filter( x=> x.userId == this.id);
      
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
      else if(this.user)
        this.interviewsList = this.interviewsList.filter( data => data.application?.job?.userId == this.id || data.application?.userId == this.id);
        
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
      if(app.status == 'Pending' && this.schedule.id != '')
        app.status = 'Interview stage';
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
    console.log(app.id);
    this.seeInterview.applicationId = app.id;
    this.getInterviewsForApplication(app.id);
  }
  seeInterviewFalse(){
    this.seeInterview.applicationId = '';
  }
  editInterviewTrue(intv:any){
    this.editInterview = true;
    this.newInterview = JSON.parse(JSON.stringify(intv));
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
    if(this.comp)
      this.newInterview.responseCompany = true;
    else
      this.newInterview.responseCompany = false;
    if(this.user)
      this.newInterview.responseUser = true;
    else
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
    if(this.comp)
      this.newInterview.responseCompany = true;
    else if(this.user)
      this.newInterview.responseUser = true;
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
        this.seeRejected = true;
    else if(event.pointerId == 1)
      this.seeRejected = false;
    this.filter();
  }
  getUserDetails(id: any){
    console.log(id);
    this.router.navigate(['/users', id]);
  }  
  getCompanyDetails(id: any){
    console.log(id);
    this.router.navigate(['/companies', id]);
  }  
  getJobDetails(row: any){
    if(row.job.workType == false)
      this.router.navigate(['/jobs', row.job.id]);
    else if(row.job.workType == true)
      this.router.navigate(['/work', row.job.id]);
  }
  getSafeUrl(file:string){
    return this.fileService.getSafeUrl(file);
  }
  rejectInterview(interview:any){
    if (confirm('By confirming, all of your interviews for this job will be deleted and your application will be marked as rejected. Are you sure?')) {
      var app = interview.application;
      app.status = 'Rejected';
      this.interviews = this.interviewsList;
      delete app.job;
      delete app.user;
      this.applicationsService.saveApplication(app).subscribe(data =>{
        alert("Application marked as rejected");
        console.log("Application marked as rejected");
        this.getAllApplications();
        this.getAllInterviews();
      })
    }
  }
  
getDomains(){
  this.domainService.getDomains().subscribe(data=>{
    this.DomainList = data;
    this.DomainList = this.DomainList.filter( x => x.subdomains!.length > 0);
    this.DomainList = this.DomainList.sort((a,b) => a.name!.localeCompare(b.name!));
  },
  error =>{
    console.log(error);
  });
}
getSubdomains(){
  if(this.domainFilter != 'All'){
    this.SubdomainList = this.DomainList.filter(x => x.id == this.domainFilter)[0].subdomains!;
    this.SubdomainList = this.SubdomainList.sort((a,b) => a.name!.localeCompare(b.name!));
    
  }
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
deleteApplication(app:any){
  if (confirm('Are you sure you want to delete this application?')) {
    this.applicationsService.removeApplication(app.id).subscribe(data=>{
      console.log("Deleted successfully");
      alert("Deleted successfully");
      this.ApplicationList.splice(app,1);
      this.applications.splice(app,1);
    },error=>{
      console.log(error);
    })
  }
}
myJobsFalse(){
  this.myJobs = false;
  this.ownerIsCompany = true;
  this.filterByUserId = '';
  this.filterByJobId = ''
  this.filterByCompanyId = '';
  this.filter();
}
myJobsTrue(){
  this.myJobs = true;
  this.ownerIsCompany = false;
  this.filterByUserId = this.id;
  this.filterByCompanyId = 'All';
  this.filter();
}
}
