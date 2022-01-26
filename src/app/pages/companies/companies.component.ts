import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Company } from 'src/app/interfaces/company';
import { PrivateService } from 'src/app/services/private.service';
import { CompaniesService } from './companies.service';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent implements OnInit {

  public companies:   Company[] = [];
  constructor(
    private router:Router,
    private service: CompaniesService) { }

  // Name?: string | undefined;
  // Email: string = "";
  // Password: string ="";
  // Address?: string | undefined;
  // Description?: string | undefined;
  // verifiedAccount: boolean = true;

  columnsToDisplay : string[] = ['Name', 'Email', 'Address', 'verifiedAccount', 'Options'];
  dataSource = new MatTableDataSource<Company>(this.companies);
  CompanyList:any=[];
  Company:any;
  
  ngOnInit(): void {
    //this.getAllCompanies();
    this.refreshCompanyList();
  }

  getAllCompanies(){

    let resp = this.service.getCompanies();
    resp.subscribe(report => this.dataSource.data = report as Company[])
    //this.privateService.getCompanies().subscribe((response: any)=>{
    //  this.companies = response.allUsers;
    //});
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
}