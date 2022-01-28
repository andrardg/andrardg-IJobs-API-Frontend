import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CompaniesService } from '../../companies.service';
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
  admin = sessionStorage.getItem('admin');

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
    });
  }
  removeCompany(id:any){
    console.log(id);
    this.service.removeCompany(id).subscribe((data)=>{
      console.log("success");
 });
    this.router.navigate(['/companies']);
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
}
