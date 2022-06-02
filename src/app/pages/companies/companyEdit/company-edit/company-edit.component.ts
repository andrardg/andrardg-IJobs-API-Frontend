import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y/input-modality/input-modality-detector';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { CompaniesService } from '../../companies.service';
import * as bcrypt from 'bcryptjs'

@Component({
  selector: 'app-company-edit',
  templateUrl: './company-edit.component.html',
  styleUrls: ['./company-edit.component.scss']
})
export class CompanyEditComponent implements OnInit {

  Company:any;
  admin = sessionStorage.getItem('Admin');
  public id: any; 
  public hide: boolean = true; //for the password
  public form: FormGroup = new FormGroup({
                name: new FormControl('', [Validators.required]),
                email: new FormControl('', [Validators.required, Validators.email]),
                oldpassword: new FormControl(''),
                newpassword: new FormControl(''),
                newpassword2: new FormControl(''),
                address: new FormControl('', [Validators.required]),
                description: new FormControl('', [Validators.required]),
                verifiedAccount: new FormControl(''),
              });
  public oldpasswordHash:string="";
  public oldpasswordTyped:string="";
  public newpassword:string="";
  public newpassword2:string="";

  public section:any = 0;
  public error: boolean | string = false;
  Verified:any=["Yes", "No"];
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
    });
  }
  password() {
    this.hide = !this.hide;
  }
  save(){
    if(this.form.invalid)
    this.error = "You have invalid fields."
    else{
      this.error = "";
    this.Company.name = this.form.controls['name'].value;
    this.Company.email = this.form.controls['email'].value;
    this.Company.oldPasswordHash = this.oldpasswordHash;
    this.oldpasswordTyped = this.form.controls['oldpassword'].value;
    this.newpassword = this.form.controls['newpassword'].value;
    this.newpassword2 = this.form.controls['newpassword2'].value;
    this.Company.address = this.form.controls['address'].value;
    this.Company.description = this.form.controls['description'].value;
    if(this.form.controls['verifiedAccount'].value == "Yes")
      {this.Company.verifiedAccount = true;
        this.Company.role = 2;}
    else
      {this.Company.verifiedAccount = false;
        this.Company.role = 1;}
    
        
    if(this.section == 2){
      
      if(this.newpassword && this.newpassword2 && this.oldpasswordTyped){
        if(this.newpassword == this.newpassword2)
          {if(bcrypt.compareSync(this.oldpasswordTyped, this.oldpasswordHash))
            this.Company.password = this.newpassword;
          else{
            this.error = "Old password incorrect."}}
          else
            this.error = "The new password fields must match."
      }else 
        this.error = "All password fields must be filled."
    }
    else
    this.Company.password = this.oldpasswordHash;
    console.log(this.Company);

    if(!this.error){
      this.service.saveCompany(this.Company).subscribe((data)=>{
      console.log("Update successful");
      this.section = 0;
      },
        error => {
          this.error="Email already taken";
        }
      );
    }
    else
    console.log(this.error);
    }
    this.form.patchValue({oldpassword: ""});
    this.form.patchValue({newpassword: ""});
    this.form.patchValue({newpassword2: ""});
    
  }
  logout() {
    this.authService.logout();
  }
  sectionOne(){
    this.cancel();
    this.section = 1;
  }
  sectionTwo(){
    this.cancel();
    this.section = 2;
  }
  sectionThree(){
    this.cancel();
    this.section = 3;
  }
  sectionFour(){
    this.cancel();
    this.section = 4;
  }
  cancel(){
    this.getCompanyDetails(this.id);
    this.section = 0;
    this.error = "";
    this.form.patchValue({name: this.Company.name});
    this.form.patchValue({email: this.Company.email});
    this.form.patchValue({oldpassword: ""});
    this.oldpasswordHash = this.Company.passwordHash;
    this.form.patchValue({newpassword: ""});
    this.form.patchValue({newpassword2: ""});
    this.form.patchValue({address: this.Company.address});
    this.form.patchValue({description: this.Company.description});
    if(this.Company.verifiedAccount == true)
      this.form.patchValue({verifiedAccount: "Yes"});
    else
      this.form.patchValue({verifiedAccount: "No"});
  }
  removeCompany(id:any){
    console.log(id);
    if (confirm('Are you sure you want to delete this account?')) {
      this.service.removeCompany(id).subscribe((data)=>{
        console.log("success");
        this.logout();
      });
      this.router.navigate(['/dashboard']);
    } else {
      // Do nothing!
      console.log('Not deleted');
    }
    }
}
