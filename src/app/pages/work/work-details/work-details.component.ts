import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Application } from 'app/classes/application';
import { Company } from 'app/classes/company';
import { Job } from 'app/classes/job';
import { ApplicationService } from 'app/services/application.service';
import { AuthService } from 'app/services/auth.service';
import { CompaniesService } from 'app/services/companies.service';
import { InterviewService } from 'app/services/interview.service';
import { InviteService } from 'app/services/invite.service';
import { JobsService } from 'app/services/jobs.service';
import { PreviousRouteService } from 'app/services/previous-route.service';
import { UsersService } from 'app/services/users.service';

@Component({
  selector: 'app-work-details',
  templateUrl: './work-details.component.html',
  styleUrls: ['./work-details.component.scss']
})
export class WorkDetailsComponent implements OnInit {
  Job = new Job();
  Company = new Company();
  public id: any;
  editDeleteRights : boolean = false;
  showPrevious: boolean = false;
  alreadyApplied: boolean = false;
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
    private inviteService: InviteService,
    private applicationsService: ApplicationService,
    private interviewService: InterviewService) { 
      sessionStorage.removeItem('jobId');
    }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.id = params['id'];
      console.log(this.id);
    });
    if(sessionStorage.getItem('companyId')!=null || sessionStorage.getItem('userId')!=null)
      this.showPrevious = true;
    
    this.service.getJobDetails(this.id).subscribe(data=>{
        console.log(data);
        this.Job=data;
        if (sessionStorage.getItem("Company") != null)
          var company = JSON.parse(sessionStorage.getItem('Company') || "")
        if(sessionStorage.getItem('User'))
          this.user = JSON.parse(sessionStorage.getItem('User') || "")
        if(sessionStorage.getItem('Admin') || (company!=null && company.id == data.companyId) || (this.user!=null && this.user.id == data.userId))
          this.editDeleteRights = true;

        if(this.user.id != this.Job.userId){
          this.userService.getUserDetails(this.user.id).subscribe(data => {
            this.user = data;
            this.applicationService.getApplications().subscribe(data =>{
            for(var elem of data)
              {
              if(elem.userId == this.user.id && elem.jobId == this.id)
                {
                  this.alreadyApplied = true;
                  this.currentApp = elem;
                }
              if(elem.userId == this.user.id && elem.jobId == this.id &&  elem.cv != this.user.cv)
                this.canReapply = true;
              }
            })
          });
        }
        else
        this.alreadyApplied = true;
        });

  }
  getCompanyDetails(id: any){
    console.log(id);
    sessionStorage.setItem('workId', this.id);
    this.router.navigate(['/companies', id]);
  }
  getUserDetails(id: any){
    console.log(id);
    sessionStorage.setItem('workId', this.id);
    this.router.navigate(['/users', id]);
  }
  removeJob(id:any){
    console.log(id);
    if (confirm('Are you sure you want to delete this work ad? All the interviews, invitations and applications will be deleted.')) {
      this.service.removeJob(id).subscribe((data)=>{
        console.log("success");
        this.router.navigate(['/work']);
        
      });
    } else {
      console.log('Not deleted');
    }
  }
  editJob(id:any){
    console.log(id);
    this.router.navigate(['/work/edit', id]);
  }
  back(){
    sessionStorage.removeItem('workId');
    if (sessionStorage.getItem("Company") != null)
      this.router.navigate(['companies/' + sessionStorage.getItem('companyId')]);
    else if (sessionStorage.getItem("User") != null)
      this.router.navigate(['users/' + sessionStorage.getItem('userId')]);
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
            })
        })
        alert('Congratulations! You have successfully applied for this work ad.')
        this.alreadyApplied = true;
      },
      error => {
        console.log("An error occurred.");
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
      alert('Congratulations! You have successfully reapplied for this work ad.')
      this.canReapply = false;
    })
  }
}
