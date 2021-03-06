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
import { InviteService } from 'app/services/invite.service';

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
  showPrevious: any = false;
  alreadyApplied: boolean = true;
  canReapply: boolean = false;
  currentApp : any;
  user:any;

  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private service: JobsService,
    private companyService: CompaniesService,
    private userService: UsersService,
    private applicationService: ApplicationService,
    private authService: AuthService,
    private previousRouteService:PreviousRouteService,
    private inviteService: InviteService) {
    sessionStorage.removeItem('jobId');}

  ngOnInit(): void {    

    this.activatedRoute.params.subscribe((params: any) => {
      this.id = params['id'];
      console.log(this.id);
    });
    sessionStorage.removeItem('workId');
    if(sessionStorage.getItem('companyId'))
      this.showPrevious = sessionStorage.getItem('companyId');
    if(sessionStorage.getItem('User'))
      {
        this.user = JSON.parse(sessionStorage.getItem('User') || "")
        this.userService.getUserDetails(this.user.id).subscribe(data => {
          this.user = data;
          var ok = 1;
          this.user.applications.forEach((element: { jobId: any; cv: any; }) => {
            if(element.jobId == this.id){
              this.currentApp = element;
              if(element.cv != this.user.cv)
                this.canReapply = true;
                ok = 0;
            }
          });
          if(ok == 1)
            this.alreadyApplied = false;
        });
    }
    
    this.getJobDetails(this.id);
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
    if (confirm('Are you sure you want to delete this job post? All the interviews, invitations and applications will be deleted.')) {
      this.service.removeJob(id).subscribe((data)=>{
        console.log("success");
        this.router.navigate(['/jobs']);
      });
    } else {
      console.log('Not deleted');
    }
  }
  editJob(id:any){
    console.log(id);
    this.router.navigate(['/jobs/edit', id]);
  }
  back(){
    //sessionStorage.removeItem('jobId');
    this.router.navigate(['companies/' + this.showPrevious]);
  }
  logout() {
    this.authService.logout();
  }
  apply(){
    var app = new Application();
    app.cv=this.user.cv;
    if(app.cv != "" && app.cv!=null){
      app.jobId = this.id;
      app.userId = this.user.id;
      app.status = "Pending";
      //delete app.user;
      delete app.interviews;
      console.log(app);
      this.applicationService.createApplication(app).subscribe(data =>{
        console.log("Created successfully");
        this.inviteService.getInvites().subscribe(data=>{
          data = data.filter((x: { userId: string; jobId: string; })=> x.userId == app.userId && x.jobId == app.jobId);
          if(data)
            this.inviteService.removeInvite(data[0].id).subscribe(data =>{
              console.log("Invite deleted successfully");
              alert("Invite accepted successfully");
            })
        })
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
  }
  reapply(){
    console.log(this.currentApp);
    delete this.currentApp.interviews;
    delete this.currentApp.job;
    delete this.currentApp.user;
    this.currentApp.cv = this.user.cv;
    this.currentApp.status = 'Pending';
    this.applicationService.saveApplication(this.currentApp).subscribe(data =>{
      console.log("Created successfully");
      console.log(this.currentApp);
      if (confirm('Congratulations! You have successfully reapplied for this job. Would you like to refreshen your knowledge for your upcoming interviews using our learning videos?')) {
        this.router.navigate(['/tutorials', this.Job.subdomain!.domainId, this.Job.subdomainId]);
      }
      this.canReapply = false;
    })
  }
}
