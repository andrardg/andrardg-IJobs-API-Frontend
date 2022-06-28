import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Account } from 'app/classes/account';
import { Company } from 'app/classes/company';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-register-company',
  templateUrl: './register-company.component.html',
  styleUrls: ['./register-company.component.scss']
})
export class RegisterCompanyComponent implements OnInit {

  
  public error: boolean | string = false;
  public myForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    address: new FormControl(''),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });
  public company = new Account();
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService) { }

  ngOnInit(): void {
    sessionStorage.removeItem('jobId');
    sessionStorage.removeItem('companyId');
  }

  doRegister(){
    if(this.myForm.invalid){
      console.log("Register error");
      if(this.myForm.controls['email'].invalid)
        this.error = 'The email has wrong format.';
      else if(this.myForm.controls['password'].invalid)
        this.error = 'The password must have at least 8 characters';
      else
        this.error = 'You cannot register without a company name.'
      return;
    }
    
    this.error = false;
    var name = this.myForm.controls["name"].value;
    this.company.name = name.charAt(0).toUpperCase() + name.slice(1);
    this.company.email = this.myForm.controls["email"].value;
    var address = this.myForm.controls["address"].value;
    this.company.address = address.charAt(0).toUpperCase() + address.slice(1);
    this.company.password = this.myForm.controls["password"].value;
    this.company.type = 'company';
    console.log(this.company);
    
     this.authService.register(this.company).subscribe((data)=>{
       console.log("success");
       alert('Registered successfully');
      this.router.navigate(['/login']);
     },
     error => {
       this.error = error;
     },);
    if(this.error)
      console.log(this.error);
  }
  
  login() {
    this.router.navigate(['/login']);
  }
}
