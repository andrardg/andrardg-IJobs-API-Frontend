import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
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
  UserList:any=[];
  CompanyList:any=[];
  JobList:any=[];
  UserShortList:any=[];
  CompanyShortList:any=[];
  JobShortList:any=[];
  section:any = 1;
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
    if(this.JobList.length > 3)
      this.JobShortList = this.JobList.slice(0,3);
    else
      this.JobShortList = this.JobList;
    });
  }
  sectionOne(){
    this.section = 1;
    console.log(this.section);
  }
  sectionTwo(){
    this.section = 2;
    console.log(this.section);
  }
  sectionThree(){
    this.section = 3;
    console.log(this.section);
  }
  sectionFour(){
    this.section = 4;
    console.log(this.section);
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
}
