import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompaniesService } from '../../../../services/companies.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.scss']
})
export class CompanyDetailComponent implements OnInit {

  Company:any;
  public id: any;
  public aboutSection:boolean = true;
  editDeleteRights : boolean = false;

  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private service: CompaniesService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.id = params['id'];
      console.log(this.id);
    });
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
    this.router.navigate(['/jobs', id]);
  }

  editCompany(id:any){
    console.log(id);
    this.router.navigate(['/companies/edit', id]);
  }
  back(){
    this.router.navigate(['/companies']);
  }
  logout() {
    this.authService.logout();
  }
  aboutTrue(){
    this.aboutSection = true;
    console.log(this.aboutSection);
  }
  aboutFalse(){
    this.aboutSection = false;
    console.log(this.aboutSection);
  }
}
