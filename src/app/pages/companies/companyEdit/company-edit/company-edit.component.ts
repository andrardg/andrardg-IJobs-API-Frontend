import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y/input-modality/input-modality-detector';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { CompaniesService } from '../../../../services/companies.service';
import * as bcrypt from 'bcryptjs'
import { JobsComponent } from 'app/pages/jobs/jobs.component';
import { JobsService } from 'app/services/jobs.service';
import { PreviousRouteService } from 'app/services/previous-route.service';
import { Company } from 'app/classes/company';
import { ApplicationService } from 'app/services/application.service';
import { InterviewService } from 'app/services/interview.service';
import { Application } from 'app/classes/application';
import { Interview } from 'app/classes/interview';
import { DomSanitizer } from '@angular/platform-browser';
import { Job } from 'app/classes/job';
import { FileService } from 'app/services/file.service';
import { User } from 'app/classes/user';
import { InviteService } from 'app/services/invite.service';
import { Invite } from 'app/classes/invite';

@Component({
  selector: 'app-company-edit',
  templateUrl: './company-edit.component.html',
  styleUrls: ['./company-edit.component.scss']
})
export class CompanyEditComponent implements OnInit {

  Company = new Company;
  admin = sessionStorage.getItem('Admin');
  comp = sessionStorage.getItem('Company');
  jobSection = 1;
  public id: any; 
  public hide: boolean = true; //for the password
  public form: FormGroup = new FormGroup({
                name: new FormControl('', [Validators.required]),
                photo: new FormControl(''),
                email: new FormControl('', [Validators.required, Validators.email]),
                oldpassword: new FormControl(''),
                newpassword: new FormControl('', [Validators.minLength(8)]),
                newpassword2: new FormControl('',[Validators.minLength(8)]),
                address: new FormControl(''),
                description: new FormControl(''),
                verifiedAccount: new FormControl(''),
              });
  public oldpasswordHash:string="";
  public section:any = 0;
  public error: boolean | string = false;
  Verified:any=["Yes", "No"];
  public formData= new FormData();
  showPrevious: boolean = false;

