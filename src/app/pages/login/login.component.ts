import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { User } from 'app/interfaces/user';
import { AuthService } from 'app/services/auth.service';
import { Company } from 'app/interfaces/company';
import { Account } from 'app/interfaces/account';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  account: Account = {Email: '', Password: ''}
  public formGroup = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  public error: boolean | string = false;
  public invalid: Boolean = false;

  constructor(
    private authService:AuthService, 
    private router:Router) { }

  ngOnInit(): void {

    //sessionStorage.clear();
  }

  async doLogin(): Promise<void> {
    //this.error = false;

    this.account.Email = this.formGroup.controls["email"].value;
    this.account.Password = this.formGroup.controls["password"].value;

    if (this.validateEmail(this.account.Email)) {  
    

        this.authService.loginCompany(this.account).subscribe(async data => {
          sessionStorage.setItem('token', data.token);
          sessionStorage.setItem('role', data.role);
          sessionStorage.setItem('id', data.id);
          
          sessionStorage.setItem('Company', JSON.stringify(data));
          console.log(JSON.parse(sessionStorage.getItem('Company') || ""))
          this.router.navigate(['/dashboard']);
          },
          error => {
            this.error = 'Incorrect email or password';
          },);
        
          this.authService.login(this.account).subscribe(async data => {
            sessionStorage.setItem('token', data.token);
            sessionStorage.setItem('role', data.role);
            
            if(data.role == '0')
              {
                sessionStorage.setItem('Admin', data);
              }
            else if(data.role == '1')
              {
                sessionStorage.setItem('User', data);
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
