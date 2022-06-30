import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Domain } from 'app/classes/domain';
import { Job } from 'app/classes/job';
import { Subdomain } from 'app/classes/subdomain';
import { AuthService } from 'app/services/auth.service';
import { DomainService } from 'app/services/domain.service';
import { JobsService } from 'app/services/jobs.service';

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss']
})
export class WorkComponent implements OnInit {
  JobList:Array<Job> = [];
  createRights = sessionStorage.getItem('Admin') || (sessionStorage.getItem('Company') && sessionStorage.getItem('role') ==  '2') || sessionStorage.getItem('User');
  admin = sessionStorage.getItem('Admin');
  deleteProgress = 0;

  jobTypes:Array<string> = ["One day", "A few days", "Weekly", "Monthly", "Regularly"];
  jobTypesFilter: string = 'All';
  experience:any=["Entry Level", "Junior Level", "Mid-Senior Level", "Senior Level"];
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
    private domainService: DomainService) { }

  ngOnInit(): void {
    sessionStorage.removeItem('jobId');
    sessionStorage.removeItem('companyId');
    sessionStorage.removeItem('workId');
    this.getJobList();
    this.getDomains();
  }
  getJobList(){
    this.service.getWork().subscribe(data=>{
      console.log(data);
      this.JobList=data;
      this.JobList = this.JobList.filter( x=> x.user || (x.company && x.company.verifiedAccount == true))
      this.Jobs = this.JobList;
    });
  }
  getJobDetails(id: any){
    console.log(id);
    this.router.navigate(['/work', id]);
  }
  create() {
    this.router.navigate(['/work/create']);
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
      if(this.domainFilter != 'All'){
        if(this.subdomainFilter != 'All')
          this.Jobs = this.Jobs.filter( x=> x.subdomainId == this.subdomainFilter);
        else
          this.Jobs  = this.Jobs.filter( x=> x.subdomain!.domainId == this.domainFilter);
      }
    }
  }
  getDomains(){
    this.domainService.getDomains().subscribe(data=>{
      this.DomainList = data;
      console.log(data);
      this.DomainList = this.DomainList.filter( x => x.subdomains!.length > 0);
      this.DomainList = this.DomainList.sort((a,b) => a.name.localeCompare(b.name));
      console.log(this.DomainList);
    },
    error =>{
      console.log(error);
    });
  }
  getSubdomains(){
    if(this.domainFilter != 'All')
      this.SubdomainList = this.DomainList.filter(x => x.id == this.domainFilter)[0].subdomains!;
    this.SubdomainList = this.SubdomainList.sort((a,b) => a.name.localeCompare(b.name));
    console.log(this.SubdomainList);
    console.log(this.domainFilter);
  }
}
