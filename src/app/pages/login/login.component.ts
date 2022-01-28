import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { lastValueFrom } from 'rxjs';
import { User } from 'app/interfaces/user';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public user: User = {
    Email: '',
    PasswordHash: '',
  };
  public formGroup = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  public error: boolean | string = false;
  public invalid: Boolean = false;

  constructor(
    private authService:AuthService, 
    private router:Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {

    //sessionStorage.clear();
  }

  async doLogin(): Promise<void> {
    this.error = false;

    this.user.Email = this.formGroup.controls["email"].value;
    this.user.PasswordHash = this.formGroup.controls["password"].value;

    if (this.validateEmail(this.user.Email)) {  
    
    this.authService.login(this.user).subscribe(async data => {
      //var user = await lastValueFrom(data);
        console.log(data);

        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('role', data.role);

        if(data.role == '0')
          {
            sessionStorage.setItem('admin', data);
            this.router.navigate(['/admin-dashboard']);
          }
        else if(data.role == '1' || data.role == '2')
          {
            sessionStorage.setItem('user', data);
            this.router.navigate(['/dashboard']);
          }
          console.log(sessionStorage.getItem('admin'));
          console.log(sessionStorage.getItem('user'));
        });
    }
    else {
        this.error = 'Wrong email format';
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
