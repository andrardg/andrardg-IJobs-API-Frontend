import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Company } from 'app/classes/company';
import { Job } from 'app/classes/job';
import { User } from 'app/classes/user';
import { CompaniesService } from 'app/services/companies.service';
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
  UserShortList:any=[];
  CompanyShortList:any=[];
  JobShortList:any=[];
  section:any = 1;  

  addressFilter:string = '';
  Companies:Array<Company> = [];

  jobTypes:Array<string> = ["Full-Time", "Part-Time", "Internship", "Volunteering"];
  jobTypesFilter: Array<boolean> = [false, false, false, false];
  experience:any=["Entry Level", "Junior Level", "Mid-Senior Level", "Senior Level", "Associate", "Director"];
  experienceFilter: Array<boolean> = [false, false, false, false, false, false];
  salaryFilter:number = 0;
  error:any = '';
  Jobs:Array<Job> = [];
  
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
    private jobService: JobsService) { 

    }

  ngOnInit(): void {
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
    this.Users = data;
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
    this.Companies = data;
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
    this.Jobs = data;
    if(this.JobList.length > 3)
      this.JobShortList = this.JobList.slice(0,3);
    else
      this.JobShortList = this.JobList;
    });
  }
  sectionOne(){
    this.section = 1;
  }
  sectionTwo(){
    this.section = 2;
  }
  sectionThree(){
    this.section = 3;
  }
  sectionFour(){
    this.section = 4;
  }
  getCompanyDetails(id:any){
    console.log(id);
    this.router.navigate(['/companies', id]);
  }
  getJobDetails(id:any){
    console.log(id);
    this.router.navigate(['/jobs', id]);
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
    if(!Number.isNaN(Number(this.salaryFilter)) == false)
    this.error= 'Salary has to be numeric';
    else{
      this.error = '';
      this.Jobs = this.JobList.filter(elem => (
        this.salaryFilter == 0 || elem.salary > this.salaryFilter
        ));
      this.Jobs.forEach(job => { // for each user, loop over studies list
        var add:boolean = false;
        var add2:boolean = false;
        for(let i=0; i< this.jobTypesFilter.length; i++)
            if(this.jobTypesFilter[i] == true && job.jobType?.indexOf(this.jobTypes[i])!= -1)
              add = true;
        for(let i=0; i< this.experienceFilter.length; i++)
          if(this.experienceFilter[i] == true && job.experience?.indexOf(this.experience[i])!= -1)
            add2 = true;
        if(add == false && this.jobTypesFilter.indexOf(true) != -1) // if job type not in filter list, delete
          this.Jobs = this.Jobs.filter( elem => (elem != job));
        if(add2 == false && this.experienceFilter.indexOf(true) != -1) // if job experience not in filter list, delete
          this.Jobs = this.Jobs.filter( elem => (elem != job));
      });
    }
    
  }



  toggleCv(event:any){
    if(this.cvFilter == false && event.pointerId == 1)
      {
        this.cvFilter = true;
        this.Users = this.Users.filter( elem => (elem.cv != null));
      }
    else if(event.pointerId == 1)
      {
        this.cvFilter = false;
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
  togglePhoto(event:any){
    if(this.photoFilter == false && event.pointerId == 1)
    {
      this.photoFilter = true;
      this.Users = this.Users.filter( elem => (elem.photo != null));
    }
    else if(event.pointerId == 1)
    {
      this.photoFilter = false;
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
