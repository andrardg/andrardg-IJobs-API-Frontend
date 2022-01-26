import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public myForm!: FormGroup;
  error = ''

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService) { }

  ngOnInit(): void {

    if(localStorage.getItem('Token')){
      this.router.navigate(['/']);
    }

    this.myForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      password: new FormControl('', [Validators.required, Validators.minLength(5)]),
    });
  }

  
  get formData() { return this.myForm.controls; }

  doRegister(){
    console.log(this.myForm);
    if(this.myForm.invalid){
      return;
    }

    this.router.navigate(['/login']);
    this.authService.register(this.formData['email']. value,this.formData['firstName'].value, this.formData['lastName'].value, this.formData['password'].value)
      .subscribe((response:any) => {
          if(response) {
            this.toastr.clear()
            this.toastr.success("User registered successfully");
          }
        },
        error => {
          this.error = error.error;
        });
  }
  
  login() {
    this.router.navigate(['/login']);
  }
}
