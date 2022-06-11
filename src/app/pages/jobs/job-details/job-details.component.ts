import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompaniesService } from 'app/services/companies.service';
import { AuthService } from 'app/services/auth.service';
import { JobsService } from '../../../services/jobs.service';
import { PreviousRouteService } from 'app/services/previous-route.service';
import { Job } from 'app/classes/job';
import { Company } from 'app/classes/company';
import { UsersService } from 'app/services/users.service';
import { ApplicationService } from 'app/services/application.service';
import { Application } from 'app/classes/application';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss']
})
export class JobDetailsComponent implements OnInit {

  Job = new Job();
  Company = new Company();
  public id: any;
  editDeleteRights : boolean = false;
  showPrevious: boolean = false;
  alreadyApplied = false;
  user:any;

  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private service: JobsService,
    private companyService: CompaniesService,
    private userService: UsersService,
    private applicationService: ApplicationService,
    private authService: AuthService,
    private previousRouteService:PreviousRouteService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.id = params['id'];
      console.log(this.id);
    });
    if(this.previousRouteService.getPreviousUrl() != '/jobs'  && sessionStorage.getItem('companyId')!=null)
      this.showPrevious = true;
    this.getJobDetails(this.id);
    if(sessionStorage.getItem('User'))
      this.user = JSON.parse(sessionStorage.getItem('User') || "")
    if(this.user.id != ""){
      this.applicationService.getApplications().subscribe(data =>{
        for(var elem of data)
          if(elem.userId == this.user.id && elem.jobId == this.id)
            this.alreadyApplied = true;
      })
    }
  }

  getJobDetails(id:any){
    this.service.getJobDetails(id).subscribe(data=>{
      
    console.log(data);
    this.Job=data;
    this.companyService.getCompanyDetails(data.companyId).subscribe(data2 =>{
      this.Job.company = data2;
      })
    if (sessionStorage.getItem("Company") != null)
      var company = JSON.parse(sessionStorage.getItem('Company') || "")
    if(sessionStorage.getItem('Admin') || (company!=null && company.id == data.companyId))
      this.editDeleteRights = true;
    });
  }
  getCompanyDetails(id: any){
    console.log(id);
    sessionStorage.setItem('jobId', this.id);
    this.router.navigate(['/companies', id]);
  }
  removeJob(id:any){
    console.log(id);
    if (confirm('Are you sure you want to delete this account?')) {
      this.service.removeJob(id).subscribe((data)=>{
        console.log("success");
        this.logout();
      });
      this.router.navigate(['/jobs']);
    } else {
      console.log('Not deleted');
    }
  }
  editJob(id:any){
    console.log(id);
    this.router.navigate(['/jobs/edit', id]);
  }
  back(){
    sessionStorage.removeItem('jobId');
    this.router.navigate(['companies/' + sessionStorage.getItem('companyId')]);
  }
  logout() {
    this.authService.logout();
  }
  apply(){
    var app = new Application();
    this.userService.getUserDetails(this.user.id).subscribe(data => {
      console.log(data);
      app.cv=data.cv;
      if(app.cv != ""){
        app.jobId = this.id;
        app.userId = this.user.id;
        app.status = "Pending";
        //delete app.user;
        //delete app.job;
        console.log(app);
        this.applicationService.createApplication(app).subscribe(data =>{
          console.log("Created successfully");
          if (confirm('Congratulations! You have successfully applied for this job. Would you like to refreshen your knowledge for your upcoming interviews using our learning videos?')) {
            this.router.navigate(['/tutorials', this.Job.subdomain!.domainId, this.Job.subdomainId]);
          }
          this.alreadyApplied = true;
        },
        error => {
          console.log("An error occurred");
        });
      }
      else{
        alert("You must upload your CV first!");
      }
    },
    error => {
      console.log("An error occurred");
    });
  }
}
