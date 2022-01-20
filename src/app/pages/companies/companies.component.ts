import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Company } from 'src/app/interfaces/company';
import { PrivateService } from 'src/app/services/private.service';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrls: ['./companies.component.scss']
})
export class CompaniesComponent implements Company, OnInit {

  public companies:   Company[] = [];
  constructor(private privateService: PrivateService) { }

  Name?: string | undefined;
  Email: string = "";
  Password: string ="";
  Address?: string | undefined;
  Description?: string | undefined;
  verifiedAccount: boolean = true;

  columnsToDisplay : string[] = ['Name', 'Email', 'Password', 'Address', 'Description', 'verifiedAccount'];
  dataSource = new MatTableDataSource<Company>(this.companies);
  
  ngOnInit(): void {
    this.getAllCompanies();
  }

  getAllCompanies(){

    let resp = this.privateService.getCompanies();
    resp.subscribe(report => this.dataSource.data = report as Company[])
    //this.privateService.getCompanies().subscribe((response: any)=>{
    //  this.companies = response.allUsers;
    //});
  }
}