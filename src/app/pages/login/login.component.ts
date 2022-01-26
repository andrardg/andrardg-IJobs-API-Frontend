import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  
  public formGroup!: FormGroup;
  error = "";

  // public text:string = "";
  // public isDisabled: boolean = false;
  // public user: any = {
  //   Email: '',
  //   Password: '',
  // };
  // public error: boolean|string = false;
  // public user2 : User = { //din interfata
  //   Email: '',
  //   Password: '',
  // };



  constructor(
    private authService:AuthService, 
    private router:Router,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    if(localStorage.getItem('Token')){
      this.router.navigate(['/']);
    }
    this.formGroup = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
    });
  }

    // convenience getter for easy access to form fields
    get formData() { return this.formGroup.controls; }

  doLogin(): void{
    if (this.formGroup.invalid) {
      return;
    }
    if(this.validateEmail(this.formData['email'].value)){
      this.router.navigate(['/dashboard']);

      this.authService.login(this.formData['email'].value, this.formData['password'].value)
        .subscribe((response:any) => {
          if(response && response.token) {
            this.toastr.clear()
            this.toastr.success("Login successfull");
            localStorage.setItem('Token', JSON.stringify(response.token));
            
            let tokenData = response.token.split('.')[1]
            let decodedTokenData = JSON.parse(window.atob(tokenData))
            localStorage.setItem('Role', decodedTokenData["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
          }
        },
        error => {
          this.error = error.error;
        });
      }else{
        this.error='Email is not valid';
      }


//     this.error=false;
//     console.log('LOGIN CLICKED', this.user);
//     if(this.validateEmail(this.user.email)){
// //serviciul de login
//       this.authService.login(this.user).subscribe((response: any) =>{
//         console.log(response)

//         if(response && response.token){
//           localStorage.setItem('token', response.token);
//           this.router.navigate(['/dashboard']);
//         }
//         });


//     }else{
//       this.error='Email is not valid';
//     }
  }
  validateEmail(email:string) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  register() {
    this.router.navigate(['/register']);
  }

}
