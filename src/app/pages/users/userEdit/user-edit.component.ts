import { Component, OnInit } from '@angular/core';
import { AnyForUntypedForms, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { UsersService } from '../../../services/users.service';
import * as bcrypt from 'bcryptjs'
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, Subscriber } from 'rxjs';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  User:any;
  admin = sessionStorage.getItem('Admin');
  noCV: boolean = false;
  public id: any; 
  CVpreview :any;

  public hide: boolean = true; //for the password
  form: FormGroup = new FormGroup({
                firstName: new FormControl('', [Validators.required]),
                lastName: new FormControl('', [Validators.required]),
                occupation: new FormControl(''),
                residence: new FormControl(''),
                studies: new FormControl(''),
                photo: new FormControl(''),
                cv: new FormControl(''),
                email: new FormControl('', [Validators.required, Validators.email]),
                oldpassword: new FormControl(''),
                newpassword: new FormControl(''),
                newpassword2: new FormControl(''),
              });
  public oldpasswordHash:string="";
  public formData= new FormData();
  public section:any = 0;
  public error: boolean | string = false;

  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private service: UsersService,
    private authService: AuthService,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.id = params['id'];
      console.log(this.id);
    });
    this.getUserDetails(this.id);
  }

getUserDetails(id:any){
  this.service.getUserDetails(id).subscribe(data=>{
    console.log(data);
    this.User = data;
    this.oldpasswordHash = data.passwordHash;
    /*if(data.photofile != null && data.photofile.length > 0){
      this.photoaux =this.sanitizer.bypassSecurityTrustUrl('data:image/jpeg;base64,'+data.photofile);
      console.log(this.photoaux);

      const observable = new Observable((subscriber:Subscriber<any>) =>{
        const reader = new FileReader();
        const blob = new Blob([data.photofile], {type: "image/png"});
        //const imageUrl = URL.createObjectURL(blob);
        //this.photo2 = this.sanitizer.bypassSecurityTrustUrl(imageUrl);
        //console.log(this.photo2);
        reader.readAsDataURL(blob);
        reader.onloadend = function(){
          subscriber.next(reader.result);
          subscriber.complete();
        }
      });
      observable.subscribe( file =>{
        this.photo = file;
        this.User.photoFile = file;
        console.log(this.photo);
      });*/
      /*    var img:any;
    const blob = new Blob([data.photofile], {type: "image/png"});
    const reader = new FileReader();
    reader.onload = function(){
    photo = reader.result
    console.log(img); //long text
    }
    reader.readAsDataURL(blob);

    this.photo = img;
    console.log(img); */
    
    //console.log(this.User.photoFile);}
    //if(data.photo !=null){
    //  var url = URL.createObjectURL(new Blob([data.photo], {type: 'png'}));
      //var photo = new File([this.base64ToArrayBuffer(data.photo)], 'Photo', { type: 'png'});
    //console.log(url);
    //}
    
    //console.log(this.photo);
  })
}

password() {
  this.hide = !this.hide;
}
save2(event:any){
  if (event.keyCode == 13)
    {
      this.save();
  }
}
save(){
  if(this.form.invalid)
  {this.error = "You have invalid fields."; console.log(this.form);
  console.log(this.error);}
  else{
    this.error = "";

  //fetch data back
   this.formData.append('Id', this.id);
   this.formData.append('FirstName', this.form.controls['firstName'].value);
   this.formData.append('LastName', this.form.controls['lastName'].value);
   this.formData.append('Occupation', this.form.controls['occupation'].value);
   this.formData.append('Residence', this.form.controls['residence'].value);
   this.formData.append('Studies', this.form.controls['studies'].value);
   this.formData.append('Email', this.form.controls['email'].value);
   this.formData.append('OldPasswordHash', this.oldpasswordHash);
   if(this.form.controls['photo'].value != "../../../assets/images/profilePhoto.png") //photo exists
    {
      this.formData.append('Photo', this.form.controls['photo'].value);
    }
    if(this.form.controls['cv'].value !=null){
    this.formData.append('CV', this.form.controls['cv'].value);
    }
  
  
  if(this.section == 3){

    if(this.form.controls['newpassword'].value && this.form.controls['newpassword2'].value && this.form.controls['oldpassword'].value)
    {
      if(this.form.controls['newpassword'].value == this.form.controls['newpassword2'].value)
        {
          if(bcrypt.compareSync(this.form.controls['oldpassword'].value, this.oldpasswordHash))
            this.formData.append('password', this.form.controls['newpassword'].value);
          else{
            this.error = "Old password incorrect."}}
      else
        this.error = "The new password fields must match."
    }
    else 
      this.error = "All password fields must be filled."
  }
  else
  {
    this.formData.append('Password', this.oldpasswordHash);
    this.formData.append('OldPasswordHash', this.oldpasswordHash);
  }

  if(!this.error){
    this.service.saveUser(this.id, this.formData).subscribe((data)=>{
    console.log("Update successful");
    this.cancel();
    alert("Update successul");
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
sectionThree(){
  this.cancel();
  this.section = 3;
}
cancel(){
  this.getUserDetails(this.id);
  this.formData.delete;
  this.section = 0;
  this.error = "";
  this.form.patchValue({firstName: this.User.firstName});
  this.form.patchValue({lastName: this.User.lastName});
  this.form.patchValue({occupation: this.User.occupation});
  this.form.patchValue({residence: this.User.residence});
  this.form.patchValue({studies: this.User.studies});


  if(this.User.photo){
    this.form.patchValue({photo: this.User.photo});
  }
  else
  this.form.patchValue({photo: "../../../assets/images/profilePhoto.png"});

  if(this.User.cv){
    var file = this.User.cv;//.split(',')[1];
    //file = "data:image/png;base64,".concat(file);
    this.form.patchValue({cv: this.User.cv});
    this.CVpreview = this.sanitizer.bypassSecurityTrustResourceUrl(file);
  }
  else
    this.noCV = true;
  
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
      this.logout();
    });
    this.router.navigate(['/dashboard']);
  } else {
    console.log('Not deleted');
  }
  }

  onPhotoChanged(event:any){
  var file: File;
  file = <File>event.target.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () =>{ 
    this.form.patchValue({photo: reader.result});
  }
}
onCvChanged(event:any){

  var file: File;
  file = <File>event.target.files[0];
  //this.formData.append('CV', file, file.name);
  //this.User.cv =  file;
  //console.log(file)

const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () =>{
    this.form.patchValue({cv: reader.result});
    this.CVpreview = this.sanitizer.bypassSecurityTrustResourceUrl(this.form.controls['cv'].value)
  }
}
}
