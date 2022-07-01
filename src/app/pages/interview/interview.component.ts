import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Application } from 'app/classes/application';
import { Company } from 'app/classes/company';
import { Interview } from 'app/classes/interview';
import { User } from 'app/classes/user';
import { ApplicationService } from 'app/services/application.service';
import { AuthService } from 'app/services/auth.service';
import { CompaniesService } from 'app/services/companies.service';
import { FileService } from 'app/services/file.service';
import { InterviewService } from 'app/services/interview.service';
import { PreviousRouteService } from 'app/services/previous-route.service';
import { UsersService } from 'app/services/users.service';

@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.scss']
})
export class InterviewComponent implements OnInit {

  @Input() id:any;
  @Input() Company:any;
  @Input() User:any;
  seeUserApplication:any;
  interviewsList : Array<Interview> = [];
  interviews : Array<Interview> = [];
  CompanyList: Array<Company> = [];
  ownerIsCompany: boolean = true;
  UserList:Array<User> = [];
  filterByCompanyId :string = '';
  selectedUser = new User();
  selectedCompany = new Company();
  filterByUserId : string = '';
  filterByJobId :string = '';
  newInterview = new Interview();
  isOnline:string = '';
  editInterview : boolean = false;
  admin:any;
  comp = sessionStorage.getItem('Company');
  user = sessionStorage.getItem('User');
  myJobs: boolean = false;
  seeApplication = new Application();
  @Input() profileIsCompany:boolean = false;

  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private service: CompaniesService,
    private authService: AuthService,
    private companyService: CompaniesService,
    private applicationsService : ApplicationService,
    private interviewsService : InterviewService,
    private previousRouteService: PreviousRouteService,
    private usersService: UsersService,
    private fileService: FileService) {
    }

  ngOnInit(): void {
    sessionStorage.removeItem('jobId');
    sessionStorage.removeItem('companyId');
    sessionStorage.removeItem('workId');
    if (sessionStorage.getItem("Admin") != null)
      this.admin = JSON.parse(sessionStorage.getItem('Admin') || "");
    //if(this.Company){
    //  this.filterByCompanyId = this.id;
    //  this.selectedCompany = this.Company;
    //}
    if(!this.Company)
      this.getAllUsers()
    this.getAllCompanies();
    this.getAllInterviews();
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
  getAllInterviews(){
    this.interviewsService.getInterviews().subscribe(data =>{
      this.interviewsList = data;
      console.log(this.interviewsList)
      if(this.comp || (this.admin && this.admin.id != this.id && this.Company)){
        this.interviewsList = this.interviewsList.filter( data => data.application?.job?.companyId == this.id);
        this.interviews = this.interviewsList;
      }
      else if(this.user || (this.admin && this.admin.id != this.id && this.User))
        {
          this.interviewsList = this.interviewsList.filter( data => data.application?.job?.userId == this.id || data.application?.userId == this.id);
          this.interviews = this.interviewsList//.filter( data => data.application?.userId == this.id);
        }
      else
        this.interviews = this.interviewsList;
      console.log(this.interviews);
      this.filter();
    });
  }
  getAllCompanies(){
    this.companyService.getCompanies().subscribe(data=>{
      this.CompanyList = data;
      this.CompanyList = this.CompanyList.sort((a,b) => a.name!.localeCompare(b.name!));
      this.Company = this.CompanyList.filter( x=> x.id == this.id)[0];
    })
  }
  filter(){
    this.interviews = this.interviewsList;
    if(this.comp)
      this.filterByCompanyId = this.id;

  if(this.ownerIsCompany == true){
    this.filterByUserId = '';
    if(this.filterByCompanyId == 'All' || this.filterByCompanyId == '')
    {
      this.interviews = this.interviews.filter( x=> x.application?.job?.companyId != null)
      this.filterByJobId = 'All';
      this.selectedCompany = new Company();
    }
  else{
    this.interviews = this.interviews.filter(x => x.application?.job?.companyId == this.filterByCompanyId);
    this.selectedCompany = this.CompanyList.filter( x=> x.id == this.filterByCompanyId)[0];
    this.selectedCompany.jobs = this.selectedCompany.jobs.sort((a,b) => a.jobTitle!.localeCompare(b.jobTitle!));
    //this.Company = this.CompanyList.filter( x=> x.id == this.filterByCompanyId)[0];
    }
  }
  else{
    this.filterByCompanyId = '';
    if(this.filterByUserId == 'All' || this.filterByUserId == '')
      {
        this.interviews = this.interviews.filter( x=> x.application?.job?.userId != null)
        this.filterByJobId = 'All';
        this.selectedUser = new User();
      }
      if(this.filterByUserId != '' && this.filterByUserId != 'All'){
        this.interviews = this.interviews.filter(x => x.application?.job?.userId== this.filterByUserId);
        this.selectedUser = this.UserList.filter( x=> x.id == this.filterByUserId)[0];
        //this.User = this.UserList.filter( x=> x.id == this.filterByUserId)[0];
        this.selectedUser.jobs = this.selectedUser.jobs!.sort((a,b) => a.jobTitle!.localeCompare(b.jobTitle!));
      }
  }
    

  if(this.filterByJobId != 'All' && this.filterByJobId != '')
    this.interviews = this.interviews.filter(x => x.application?.jobId == this.filterByJobId);
  
  if(this.myJobs == true && this.user)
    this.interviews = this.interviews.filter( x=> x.application?.job?.userId == this.id);
  else if(this.myJobs == false && this.user)
    this.interviews = this.interviews.filter( x=> x.application?.userId == this.id);
  }
  convertIsOnline(){
    if(this.isOnline == 'Online')
      this.newInterview.isOnline = true;
    else
    this.newInterview.isOnline = false;
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
    if (confirm('Are you sure you want to delete this interview?')) {
      this.interviewsService.removeInterview(interview.id).subscribe(data=>{
        console.log("Deleted sucessfully");
        alert("Deleted sucessfully");
        this.interviewsList = this.interviewsList.filter( x=> x.id != interview.id);
        this.filter();
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
  seeApplicationTrue(app:any){
    this.seeApplication.id = app.id;
    this.seeApplication.status = app.status;
  }
  seeApplicationFalse(){
    this.seeApplication.id = '';
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
        this.getAllInterviews();
      })
    }
  }
  myJobsFalse(){
    this.myJobs = false;
    this.ownerIsCompany = false;
    this.filter();
  }
  myJobsTrue(){
    this.myJobs = true;
    this.filterByCompanyId = 'All';
    this.ownerIsCompany = false;
    this.filter();
  }
}
