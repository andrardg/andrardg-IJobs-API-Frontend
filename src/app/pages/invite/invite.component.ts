import { invalid } from '@angular/compiler/src/render3/view/util';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Company } from 'app/classes/company';
import { Invite } from 'app/classes/invite';
import { Job } from 'app/classes/job';
import { CompaniesService } from 'app/services/companies.service';
import { InviteService } from 'app/services/invite.service';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.scss']
})
export class InviteComponent implements OnInit {

  userId:any;
  company:any;
  selectedCompany:any;
  selectedJob:any;
  CompanyList: Array<Company> = [];
  InvitesList: Array<Invite> = [];
  admin = sessionStorage.getItem('Admin');
  availableJobs:Array<Job> = [];
  
  constructor(private service: InviteService,
    private companyService: CompaniesService,
    @Inject(MAT_DIALOG_DATA) public data:any) {
      this.userId = data.userId;
     }

  ngOnInit(): void {
    sessionStorage.removeItem('jobId');
    sessionStorage.removeItem('companyId');
    if(sessionStorage.getItem("Company")!= null)
      this.getCurrentCompany();
    else if(sessionStorage.getItem("Admin")!= null)
      this.getCompanies();
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
  getCompanies(){
    this.companyService.getCompanies().subscribe(data=>{
      this.CompanyList = data;
      this.CompanyList = this.CompanyList.filter( x=> x.verifiedAccount == true);
      console.log(this.CompanyList);
    });
  }
  getInvites(company:any){
    this.service.getInvites().subscribe(data=>{

      console.log(data);
      this.InvitesList = data;
      this.InvitesList.forEach(element => {
        if(element.userId == this.userId)
          this.availableJobs = this.availableJobs.filter(x => x.id != element.jobId)
      });
      this.availableJobs = this.availableJobs.filter( x=> x.open == true)
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
}
