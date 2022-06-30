import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { UsersService } from '../../../services/users.service';
import * as bcrypt from 'bcryptjs'
import { DomSanitizer } from '@angular/platform-browser';
import { User } from 'app/classes/user';
import { ApplicationService } from 'app/services/application.service';
import { InterviewService } from 'app/services/interview.service';
import { Application } from 'app/classes/application';
import { Interview } from 'app/classes/interview';
import { Company } from 'app/classes/company';
import { Job } from 'app/classes/job';
import { CompaniesService } from 'app/services/companies.service';
import { FileService } from 'app/services/file.service';
import { Domain } from 'app/classes/domain';
import { Subdomain } from 'app/classes/subdomain';
import { DomainService } from 'app/services/domain.service';
import { ContactService } from 'app/services/contact.service';
import { Contact } from 'app/classes/contact';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.scss']
})
export class UserEditComponent implements OnInit {
  User = new User();
  noCV: boolean = false;
  public id: any; 
  CVpreview :any;
  admin:any;

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
                oldpassword: new FormControl('', [Validators.minLength(8)]),
                newpassword: new FormControl('', [Validators.minLength(8)]),
                newpassword2: new FormControl('', [Validators.minLength(8)]),
              });
  public oldpasswordHash:string="";
  public formData= new FormData();
  public section:any = 0;
  public error: boolean | string = false;
  ContactList: Array<Contact> = [];
  Contacts: Array<Contact> = [];
  filterResolved: boolean = false;
  updateContact = new Contact();
  seeMore:boolean = false;

  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private service: UsersService,
    private authService: AuthService,
    private fileService: FileService,
    private contactService: ContactService) { }

  ngOnInit(): void {
    sessionStorage.removeItem('jobId');
    sessionStorage.removeItem('companyId');
    this.activatedRoute.params.subscribe((params: any) => {
      this.id = params['id'];
      console.log(this.id);  
    });
    if(sessionStorage.getItem('Admin'))
      this.admin = JSON.parse(sessionStorage.getItem('Admin') || "");
    this.getUserDetails(this.id);
  }
