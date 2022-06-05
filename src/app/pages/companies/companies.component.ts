import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Company } from 'app/classes/company';
import { AuthService } from 'app/services/auth.service';
import { PrivateService } from 'app/services/private.service';
import { CompaniesService } from '../../services/companies.service';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent implements OnInit {

  CompanyList:Array<Company> = [];
  admin = sessionStorage.getItem('Admin');
  verify:boolean = false;
  addressFilter:string = '';
  Companies:Array<Company> = [];
  count:any = 0;
  constructor(
    private router:Router,
    private service: CompaniesService,
    private authService: AuthService) { }
    
  ngOnInit(): void {
    this.getCompanies();
  }

  getCompanies(){
    this.service.getCompanies().subscribe(data=>{
      console.log(data);
      this.CompanyList = data;
      this.Companies = data;
      this.Companies = this.Companies.filter(elem => (elem.verifiedAccount == true))
      this.count = this.Companies.length;
    });
  }
  getCompanyDetails(id: any){
    console.log(id);
    this.router.navigate(['/companies', id]);
  }
  removeCompany(id:any){
    console.log(id);
    this.service.removeCompany(id).subscribe((data)=>{
      console.log("success");
      this.getCompanies();
 });
  }
  logout() {
    this.authService.logout();
  }
  verifyTrue(){
    this.verify = true;
    this.Companies = this.CompanyList.filter(elem => (elem.verifiedAccount == false))
  }
  verifyFalse(){
    this.verify = false;
    this.Companies = this.CompanyList.filter(elem => (elem.verifiedAccount == true))
  }
  doneCompany(){
    this.Companies = this.CompanyList.filter(elem => (
      this.addressFilter == '' || (elem.address !=null && elem.address?.toLowerCase().indexOf((this.addressFilter).toLowerCase()) != -1)
    ));
  }
}