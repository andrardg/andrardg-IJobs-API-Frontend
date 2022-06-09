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
  //companiesList : Array<Company> = [];
  //filterByCompanyId:string = '';
  //jobsList : Array<Job> = []; //for admin to filter by job
  //filterByJobId:string = ''; //for admin
  schedule = new Application(); //for admin to add interviews
  newInterview = new Interview();
  isOnline:string = ''
  seeInterview = new Interview();
  seeApplication = new Application();
  editInterview:boolean = false;
  responseUser:string = '';

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
  //this.formData.append('CV', file, file.name);
  //this.User.cv =  file;
  //console.log(file)
  else{
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () =>{
      this.form.patchValue({cv: reader.result});
      this.CVpreview = this.sanitizer.bypassSecurityTrustResourceUrl(this.form.controls['cv'].value)
    }
  }
}
/*getAllCompanies(){
  this.companiesService.getCompanies().subscribe(data =>{
    this.companiesList = data;
  })
}*/
getAllApplications(){
  this.applicationsService.getApplications().subscribe(data =>{
    this.applicationsList = data;
    if(!this.admin)
      this.applicationsList = this.applicationsList.filter( data => data.userId == this.id);
    this.applications = this.applicationsList;
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
    //this.filterByCompanyId = '';
  });
}
/*
getApplicationsForCompany(){
  console.log(this.filterByCompanyId);
  this.schedule = false;
  if(this.filterByCompanyId == 'All')
    this.applications = this.applicationsList;
  else if(this.filterByCompanyId != '')
    this.applications = this.applicationsList.filter(x => x.job?.companyId == this.filterByCompanyId);
  console.log(this.applications);
}
//for admin
getApplicationsForJob(){
  console.log(this.filterByJobId);
  this.schedule = false;
  if(this.filterByJobId == 'All')
    this.applications = this.applicationsList;
  else if(this.filterByJobId != '')
    this.applications = this.applicationsList.filter(x => x.jobId == this.filterByJobId);
  console.log(this.applications);
}*/
getInterviewsForApplication(id:any){
  this.interviews = this.interviewsList.filter( x => x.applicationId == id);
  console.log(this.interviews);
}/*
getInterviewsForCompany(){
  if(this.filterByCompanyId == 'All')
    this.interviews = this.interviewsList;
  else if(this.filterByCompanyId != '')
    this.interviews = this.interviewsList.filter(x => x.application?.job?.companyId == this.filterByJobId);
}
//for admin
getInterviewsForJob(){
  if(this.filterByJobId == 'All')
    this.interviews = this.interviewsList;
  else if(this.filterByJobId != '')
    this.interviews = this.interviewsList.filter(x => x.application?.jobId == this.filterByJobId);
}*/
//for admin
createInterview(app:any){
  this.newInterview.applicationId = app.id;
  this.newInterview.responseCompany = true;
  this.newInterview.responseUser = false;
  this.interviewsService.createInterview(this.newInterview).subscribe(data=>{
    this.interviews.push(this.newInterview);
    console.log("Created successfully");
    alert("Created sucessfully");
    this.seeInterview.applicationId = '';
    this.getAllInterviews();
    this.scheduleFalse();
    //this.getInterviewsForApplication(app.id);
    if(app.status == 'Pending')
      {
        app.status = 'Interview stage';
        console.log(app);
        this.saveApplication(app);
    }
  },
  error =>{
    console.log(error);
  });
}
//for admin
deleteInterview(id:any){
  if (confirm('Are you sure you want to delete this interview?')) {
    this.interviewsService.removeInterview(id).subscribe(data=>{
    if(this.interviews.length == 1)
      {
        this.seeInterviewFalse();
        this.interviews = [];
      }
    console.log("Deleted sucessfully");
    alert("Deleted sucessfully");
    this.getAllInterviews();
    this.interviews = this.interviews.filter( x=> x.application?.userId != id);
    
  })
  }
  else
  console.log("Delete process cancelled");
}
//for admin
scheduleTrue(row:any){
  this.schedule.id = row.id;
  this.seeApplication.id = '';
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
  if(this.admin){
    this.newInterview.responseCompany = false;
    this.newInterview.responseUser = false;
  }
  else{
    this.newInterview.responseCompany = false;
    this.newInterview.responseUser = true;
  }
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
    var app = this.applicationsList.filter(x => x.id == interview.applicationId)[0];
      this.interviewsList.forEach(element => {
      if(element.applicationId == interview.applicationId)
        this.interviewsService.removeInterview(element.id).subscribe(data=>{
          console.log("Deleted successfully");
          app.status = 'Rejected';
          this.applicationsService.saveApplication(app).subscribe(data =>{
            alert("Application updated successfully");
            console.log("Application updated successfully");
            })
        });
    });
  }
}
saveInterview(){
  delete this.newInterview.application;
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
  this.saveInterview();
}
seeApplicationTrue(id:any){
  this.seeApplication.id = id;
}
seeApplicationFalse(){
  this.seeApplication.id = '';
}
saveApplication(app:any){
  this.applicationsService.saveApplication(app).subscribe(data =>{
    console.log('Application status updated successfully');
    alert('Application status updated successfully');
    this.seeApplicationFalse();
    this.seeApplication.id = '';
  },
  error =>{
    console.log(error);
  })
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
}
