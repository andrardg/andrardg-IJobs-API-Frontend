import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { UsersService } from '../users.service';
import * as bcrypt from 'bcryptjs'

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  User:any;
  admin = sessionStorage.getItem('Admin');
  public id: any; 
  public hide: boolean = true; //for the password
  public form: FormGroup = new FormGroup({
                firstName: new FormControl('', [Validators.required]),
                lastName: new FormControl('', [Validators.required]),
                email: new FormControl('', [Validators.required, Validators.email]),
                oldpassword: new FormControl(''),
                newpassword: new FormControl(''),
                newpassword2: new FormControl(''),
              });
  public oldpasswordHash:string="";
  public oldpasswordTyped:string="";
  public newpassword:string="";
  public newpassword2:string="";

  public section:any = 0;
  public error: boolean | string = false;
  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private service: UsersService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.id = params['id'];
      console.log(this.id);
    });

    this.getUserDetails(this.id); 
  }
getUserDetails(id:any){
  this.service.getUserDetails(id).subscribe(data=>{
    this.User = data;
    console.log(data);
  })
}
password() {
  this.hide = !this.hide;
}
save(){
  if(this.form.invalid)
  this.error = "You have invalid fields."
  else{
    this.error = "";
  this.User.firstName = this.form.controls['firstName'].value;
  this.User.lastName = this.form.controls['lastName'].value;
  this.User.email = this.form.controls['email'].value;
  this.User.oldPasswordHash = this.oldpasswordHash;
  this.oldpasswordTyped = this.form.controls['oldpassword'].value;
  this.newpassword = this.form.controls['newpassword'].value;
  this.newpassword2 = this.form.controls['newpassword2'].value;
  
  if(this.section == 2){

    if(this.newpassword && this.newpassword2 && this.oldpasswordTyped){
      if(this.newpassword == this.newpassword2)
        {if(bcrypt.compareSync(this.oldpasswordTyped, this.oldpasswordHash))
          this.User.password = this.newpassword;
        else{
          this.error = "Old password incorrect."}}
        else
          this.error = "The new password fields must match."
    }else 
      this.error = "All password fields must be filled."
  }
  else
  this.User.password = this.oldpasswordHash;
  console.log(this.User);

  if(!this.error){
    this.service.saveUser(this.User).subscribe((data)=>{
    console.log("Update successful");
    this.section = 0;
    },
      error => {
        this.error="Email already taken";
      }
    );
  }
  else
  console.log(this.error);
  }
  this.form.patchValue({oldpassword: ""});
  this.form.patchValue({newpassword: ""});
  this.form.patchValue({newpassword2: ""});
  
}
logout() {
  this.authService.logout();
}
sectionOne(){
  this.cancel();
  this.section = 1;
}
sectionTwo(){
  this.cancel();
  this.section = 2;
}
cancel(){
  this.getUserDetails(this.id);
  this.section = 0;
  this.error = "";
  this.form.patchValue({firstName: this.User.firstName});
  this.form.patchValue({lastName: this.User.lastName});
  this.form.patchValue({email: this.User.email});
  this.oldpasswordHash = this.User.passwordHash;
  this.form.patchValue({oldpassword: ""});
  this.form.patchValue({newpassword: ""});
  this.form.patchValue({newpassword2: ""});
}
removeUser(id:any){
  console.log(id);
  if (confirm('Are you sure you want to delete this account?')) {
    this.service.removeUser(id).subscribe((data)=>{
      console.log("success");
    });
    this.router.navigate(['/dashboard']);
  } else {
    // Do nothing!
    console.log('Not deleted');
  }
  }
}
