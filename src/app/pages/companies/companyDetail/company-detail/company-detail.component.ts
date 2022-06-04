import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompaniesService } from '../../../../services/companies.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { AuthService } from 'app/services/auth.service';
import { PreviousRouteService } from 'app/services/previous-route.service';
import { Company } from 'app/classes/company';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.scss']
})
export class CompanyDetailComponent implements OnInit {

  Company = new Company();
  public id: any;
  public aboutSection:boolean = true;
  editDeleteRights : boolean = false;
  showPrevious: boolean = false;

  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private service: CompaniesService,
    private authService: AuthService,
    private previousRouteService:PreviousRouteService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.id = params['id'];
      console.log(this.id);
    });
    if(this.previousRouteService.getPreviousUrl() != '/companies' && this.previousRouteService.getPreviousUrl() != '/profile' && sessionStorage.getItem('jobId')!=null)
      this.showPrevious = true;
    this.getCompanyDetails(this.id);
  }

  getCompanyDetails(id:any){
    this.service.getCompanyDetails(id).subscribe(data=>{
      this.Company=data;
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
    sessionStorage.removeItem('companyId');
    this.router.navigate(['jobs/' + sessionStorage.getItem('jobId')]);
  }
  logout() {
    this.authService.logout();
  }
  aboutTrue(){
    this.aboutSection = true;
  }
  aboutFalse(){
    this.aboutSection = false;
  }
}
