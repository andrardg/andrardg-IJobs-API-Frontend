import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Application } from 'app/classes/application';
import { Company } from 'app/classes/company';
import { Interview } from 'app/classes/interview';
import { ApplicationService } from 'app/services/application.service';
import { AuthService } from 'app/services/auth.service';
import { CompaniesService } from 'app/services/companies.service';
import { FileService } from 'app/services/file.service';
import { InterviewService } from 'app/services/interview.service';
import { PreviousRouteService } from 'app/services/previous-route.service';

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
  filterByCompanyId :string = '';
  selectedCompany = new Company();
  filterByJobId :string = '';
  newInterview = new Interview();
  isOnline:string = '';
  editInterview : boolean = false;
  admin:any;
  comp = sessionStorage.getItem('Company');
  user = sessionStorage.getItem('User');
  seeInterviewsOwned: boolean = true;
  seeApplication = new Application();

  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private service: CompaniesService,
    private authService: AuthService,
    private companyService: CompaniesService,
    private applicationsService : ApplicationService,
    private interviewsService : InterviewService,
    private previousRouteService: PreviousRouteService,
    private sanitizer: DomSanitizer,
    private fileService: FileService) {
    }

  ngOnInit(): void {
    sessionStorage.removeItem('jobId');
    sessionStorage.removeItem('companyId');
    if (sessionStorage.getItem("Admin") != null)
      this.admin = JSON.parse(sessionStorage.getItem('Admin') || "");
    if(this.Company)
      this.selectedCompany = this.Company;
    this.getAllInterviews();
  }
  getAllInterviews(){
    this.interviewsService.getInterviews().subscribe(data =>{
      this.interviewsList = data;
      if(this.comp || (this.admin && this.admin.id != this.id)){
        this.interviewsList = this.interviewsList.filter( data => data.application?.job?.companyId == this.id);
        this.interviews = this.interviewsList;
      }
      else if(this.user || (this.admin && this.admin.id != this.id))
        {
          this.interviewsList = this.interviewsList.filter( data => data.application?.job?.userId == this.id || data.application?.userId == this.id);
          if(this.seeInterviewsOwned == true)
            this.interviews = this.interviewsList.filter( data => data.application?.job?.userId == this.id);
          else
            this.interviews = this.interviewsList.filter( data => data.application?.userId == this.id);
        }
      else
        this.interviews = this.interviewsList;
      console.log(this.interviews);
      this.filterByJobId = '';
    });
  }
  getAllCompanies(){
    this.companyService.getCompanies().subscribe(data=>{
      this.CompanyList = data;
    })
  }
  getInterviewsForCompany(){
    if(this.filterByCompanyId == 'All')
      this.interviews = this.interviewsList;
    else if(this.filterByCompanyId != ''){
      this.interviews = this.interviewsList.filter(x => x.application?.job?.companyId == this.filterByCompanyId);
      this.selectedCompany = this.CompanyList.filter( x=> x.id == this.filterByCompanyId)[0];
    }
  }
  getInterviewsForJob(){
    if(this.filterByJobId == 'All')
      this.interviews = this.interviewsList;
    else if(this.filterByJobId != '')
      this.interviews = this.interviewsList.filter(x => x.application?.jobId == this.filterByJobId);
  }
  convertIsOnline(){
    if(this.isOnline == 'Online')
      this.newInterview.isOnline = true;
    else
    this.newInterview.isOnline = false;
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
    if (confirm('Are you sure you want to delete this interview?')) {
      this.interviewsService.removeInterview(interview.id).subscribe(data=>{
        console.log("Deleted sucessfully");
        alert("Deleted sucessfully");
        this.interviewsList = this.interviewsList.filter( x=> x.id != interview.id);
        this.getInterviewsForCompany();
        this.getInterviewsForJob();
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
  seeApplicationTrue(app:any){
    this.seeApplication.id = app.id;
    this.seeApplication.status = app.status;
  }
  seeApplicationFalse(){
    this.seeApplication.id = '';
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
}