  isOnline:string = '';
  editInterview : boolean = false;
  jobs:any;
  work:any;

  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private service: CompaniesService,
    private authService: AuthService,
    private applicationsService : ApplicationService,
    private jobsService : JobsService,
    private invitesService : InviteService,
    private previousRouteService: PreviousRouteService,) { }

  ngOnInit(): void {
    sessionStorage.removeItem('jobId');
    sessionStorage.removeItem('companyId');
    this.activatedRoute.params.subscribe((params: any) => {
      this.id = params['id'];
      console.log(this.id);
    });
    if(this.previousRouteService.getPreviousUrl() != '/profile')
      this.showPrevious = true;
    this.getCompanyDetails(this.id); 
  }
  getJobDetails(id: any){
    console.log(id);
    this.router.navigate(['/jobs', id]);
  }
  getUserDetails(id: any){
    console.log(id);
    this.router.navigate(['/users', id]);
  }
  getCompanyDetails(id:any){
    this.service.getCompanyDetails(id).subscribe(data=>{
      this.Company=data;
      this.jobs = this.Company.jobs.filter( x=> x.workType == false)
      this.work = this.Company.jobs.filter( x=> x.workType == true)
      console.log(data);
      this.oldpasswordHash = data.passwordHash;
    });
  }
  goBack(id: any){
    let previous = this.previousRouteService.getPreviousUrl();
    console.log(previous);
    if(previous)
      //this.previousRouteService.router.navigateByUrl(previous);
    this.router.navigate([previous]);
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
  deleteApplications(){
    this.applicationsService.getApplications().subscribe(data =>{
      var aps : Array<Application> = [];
      aps = data;
      aps = aps.filter(x => x.job?.companyId == this.id);
      aps.forEach(element => {
        this.applicationsService.removeApplication(element.id).subscribe(data=>{
          console.log("Application deleted successfully");
        })
      });
    });
  }
  deleteInvites(){
    this.invitesService.getInvites().subscribe(data =>{
      var inv : Array<Invite> = [];
      inv = data;
      inv = inv.filter(x => x.job?.companyId == this.id);
      inv.forEach(element => {
        this.invitesService.removeInvite(element.id).subscribe(data=>{
          console.log("Invite deleted successfully");
        })
      });
    });
  }
  jobNotOpen(){
    this.Company.jobs.forEach(element => {
      element.open = false;
      delete element.company;
      delete element.invites;
      delete element.user;
      delete element.userId;
      delete element.subdomain;
      this.jobsService.saveJob(element).subscribe(data=>{
        console.log("Job updated successfully");
      })
    });
  }
  save(){
    console.log(this.form.controls['newpassword'].value, this.form.controls['newpassword2'].value)
    if(this.form.invalid){
      if(this.section == 1)
      this.error = "You cannot save an empty company name.";
      else if(this.section == 2)
        if(this.form.controls['email'].invalid)
          this.error = 'The email has wrong format.';
        else
          this.error = "All passwords must have at least 8 characters.";

    }
    else{
      this.error = "";

    //fetch back data
    this.formData.append('Id', this.id);
    var words = this.form.controls['name'].value.split(" ");
    for(var i=0 ; i<words.length ;i++)
      words[i]= words[i][0].toUpperCase()+words[i].substring(1);
    words = words.join(" ");
    if(this.Company.name != words && this.comp)
      this.authService.name.next(words);
    this.formData.set('Name', words);
    if(this.form.controls['description'].value)
      this.formData.set('Description', this.form.controls['description'].value[0].toUpperCase() + this.form.controls['description'].value.slice(1));
    else
      this.formData.set('Description', '');

    if(this.form.controls['address'].value){
      var words = this.form.controls['address'].value.split(" ");
      for(var i=0 ; i<words.length ;i++)
        words[i]= words[i][0].toUpperCase()+words[i].substring(1);
      words = words.join(" ");
      this.formData.set('Address', words);
    }
    else
      this.formData.set('Address', '');
    this.formData.set('Email', this.form.controls['email'].value);
    this.formData.set('OldPasswordHash', this.oldpasswordHash);
    if(this.admin && this.form.controls['verifiedAccount'].value == "Yes")
    {
      this.formData.set('VerifiedAccount', "true");
      this.formData.set('Role', "2");
    }
    else if(this.admin)
    {
      this.formData.set('VerifiedAccount', "false");
      this.formData.set('Role', "1");
    }
    else{
      this.formData.set('VerifiedAccount', String(this.Company.verifiedAccount));
      this.formData.set('Role', this.Company.role!);
    }

    if(this.form.controls['photo'].value != "../../../assets/images/companyProfilePhoto.png") //photo exists
        this.formData.set('Photo', this.form.controls['photo'].value);
    else
      this.formData.set('Photo', '');
        
    if(this.section == 2){
      if(!this.admin){
        if(this.form.controls['newpassword'].value && this.form.controls['newpassword2'].value && this.form.controls['oldpassword'].value)
          {
            if(this.form.controls['newpassword'].value == this.form.controls['newpassword2'].value)
              {
              if(bcrypt.compareSync(this.form.controls['oldpassword'].value, this.oldpasswordHash))
                this.formData.set('password', this.form.controls['newpassword'].value);
              else{
                this.error = "Old password incorrect."}}
            else
              this.error = "The new password fields must match."
          }
          else 
            this.error = "All password fields must be filled."
          }
      else{
        if(this.form.controls['newpassword'].value && this.form.controls['newpassword2'].value)
        {
          if(this.form.controls['newpassword'].value == this.form.controls['newpassword2'].value)
            this.formData.set('password', this.form.controls['newpassword'].value);
          else
            this.error = "The new password fields must match."
        }
        else
        this.error = "All fields must be filled."
      }
    }
    else
    {
      this.formData.set('Password', this.oldpasswordHash);
      this.formData.set('OldPasswordHash', this.oldpasswordHash);
    }

    if(!this.error){
      this.service.saveCompany(this.id, this.formData).subscribe((data)=>{
      console.log("Updated successfully");

      if(this.formData.get('VerifiedAccount') == 'false' && this.formData.get('VerifiedAccount') != String(this.Company.verifiedAccount)){
        this.deleteApplications();
        this.deleteInvites();
        this.jobNotOpen();
      }

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
  }
  jobSectionOne(){
    this.jobSection = 1;
  }
  jobSectionTwo(){
    this.jobSection = 2;
  }
  create() {
    this.router.navigate(['/jobs/create']);
  }
  cancel(){
    this.getCompanyDetails(this.id);
    this.formData.delete;
    this.editInterview = false;
    this.section = 0;
    this.error = "";
    this.form.patchValue({name: this.Company.name});
    this.form.patchValue({email: this.Company.email});
    this.form.patchValue({oldpassword: ""});
    this.form.patchValue({newpassword: ""});
    this.form.patchValue({newpassword2: ""});
    this.form.patchValue({address: this.Company.address});
    this.form.patchValue({description: this.Company.description});
    if(this.Company.verifiedAccount == true)
      this.form.patchValue({verifiedAccount: "Yes"});
    else
      this.form.patchValue({verifiedAccount: "No"});
    if(this.Company.photo){
      this.form.patchValue({photo: this.Company.photo});
    }
    else
      this.form.patchValue({photo: "../../../assets/images/companyProfilePhoto.png"});
  }
  removeCompany(id:any){
    console.log(id);
    if (confirm('Are you sure you want to delete this account?')) {
      this.service.removeCompany(id).subscribe((data)=>{
        console.log("success");
        if(!this.admin)
          this.logout();
        else
          this.router.navigate(['/dashboard']);
      });
    } else {
      // Do nothing!
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
deletePhoto(){
  this.form.patchValue({photo: "../../../assets/images/companyProfilePhoto.png"});
}

}