getUserDetails(id:any){
  this.service.getUserDetails(id).subscribe(data=>{
    console.log(data);
    this.User = data;
    this.CVpreview = data.cv;
    this.oldpasswordHash = data.passwordHash;
    this.formData.append('Role', data.role);
  })
}
goToProfile(id:any){
  this.router.navigate(['/users',id]);
}
save2(event:any){
  if (event.keyCode == 13)
    {
      this.save();
  }
}
save(){
  if(this.form.invalid || this.error)
  {
    this.error = "You have invalid fields.";
    console.log(this.error);
  }
  else{
    this.error = "";

  if(this.User.firstName != this.form.controls['firstName'].value.charAt(0).toUpperCase() + this.form.controls['firstName'].value.slice(1))
    if((this.admin && this.admin.id == this.id) || (sessionStorage.getItem('User') && JSON.parse(sessionStorage.getItem('User') || "")))
      this.authService.name.next(this.form.controls['firstName'].value.charAt(0).toUpperCase() + this.form.controls['firstName'].value.slice(1));
  //fetch data back
  this.formData.append('Id', this.id);
  this.formData.append('FirstName', this.form.controls['firstName'].value.charAt(0).toUpperCase() + this.form.controls['firstName'].value.slice(1));
  this.formData.append('LastName', this.form.controls['lastName'].value.charAt(0).toUpperCase() + this.form.controls['lastName'].value.slice(1));
  if(this.form.controls['occupation'].value)
    this.formData.append('Occupation', this.form.controls['occupation'].value.charAt(0).toUpperCase() + this.form.controls['occupation'].value.slice(1));
  if(this.form.controls['residence'].value)
    this.formData.append('Residence', this.form.controls['residence'].value.charAt(0).toUpperCase() + this.form.controls['residence'].value.slice(1));
  if(this.form.controls['studies'].value)
    this.formData.append('Studies', this.form.controls['studies'].value.charAt(0).toUpperCase() + this.form.controls['studies'].value.slice(1));
  this.formData.append('Email', this.form.controls['email'].value);
  this.formData.append('OldPasswordHash', this.oldpasswordHash);

  if(this.form.controls['photo'].value != "../../../assets/images/profilePhoto.png") //photo exists
      this.formData.set('Photo', this.form.controls['photo'].value);
  else
    this.formData.set('Photo', '');
  if(this.CVpreview != '' && this.CVpreview != null)
    this.formData.set('CV', this.CVpreview);
  else
    this.formData.set('CV', '');
  
  
  if(this.section == 3){
    if(!this.admin || this.User.id == this.admin.id){
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
    else if(this.admin){
      if(this.form.controls['newpassword'].value && this.form.controls['newpassword2'].value){
        if(this.form.controls['newpassword'].value == this.form.controls['newpassword2'].value)
          this.formData.append('password', this.form.controls['newpassword'].value);
          else
            this.error = "The new password fields must match."
      }
      else
      this.error = "All fields must be filled."
    }
  }
  else
  {
    this.formData.append('Password', this.oldpasswordHash);
    this.formData.append('OldPasswordHash', this.oldpasswordHash);
  }
  if(!this.error){
    this.service.saveUser(this.id, this.formData).subscribe((data)=>{
    console.log("Updated successfully");
    this.cancel();
    alert("Updated successully");
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
sectionFour(){
  this.cancel();
  this.section = 4;
}
sectionFive(){
  this.cancel();
  this.section = 5;
}
sectionSix(){
  this.cancel();
  this.section = 6;
}
sectionSeven(){
  this.cancel();
  this.section = 7;
}
sectionEight(){
  this.cancel();
  this.section = 8;
  this.getContacts();
}
cancel(){
  this.getUserDetails(this.id);
  this.updateContact = new Contact();
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
    var file = this.User.cv;
    this.form.patchValue({cv: this.User.cv});
    this.CVpreview = file
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
      alert('Deleted successfully');
      if(!this.admin)
        this.logout();
      else
        this.router.navigate(['/dashboard']);
    });
  } else {
    console.log('Not deleted');
  }
}

onPhotoChanged(event:any){
  var file: File;
  file = <File>event.target.files[0];
  if(file.type != 'image/jpg' && file.type != 'image/jpeg' &&file.type != 'image/png' &&file.type != 'image/gif')
    this.error = 'You can only upload .jpg, .jpeg, .png and .gif files for your profile photo.';
  else
    {
      this.error = '';
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () =>{ 
      this.form.patchValue({photo: reader.result});
    }
  }
}
deletePhoto(){
  this.form.patchValue({photo: "../../../assets/images/profilePhoto.png"});
}
onCvChanged(event:any){
  var file: File;
  file = <File>event.target.files[0];
  if(file.type != 'application/pdf')
    this.error = 'You can only upload .pdf files for your CV.';
  else{
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () =>{
      this.form.patchValue({cv: reader.result});
      this.CVpreview = this.form.controls['cv'].value;
    }
  }
}
deleteCV(){
  this.form.patchValue({cv: ''});
  this.CVpreview = '';
}

getSafeUrl(file:string){
  return this.fileService.getSafeUrl(file);
}
getJobDetails(id: any){
  console.log(id);
  this.router.navigate(['/work', id]);
}
getCompanyDetails(id: any){
  console.log(id);
  this.router.navigate(['/companies', id]);
}

getCV(cv: any){
  this.fileService.getPdf(cv);
}
downloadCV(cv: any){
  this.fileService.downloadPdf(cv, this.User.firstName + '-' + this.User.lastName + '-' + 'CV')
}
getContacts(){
  this.contactService.getContacts().subscribe(data=>{
    this.ContactList = data;
    if(this.filterResolved == false)
      this.Contacts = this.ContactList.filter( x=> x.resolved == false)
    else
      this.Contacts = this.ContactList.filter( x=> x.resolved == true)
    
    let textRow= this.Contacts[0].message.split('\n');
    console.log(this.Contacts);
    console.log(textRow);
  })
}
removeContact(id:any){
  this.contactService.removeContact(id).subscribe(data=>{
    console.log("Deleted successfully");
    this.getContacts();
    alert("Deleted successfully");
  })
}
changeResolved(row:any){
  if(row.resolved == true)
    row.resolved = false;
  else
    row.resolved = true;
  this.contactService.saveContact(row).subscribe(data=>{
    console.log("Updated successfully");
    this.getContacts();
    if(row.resolved == true)
      alert("Successfully marked as resolved");
    else
      alert("Successfully marked as unresolved");
  })
}
filter(){
  if(this.filterResolved == true)
    this.Contacts = this.ContactList.filter( x=> x.resolved == true);
  else
    this.Contacts = this.ContactList.filter( x=> x.resolved == false);
}
}
