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

  error = ''
  public myForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    password: new FormControl('', [Validators.required, Validators.minLength(5)]),
  });
  public user: User = {
    Email: '',
    PasswordHash: '',
    FirstName: '',
    LastName: ''
  };



  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService) { }

  ngOnInit(): void {
    localStorage.clear();
    // if(localStorage.getItem('Token')){
    //   this.router.navigate(['/']);
    // }
  }


  doRegister(){
    if(this.myForm.invalid){
      console.log("Register error");
      return;
    }
    this.user.Email = this.myForm.controls["email"].value;
    this.user.PasswordHash = this.myForm.controls["password"].value;
    this.user.FirstName = this.myForm.controls["firstName"].value;
    this.user.LastName = this.myForm.controls["lastName"].value;

    console.log(this.user);
    //this.router.navigate(['/login']);
     this.authService.register(this.user).subscribe((data)=>{
       console.log("success");
     });
     
     this.router.navigate(['/login']);
 // .subscribe((response:any) => {
      //     if(response) {
      //       this.toastr.clear()
      //       this.toastr.success("User registered successfully");
      //     }
      //   },
      //   error => {
      //     this.error = error.error;
      //   });
  }
  
  login() {
    this.router.navigate(['/login']);
  }
}
