import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { Account } from 'app/classes/account';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  account = new Account();
  public formGroup = new UntypedFormGroup({
    email: new UntypedFormControl('', [Validators.required, Validators.email]),
    password: new UntypedFormControl('', [Validators.required]),
  });
  public error: boolean | string = false;
  public invalid: Boolean = false;

  constructor(
    private authService:AuthService, 
    private router:Router) { }

  ngOnInit(): void {
  }

  async doLogin(): Promise<void> {
    this.account.email = this.formGroup.controls["email"].value;
    this.account.password = this.formGroup.controls["password"].value;
    console.log(this.account);
    if (this.validateEmail(this.account.email)) { 
      this.authService.login(this.account).subscribe(async data =>{
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('role', data.role);
        //sessionStorage.setItem('id', data.id);

        if(data.type =='company')
        {
          sessionStorage.setItem('Company', JSON.stringify(data));
          this.authService.name.next(data.name);
          sessionStorage.setItem('name', data.name);
        }
        else if(data.type == 'user')
        {
          if(data.role == '1')
            sessionStorage.setItem('User', JSON.stringify(data));
          else if(data.role == '0')
            sessionStorage.setItem('Admin', JSON.stringify(data));

          this.authService.name.next(data.firstName);
          sessionStorage.setItem('name', data.firstName);
        }
        this.router.navigate(['/dashboard']);
      },
      error => {
        this.error = 'Incorrect email or password';
      },);
    }
    else {
        if(!this.error)
          this.error = 'Incorrect email format';
        console.log(this.error);
      }
}
  
  validateEmail(email:string) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  register() {
    this.router.navigate(['/register']);
  }

}
