import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Company } from 'app/interfaces/company';
import { AuthService } from 'app/services/auth.service';
import { PrivateService } from 'app/services/private.service';
import { CompaniesService } from './companies.service';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent implements OnInit {

  CompanyList:any=[];
  columnsToDisplay : string[] = ['Name', 'Email', 'Address', 'Role', 'verifiedAccount', 'Options'];
  dataSource = new MatTableDataSource<Company>(this.CompanyList);

  admin = sessionStorage.getItem('admin');
  constructor(
    private router:Router,
    private service: CompaniesService,
    private authService: AuthService) { }
    
  
  ngOnInit(): void {
    //this.getAllCompanies();
    this.refreshCompanyList();
  }

  refreshCompanyList(){
    this.service.getCompanies().subscribe(data=>{
      console.log(data);
      this.CompanyList=data;
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
      this.refreshCompanyList();
 });
  }
  logout() {
    this.authService.logout();
  }
}