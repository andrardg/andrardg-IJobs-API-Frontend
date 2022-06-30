import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Company } from 'app/classes/company';
import { Domain } from 'app/classes/domain';
import { Job } from 'app/classes/job';
import { Subdomain } from 'app/classes/subdomain';
import { User } from 'app/classes/user';
import { CompaniesService } from 'app/services/companies.service';
import { DomainService } from 'app/services/domain.service';
import { JobsService } from 'app/services/jobs.service';
import { UsersService } from 'app/services/users.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  name: string = '';
  UserList:Array<User> = [];
  CompanyList:Array<Company> = [];
  JobList:Array<Job> = [];
  WorkList:Array<Job> = [];
  UserShortList:any=[];
  CompanyShortList:any=[];
  JobShortList:any=[];
  WorkShortList:Array<Job> = [];
  section:any = 1;  
  admin = sessionStorage.getItem('Admin');

  addressFilter:string = '';
  Companies:Array<Company> = [];

  jobTypes:Array<string> = ["Full-Time", "Part-Time", "Internship", "Volunteering"];
  jobTypesWork:Array<string> = ["One day", "A few days", "Weekly", "Monthly", "Regularly"];
  jobTypesFilter: string = 'All';
  experience:any=["Entry Level", "Junior Level", "Mid-Senior Level", "Senior Level", "Associate", "Director"];
  experienceWork:any=["Entry Level", "Junior Level", "Mid-Senior Level", "Senior Level"];
  experienceFilter:string = 'All';
  salaryFilter:number = 0;
  jobsOpenFilter:boolean = true;
  error:any = '';
  DomainList:Array<Domain> = [];
  domainFilter:any = 'All';
  SubdomainList:Array<Subdomain> = [];
  subdomainFilter : any = 'All';
  Jobs:Array<Job> = [];
  Work:Array<Job> = [];
  
  Users:Array<User>=[];
  residenceFilter:string = '';
  study:Array<string> = ['Primary School', 'Middle School', 'Highschool', 'Vocational School', 'University'];
  studiesFilter2: Array<boolean> = [false, false, false, false, false];
  cvFilter:boolean = false;
  photoFilter:boolean = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private userService: UsersService,
    private companyService: CompaniesService,
    private jobService: JobsService,
    private domainService: DomainService) { 

    }

  ngOnInit(): void {
    sessionStorage.removeItem('jobId');
    sessionStorage.removeItem('companyId');
    sessionStorage.removeItem('workId');
    this.activatedRoute.params.subscribe((params: any) => {
    this.name = params['search'];
    console.log(this.name);
    this.getUserByName();
    this.getCompaniesByName();
    this.getJobsByJobTitle();
  });
  }
  getUserByName(){
    console.log(this.name);
    this.userService.getUsersByName(this.name).subscribe(data=>{
    console.log(data);
    this.UserList = data;
    this.UserList = this.UserList.filter(elem => (elem.role == '1'));
    this.Users = this.UserList;
    if(this.UserList.length > 3)
      this.UserShortList = this.UserList.slice(0,3);
    else
      this.UserShortList = this.UserList;
    });
  }  
  getCompaniesByName(){
    this.companyService.getCompaniesByName(this.name).subscribe(data=>{
    console.log(data);
    this.CompanyList = data;
    this.CompanyList = this.CompanyList.filter(elem => (elem.verifiedAccount == true));
    this.Companies = this.CompanyList;
    if(this.CompanyList.length > 3)
      this.CompanyShortList = this.CompanyList.slice(0,3);
    else
      this.CompanyShortList = this.CompanyList;
    });
  }
  getJobsByJobTitle(){
    this.jobService.getJobsByJobTitle(this.name).subscribe(data=>{
    console.log(data);
    this.JobList = data;
    this.JobList = this.JobList.filter(elem => (elem.company && elem.company!.verifiedAccount == true && elem.open == true && elem.workType == false));
    this.Jobs = this.JobList;
    if(this.JobList.length > 3)
      this.JobShortList = this.JobList.slice(0,3);
    else
      this.JobShortList = this.JobList;

    this.WorkList = data;
    console.log(this.WorkList)
    this.WorkList = this.WorkList.filter(elem => (((elem.company && elem.company!.verifiedAccount == true) || elem.user) && elem.open == true && elem.workType == true));
    if(this.WorkList.length > 3)
      this.WorkShortList = this.WorkList.slice(0,3);
    else
      this.WorkShortList = this.WorkList;
    });
    console.log(this.WorkList)


  }
  sectionOne(){
    this.section = 1;
  }
  sectionTwo(){
    this.section = 2;
  }
  sectionThree(){
    this.section = 3;
    this.Jobs = this.JobList;
    this.getDomains();
  }
  sectionFour(){
    this.section = 4;
  }
  sectionFive(){
    this.section = 5;
    this.Jobs = this.WorkList;
    this.getDomains();
  }
  getCompanyDetails(id:any){
    console.log(id);
    this.router.navigate(['/companies', id]);
  }
  getJobDetails(id:any){
    console.log(id);
    if(this.section == 3)
      this.router.navigate(['/jobs', id]);
    else if(this.section == 5)
      this.router.navigate(['/work', id]);
  }
  getUserDetails(id:any){
    console.log(id);
    this.router.navigate(['/users', id]);
  }

  doneCompany(){
    this.Companies = this.CompanyList.filter(elem => (
      this.addressFilter == '' || (elem.address !=null && elem.address?.toLowerCase().indexOf((this.addressFilter).toLowerCase()) != -1)
    ));
  }

  doneJob(){
    if(this.section == 3)
      this.Jobs = this.JobList;
    else if(this.section == 5)
      this.Jobs = this.WorkList;
    if(!Number.isNaN(Number(this.salaryFilter)) == false)
    this.error= 'Salary has to be numeric';
    else{
      this.error = '';
      this.Jobs = this.Jobs.filter(elem => (
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
      if(this.domainFilter != 'All')
      {
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
      this.DomainList = this.DomainList.sort((a,b) => a.name!.localeCompare(b.name!));
      console.log(this.DomainList);
    },
    error =>{
      console.log(error);
    });
  }
  getSubdomains(){
    if(this.domainFilter != 'All'){
      this.subdomainFilter = 'All';
      this.SubdomainList = this.DomainList.filter(x => x.id == this.domainFilter)[0].subdomains!;
    
    }
    this.SubdomainList = this.SubdomainList.sort((a,b) => a.name!.localeCompare(b.name!));
    console.log(this.SubdomainList);
    console.log(this.domainFilter);
  }
  toggleCv(event:any){
    if(this.cvFilter == false && event.pointerId == 1)
      this.cvFilter = true;
    else if(event.pointerId == 1)
        this.cvFilter = false;
  }
  togglePhoto(event:any){
    if(this.photoFilter == false && event.pointerId == 1)
      this.photoFilter = true;
    else if(event.pointerId == 1)
      this.photoFilter = false;
  }
  doneUser(){
    this.Users = this.UserList.filter(elem => (
      (this.cvFilter == false || (this.cvFilter == true && elem.cv != null)) &&
      (this.photoFilter == false || (this.photoFilter == true && elem.photo != null)) &&
      (this.residenceFilter == '' || (elem.residence !=null && elem.residence?.toLowerCase().indexOf((this.residenceFilter).toLowerCase()) != -1))
    ));
    if(this.studiesFilter2)
    this.Users.forEach(user => { // for each user, loop over studies list
      var add:boolean = false;
      for(let i=0; i< this.studiesFilter2.length; i++)
          if(this.studiesFilter2[i] == true && user.studies !=null && user.studies?.toLowerCase().indexOf(this.study[i].toLowerCase())!= -1)
            add = true;
      if(add == false && this.studiesFilter2.indexOf(true) != -1) // if user studies not in filter list, delete
        this.Users = this.Users.filter( elem => (elem != user));
    });
  }
}
