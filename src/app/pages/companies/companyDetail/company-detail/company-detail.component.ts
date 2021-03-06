import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompaniesService } from '../../../../services/companies.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { AuthService } from 'app/services/auth.service';
import { PreviousRouteService } from 'app/services/previous-route.service';
import { Company } from 'app/classes/company';
import { Job } from 'app/classes/job';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.scss']
})
export class CompanyDetailComponent implements OnInit {

  Company = new Company();
  Jobs : Array<Job> = [];
  Work : Array<Job> = [];
  public id: any;
  public section:any = 1;
  editDeleteRights : boolean = false;
  showPrevious: any = false;
  previousIsJob: boolean = true;

  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private service: CompaniesService,
    private authService: AuthService,
    private previousRouteService:PreviousRouteService) { 
    sessionStorage.removeItem('companyId');}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.id = params['id'];
      console.log(this.id);
    });
    if(sessionStorage.getItem('jobId'))
      this.showPrevious = sessionStorage.getItem('jobId');
    if(sessionStorage.getItem('workId'))
      this.showPrevious = sessionStorage.getItem('workId');{
        this.previousIsJob = false;
        this.getCompanyDetails(this.id);
      }
  }

  getCompanyDetails(id:any){
    this.service.getCompanyDetails(id).subscribe(data=>{
      this.Company=data;
      this.Jobs = this.Company.jobs.filter( x=> x.workType == false)
      this.Work = this.Company.jobs.filter( x=> x.workType == true)
      if (sessionStorage.getItem("Company") != null)
      var company = JSON.parse(sessionStorage.getItem('Company') || "")

    if(sessionStorage.getItem('Admin') || (company && company.id == this.Company.id))
      this.editDeleteRights = true;
    });
  }
  getJobDetails(id: any){
    console.log(id);
    sessionStorage.setItem('companyId', this.id);
    this.router.navigate(['/jobs', id]);
  }

  editCompany(id:any){
    console.log(id);
    this.router.navigate(['/companies/edit', id]);
  }
  back(){
    //sessionStorage.removeItem('companyId');
    if(this.previousIsJob == true)
      this.router.navigate(['jobs/' + this.showPrevious]);
    else
      this.router.navigate(['work/' + this.showPrevious]);
  }
  logout() {
    this.authService.logout();
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
}
