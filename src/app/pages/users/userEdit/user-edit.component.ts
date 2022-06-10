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
                oldpassword: new FormControl(''),
                newpassword: new FormControl(''),
                newpassword2: new FormControl(''),
              });
  public oldpasswordHash:string="";
  public formData= new FormData();
  public section:any = 0;
  public error: boolean | string = false;

  applicationsList : Array<Application> = [];
  applications : Array<Application> = [];
  interviewsList : Array<Interview> = [];
  interviews : Array<Interview> = [];
  schedule = new Application(); //for admin to add interviews
  newInterview = new Interview();
  isOnline:string = ''
  seeInterview = new Interview();
  seeApplication = new Application();
  editInterview:boolean = false;
  responseUser:string = '';
  seeRejected: boolean = false;

  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private service: UsersService,
    private authService: AuthService,
    private sanitizer: DomSanitizer,
    private applicationsService: ApplicationService,
    private interviewsService: InterviewService,
    private companiesService: CompaniesService) { }

  ngOnInit(): void {
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
  {this.error = "You have invalid fields."; console.log(this.form);
  console.log(this.error);}
  else{
    this.error = "";
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
    {
      this.formData.append('Photo', this.form.controls['photo'].value);
    }
    if(this.form.controls['cv'].value !=null){
    this.formData.append('CV', this.form.controls['cv'].value);
    }
  
  
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
      if(this.form.controls['newpassword'].value)
        this.formData.append('password', this.form.controls['newpassword'].value);
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
  this.getAllApplications();
  this.getAllInterviews();
  this.section = 4;
}
sectionFive(){
  this.cancel();
  this.getAllInterviews();
  this.section = 5;
}
cancel(){
  this.getUserDetails(this.id);
  this.formData.delete;
  this.editInterview = false;
  this.newInterview = new Interview();
  this.scheduleFalse();
  this.seeApplicationFalse();
  this.seeRejected = false;
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
      alert('Deleted successfully');
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
  console.log(file);
  if(file.type != 'image/jpg' && file.type != 'image/jpeg' &&file.type != 'image/png' &&file.type != 'image/gif')
    this.error = 'You can only upload .jpg, .jpeg, .png and .gif files for your profile photo.';
  else
    {
      this.error = '';
      console.log(file);
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () =>{ 
      this.form.patchValue({photo: reader.result});
    }
  }
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
      this.CVpreview = this.sanitizer.bypassSecurityTrustResourceUrl(this.form.controls['cv'].value)
    }
  }
}
getAllApplications(){
  this.applicationsService.getApplications().subscribe(data =>{
    this.applicationsList = data;
    if(!this.admin)
      this.applicationsList = this.applicationsList.filter( data => data.userId == this.id);
      this.applications = this.applicationsList.filter( x => x.status != 'Rejected');
    console.log(this.applicationsList);
  });
}
getAllInterviews(){
  this.interviewsService.getInterviews().subscribe(data =>{
    this.interviewsList = data;
    if(!this.admin)
      this.interviewsList = this.interviewsList.filter( data => data.application!.userId == this.id);
      
    if(this.newInterview.applicationId != '')
      this.interviews = this.interviewsList.filter(x => x.applicationId == this.newInterview.applicationId);
    else
      this.interviews = this.interviewsList;
    console.log(this.interviews);
  });
}

