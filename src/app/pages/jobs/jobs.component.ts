import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Job } from 'app/classes/job';
import { AuthService } from 'app/services/auth.service';
import { Domain } from 'app/classes/domain';
import { JobsService } from '../../services/jobs.service';
import { DomainService } from 'app/services/domain.service';
import { Subdomain } from 'app/classes/subdomain';
@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {

  JobList:Array<Job> = [];
  createRights = sessionStorage.getItem('Admin') || (sessionStorage.getItem('Company') && sessionStorage.getItem('role') ==  '2');
  admin = sessionStorage.getItem('Admin');
  deleteProgress = 0;

  jobTypes:Array<string> = ["Full-Time", "Part-Time", "Internship", "Volunteering"];
  jobTypesFilter: string = 'All';
  experience:any=["Entry Level", "Junior Level", "Mid-Senior Level", "Senior Level", "Associate", "Director"];
  experienceFilter:string = 'All';
  salaryFilter:number = 0;
  jobsOpenFilter:boolean = true;
  error:any = '';
  DomainList:Array<Domain> = [];
  domainFilter:any = 'All';
  SubdomainList:Array<Subdomain> = [];
  subdomainFilter : any = 'All';
  Jobs:Array<Job> = [];
  constructor(
    private router:Router,
    private service: JobsService,
    private authService: AuthService,
    private domainService: DomainService) {
    }
  
  ngOnInit(): void {  
    this.getJobList();
    this.getDomains();
  }
  getJobList(){
    this.service.getJobs().subscribe(data=>{
      console.log(data);
      this.JobList=data;
      this.Jobs = data;
      this.Jobs = this.Jobs.filter(data => (data.company!.verifiedAccount == true && data.open == true));
    });
  }
  getJobDetails(id: any){
    console.log(id);
    this.router.navigate(['/jobs', id]);
  }
  create() {
    this.router.navigate(['/jobs/create']);
  }
  logout() {
    this.authService.logout();
  }
  doneJob(){
    if(!Number.isNaN(Number(this.salaryFilter)) == false)
    this.error= 'Salary has to be numeric';
    else{
      this.error = '';
      this.Jobs = this.JobList.filter(elem => (
        this.salaryFilter == 0 || elem.salary > this.salaryFilter
        ));
      if(this.jobTypesFilter != 'All')
        this.Jobs = this.Jobs.filter(elem => elem.jobType == this.jobTypesFilter);
      if(this.experienceFilter != 'All')
        this.Jobs = this.Jobs.filter(elem => elem.experience == this.experienceFilter);
      if(this.jobsOpenFilter == false)
        this.Jobs = this.Jobs.filter(x => x.open == false);
      else
        this.Jobs = this.Jobs.filter(x => x.open == true);
      if(this.domainFilter != 'All'){
        if(this.subdomainFilter != 'All')
          this.Jobs = this.Jobs.filter( x=> x.subdomainId == this.subdomainFilter);
        else
          this.Jobs  = this.Jobs.filter( x=> x.subdomain!.domainId == this.domainFilter);
      }
    }
  }
  toggleJobNotOpen(event:any){
    if(this.jobsOpenFilter == false && event.pointerId == 1){
      this.jobsOpenFilter = true;
    }
    else if(event.pointerId == 1){
      this.jobsOpenFilter = false;
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
    console.log(this.SubdomainList);
    console.log(this.domainFilter);
  }
}
