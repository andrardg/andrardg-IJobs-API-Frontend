import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Application } from 'app/classes/application';
import { Invite } from 'app/classes/invite';
import { ApplicationService } from 'app/services/application.service';
import { CompaniesService } from 'app/services/companies.service';
import { InviteService } from 'app/services/invite.service';
import { UsersService } from 'app/services/users.service';

@Component({
  selector: 'app-invite-details',
  templateUrl: './invite-details.component.html',
  styleUrls: ['./invite-details.component.scss']
})
export class InviteDetailsComponent implements OnInit {

  invitesList: Array<Invite> = [];
  currentUser:any;
  admin:any;
  user = sessionStorage.getItem('User');
  company = sessionStorage.getItem('Company');
  @Input() id:any;
  constructor(private router: Router,
    private service: InviteService,
    private companyService: CompaniesService,
    private userService: UsersService,
    private applicationService: ApplicationService) { }

  ngOnInit(): void {
    sessionStorage.removeItem('jobId');
    sessionStorage.removeItem('companyId');
    if (sessionStorage.getItem('Admin'))
      this.admin = JSON.parse(sessionStorage.getItem('Admin') || "")
    //else if (sessionStorage.getItem('User'))
    //  this.getUserDetails(JSON.parse(sessionStorage.getItem('User') || ""))
    this.getAllInvites();
  }
  getAllInvites(){
    this.service.getInvites().subscribe(data =>{
      this.invitesList = data;
      if(this.user || (this.admin && this.admin.id != this.id))
        this.invitesList = this.invitesList.filter(x => x.userId == this.id)
      else if(this.company)
        this.invitesList.filter(x => x.job?.companyId != this.id)
    })
  }
  deleteInvite(id:any){
    this.service.removeInvite(id).subscribe(data =>{
      console.log("Invitation deleted successfully");
      //alert("Invitation deleted successfully");
      this.invitesList = this.invitesList.filter(x=> x.id != id)
    })
  }
  acceptInvite(invite:any){
    this.userService.getUserDetails(invite.userId).subscribe(data =>{
      this.currentUser = data;
      console.log(data);

      if(this.currentUser.cv != "" && this.currentUser.cv!=null){
        var app = new Application();
        app.cv=this.currentUser.cv;
        app.userId = this.currentUser.id;
        app.jobId = invite.jobId;
        app.status = 'Pending';
        console.log(app);
        this.applicationService.createApplication(app).subscribe(data =>{
          console.log("Created successfully");
          alert("Invitation accepted successfully");
          this.deleteInvite(invite.id);
        },
        error => {
          console.log("An error occurred");
        });
      }
      else{
        alert("You must upload your CV first!");
      }
    })
  }
  /*getCompanyDetails(){
    this.companyService.getCompanyDetails(JSON.parse(sessionStorage.getItem('Company') || "")).subscribe(data=>{
      this.company = data;
      this.invitesList.filter(x => x.job?.companyId != this.id)
    })
  }*/
}
