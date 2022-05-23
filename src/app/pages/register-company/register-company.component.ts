import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Company } from 'app/interfaces/company';
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
    password: new FormControl('', [Validators.required, Validators.minLength(5)]),
  });
  public company: Company ={
    Name:'',
    Email:'',
    Password:'',
    Address:'',
    Role:'2',
    verifiedAccount:false,
  };
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService) { }

  ngOnInit(): void {
  }

  doRegister(){
    if(this.myForm.invalid){
      console.log("Register error");
      this.error = 'You cannot register empty fields.'
      return;
    }
    
    this.error = false;
    this.company.Name = this.myForm.controls["name"].value;
    this.company.Email = this.myForm.controls["email"].value;
    this.company.Address = this.myForm.controls["address"].value;
    this.company.Password = this.myForm.controls["password"].value;

    console.log(this.company);
    //this.router.navigate(['/login']);
     this.authService.registerCompany(this.company).subscribe((data)=>{
       console.log("success");
     },
     error => {
       this.error = error;
     },);
    if(this.error)
      console.log(this.error);
    else
      this.router.navigate(['/login']);

  }
  
  login() {
    this.router.navigate(['/login']);
  }
}
