import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { CompaniesService } from '../../companies.service';

@Component({
  selector: 'app-company-edit',
  templateUrl: './company-edit.component.html',
  styleUrls: ['./company-edit.component.scss']
})
export class CompanyEditComponent implements OnInit {

  Company:any;
  admin = localStorage.getItem('admin');
  public id: any; 
  public hide: boolean = true; //for the password
  public form: FormGroup = new FormGroup({
                name: new FormControl(''),
                email: new FormControl(''),
                password: new FormControl(''),
                address: new FormControl(''),
                description: new FormControl(''),
                verifiedAccount: new FormControl(''),
              });

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
      console.log(data);

      this.form.patchValue({name: this.Company.name});
      this.form.patchValue({email: this.Company.email});
      this.form.patchValue({password: this.Company.passwordHash});
      this.form.patchValue({address: this.Company.address});
      this.form.patchValue({description: this.Company.description});
      this.form.patchValue({verifiedAccount: this.Company.verifiedAccount});
    });
  }
  password() {
    this.hide = !this.hide;
  }
  cancel(){
    this.router.navigate(['/companies', this.id]);
  }
  save(){
    this.Company.name = this.form.controls['name'].value;
    this.Company.email = this.form.controls['email'].value;
    this.Company.passwordHash = this.form.controls['password'].value;
    this.Company.address = this.form.controls['address'].value;
    this.Company.description = this.form.controls['description'].value;
    this.Company.verifiedAccount = this.form.controls['verifiedAccount'].value;

    this.service.saveCompany(this.Company).subscribe((data)=>{
      console.log("Update successful");
    });
    this.router.navigate(['/companies', this.id]);
  }
  logout() {
    this.authService.logout();
  }
}
