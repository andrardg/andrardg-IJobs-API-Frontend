import { invalid } from '@angular/compiler/src/render3/view/util';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Company } from 'app/classes/company';
import { Invite } from 'app/classes/invite';
import { Job } from 'app/classes/job';
import { User } from 'app/classes/user';
import { CompaniesService } from 'app/services/companies.service';
import { InviteService } from 'app/services/invite.service';
import { UsersService } from 'app/services/users.service';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent implements OnInit {

  userId:any;
  User = new User();

  company:any;
  user:any;
  selectedCompany:any;
  selectedJob:any;
  selectedUser:any;
  CompanyList: Array<Company> = [];
  UserList : Array<User> = [];
  InvitesList: Array<Invite> = [];
  admin = sessionStorage.getItem('Admin');
  availableJobs:Array<Job> = [];
  ownerIsCompany:boolean = true;
  
  constructor(private service: InviteService,
    private companyService: CompaniesService,
    private userService: UsersService,
    @Inject(MAT_DIALOG_DATA) public data:any) {
      this.userId = data.userId;
      this.User = data.User;
     }

  ngOnInit(): void {
    sessionStorage.removeItem('jobId');
    sessionStorage.removeItem('companyId');
    sessionStorage.removeItem('workId');
    if(sessionStorage.getItem("Company")!= null)
      this.getCurrentCompany();
    else if(sessionStorage.getItem("Admin")!= null){
      this.getCompanies();
      this.getUsers();
    }
    else if(sessionStorage.getItem("User")!= null)
      this.getCurrentUser();
  }
  getCurrentCompany(){
    var id = JSON.parse(sessionStorage.getItem('Company') || "").id;
    this.companyService.getCompanyDetails(id).subscribe(data=>{
      this.company = data;
      this.availableJobs = this.company.jobs;
      console.log(data);
      this.getInvites(this.company);
    })
  }
  getCurrentUser(){
    var id = JSON.parse(sessionStorage.getItem('User') || "").id;
    this.userService.getUserDetails(id).subscribe(data=>{
      this.user = data;
      this.availableJobs = this.user.jobs;
      console.log(data);
      this.getInvites(this.user);
    })
  }
  getCompanies(){
    this.companyService.getCompanies().subscribe(data=>{
      this.CompanyList = data;
      this.CompanyList = this.CompanyList.filter( x=> x.verifiedAccount == true && x.jobs.length > 0);
      this.CompanyList = this.CompanyList.sort((a,b) => a.name!.localeCompare(b.name!));
      console.log(this.CompanyList);
    });
  }
  getUsers(){
    this.userService.getUsers().subscribe(data=>{
      this.UserList = data;
      this.UserList = this.UserList.filter( x=> x.role == '1');
      this.UserList = this.UserList.sort((a,b) => a.firstName!.localeCompare(b.firstName!));
    })
  }
  getInvites(company:any){
    this.service.getInvites().subscribe(data=>{

      console.log(data);
      this.InvitesList = data;
      this.InvitesList.forEach(element => {
        if(element.userId == this.userId)
          this.availableJobs = this.availableJobs.filter(x => x.id != element.jobId)
      });
      console.log(this.availableJobs);
      this.availableJobs = this.availableJobs.filter( x=> x.open == true)
      this.User.applications!.forEach(element => {
        if(element.userId == this.userId)
        this.availableJobs = this.availableJobs.filter(x => x.id != element.jobId)
      });
      console.log(this.availableJobs);
    });
  }
  sendInvite(){
    var inv = new Invite();
    if(this.availableJobs.length == 1)
      this.selectedJob = this.availableJobs[0].id;
    inv.jobId = this.selectedJob;
    inv.userId = this.userId;
    this.service.createInvite(inv).subscribe(data=>{
      console.log("Invite sent successfully");
      alert("Invite sent successfully");
      this.availableJobs = this.availableJobs.filter( x=> x.id != inv.jobId);
    })
  }
  changeCompany(event:any){console.log(event.target.value);
    this.selectedCompany = this.CompanyList.filter(x => x.id == event.target.value)[0];
    console.log(this.selectedCompany);
    this.getInvites(this.selectedCompany);
    this.availableJobs = this.selectedCompany.jobs;
  }
  changeUser(event:any){console.log(event.target.value);
    this.selectedUser = this.UserList.filter(x => x.id == event.target.value)[0];
    console.log(this.selectedUser);
    this.getInvites(this.selectedUser);
    this.availableJobs = this.selectedUser.jobs;
  }
}
