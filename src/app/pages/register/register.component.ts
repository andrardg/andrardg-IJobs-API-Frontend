import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'app/interfaces/user';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public error: boolean | string = false;
  public myForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)]),
  });
  public user: User = {
    Email: '',
    Password: '',
    FirstName: '',
    LastName: '',
    Role: '1'
  };



  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    //sessionStorage.clear();
  }


  doRegister(){
    if(this.myForm.invalid){
      console.log("Register error");
      this.error = 'You cannot register empty fields.'
      return;
    }
    
    this.error = false;
    this.user.Email = this.myForm.controls["email"].value;
    this.user.Password = this.myForm.controls["password"].value;
    this.user.FirstName = this.myForm.controls["firstName"].value;
    this.user.LastName = this.myForm.controls["lastName"].value;

    console.log(this.user);
    //this.router.navigate(['/login']);
     this.authService.register(this.user).subscribe((data)=>{
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