getInterviewsForApplication(id:any){
  this.interviews = this.interviewsList.filter( x => x.applicationId == id);
  console.log(this.interviews);
}
//for admin
createInterview(app:any){
  this.newInterview.applicationId = app.id;
  this.newInterview.responseCompany = false;
  this.newInterview.responseUser = false;
  this.interviewsService.createInterview(this.newInterview).subscribe(data=>{
    app.interviews.push(this.newInterview);
    console.log("Created successfully");
    alert("Created sucessfully");
    this.seeInterview.applicationId = '';
    this.getAllInterviews();
    this.scheduleFalse();
    if(app.status == 'Pending')
      {
        app.status = 'Interview stage';
        this.saveApplication(app);
    }
  },
  error =>{
    console.log(error);
  });
}
//for admin
deleteInterview(interview:any){
  if (confirm('Are you sure you want to delete this interview?')) {
    this.interviewsService.removeInterview(interview.id).subscribe(data=>{
      this.getAllApplications();
      this.seeInterviewFalse();
      console.log("Deleted sucessfully");
      alert("Deleted sucessfully");
      this.interviews = this.interviews.filter( x=> x.id != interview.id);
    })
  }
  else
  console.log("Delete process cancelled");
}
//for admin
scheduleTrue(row:any){
  this.schedule.id = row.id;
  this.seeApplication.id = ''; //stop editing app if i press schedule interview
  this.newInterview.date = new Date();
}
//for admin
scheduleFalse(){
  this.schedule.id = '';
  this.newInterview = new Interview();
}
//for admin
convertIsOnline(){
  if(this.isOnline == 'Online')
    this.newInterview.isOnline = true;
  else
  this.newInterview.isOnline = false;
}
seeInterviewTrue(app:any){
  this.seeInterview.applicationId = app.id;
  this.interviews = this.interviewsList.filter(x => x.applicationId == app.id);
  console.log(this.interviews);
}
seeInterviewFalse(){
  this.seeInterview.applicationId = '';
}
editInterviewTrue(intv:any){
  this.editInterview = true;
  this.newInterview = intv;
  if(intv.isOnline == true)
    this.isOnline = 'Online';
  else
    this.isOnline = 'In person';
}
editInterviewFalse(){
  this.editInterview = false;
}
rejectInterview(interview:any){
  if (confirm('By confirming, all of your interview for this job will be deleted and your application will be marked as rejected. Are you sure?')) {
    var app = interview.application;
    app.status = 'Rejected';
    this.interviews = this.interviewsList;
    delete app.job;
    delete app.user;
    this.applicationsService.saveApplication(app).subscribe(data =>{
      alert("Application marked as rejected");
      console.log("Application marked as rejected");
    })
  }
}
saveInterview(){
  delete this.newInterview.application;
  this.newInterview.responseCompany = false;
  if(this.admin)
    this.newInterview.responseUser = false;
  else
    this.newInterview.responseUser = true;
  console.log(this.newInterview);
  this.interviewsService.saveInterview(this.newInterview).subscribe(data=>{
    console.log("Updated sucessfully");
    alert("Updated sucessfully");
    this.newInterview = new Interview();
    this.getAllInterviews();
    this.editInterviewFalse();
  })
}
confirm(interview:any){
  this.newInterview = interview;
  this.newInterview.responseUser = true;
  delete this.newInterview.application;
  this.interviewsService.saveInterview(this.newInterview).subscribe(data=>{
    console.log("Updated sucessfully");
    alert("Updated sucessfully");
    this.newInterview = new Interview();
    this.getAllInterviews();
    this.editInterviewFalse();
  })
}
seeApplicationTrue(app:any){
  this.scheduleFalse();
  this.seeApplication.id = app.id;
  this.seeApplication.status = app.status;
}
seeApplicationFalse(){
  this.seeApplication.id = '';
}
saveApplication(app:any){
  delete app.interviews;
  delete app.job;
  delete app.user;
  var keepGoing = true;
  app.status = this.seeApplication.status;
  if(app.status == 'Rejected')
    if(!confirm('Are you sure you want to mark the application as rejected? All the interviews will be deleted.')){
      keepGoing = false;
      alert("The process has been stopped");
    }
  if(keepGoing == true){
    this.applicationsService.saveApplication(app).subscribe(data =>{
      console.log('Application status updated successfully');
      alert('Application status updated successfully');
      this.seeApplicationFalse();
    this.getAllApplications();
    },
    error =>{
      console.log(error);
    })
  }
}
getSafeUrl(file:string){
  return this.sanitizer.bypassSecurityTrustResourceUrl(file);
}
getJobDetails(id: any){
  console.log(id);
  this.router.navigate(['/jobs', id]);
}
getCompanyDetails(id: any){
  console.log(id);
  this.router.navigate(['/companies', id]);
}
toggleSeeRejected(event:any){
  if(this.seeRejected == false && event.pointerId == 1)
    {
      this.seeRejected = true;
      this.applications = this.applicationsList.filter( x => x.status == 'Rejected');
    }
  else if(event.pointerId == 1)
  {
    this.seeRejected = false;
    this.applications = this.applicationsList.filter( x => x.status != 'Rejected');
  }
}
}
