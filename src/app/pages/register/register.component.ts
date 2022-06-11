import { Component, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'app/classes/user';
import { AuthService } from 'app/services/auth.service';
import { Account } from 'app/classes/account';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public error: boolean | string = false;
  public myForm = new UntypedFormGroup({
    email: new UntypedFormControl('', [Validators.required, Validators.email]),
    firstName: new UntypedFormControl('', [Validators.required]),
    lastName: new UntypedFormControl('', [Validators.required]),
    password: new UntypedFormControl('', [Validators.required, Validators.minLength(5)]),
  });
  public user = new Account();

  constructor(
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
    this.user.email = this.myForm.controls["email"].value;
    this.user.password = this.myForm.controls["password"].value;
    var firstName = this.myForm.controls["firstName"].value;
    this.user.firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
    var lastName = this.myForm.controls["lastName"].value;
    this.user.lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);
    this.user.type = 'user';

    console.log(this.user)
     this.authService.register(this.user).subscribe((data)=>{
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
