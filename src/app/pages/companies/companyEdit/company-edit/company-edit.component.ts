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

@Component({
  selector: 'app-company-edit',
  templateUrl: './company-edit.component.html',
  styleUrls: ['./company-edit.component.scss']
})
export class CompanyEditComponent implements OnInit {

  Company:any;
  admin = sessionStorage.getItem('Admin');
  public id: any; 
  public hide: boolean = true; //for the password
  public form: FormGroup = new FormGroup({
                name: new FormControl('', [Validators.required]),
                photo: new FormControl(''),
                email: new FormControl('', [Validators.required, Validators.email]),
                oldpassword: new FormControl(''),
                newpassword: new FormControl(''),
                newpassword2: new FormControl(''),
                address: new FormControl('', [Validators.required]),
                description: new FormControl('', [Validators.required]),
                verifiedAccount: new FormControl(''),
              });
  public oldpasswordHash:string="";
  public section:any = 0;
  public error: boolean | string = false;
  Verified:any=["Yes", "No"];
  public formData= new FormData();

  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private service: CompaniesService,
    private authService: AuthService,
    private jobsService: JobsService,
    private previousRouteService: PreviousRouteService) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe((params: any) => {
      this.id = params['id'];
      console.log(this.id);
    });
    this.getCompanyDetails(this.id); 
  }
  getJobDetails(id: any){
    console.log(id);
    this.router.navigate(['/jobs', id]);
  }
  getCompanyDetails(id:any){
    this.service.getCompanyDetails(id).subscribe(data=>{
      this.Company=data;
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
  save(){
    if(this.form.invalid || this.error)
    this.error = "You have invalid fields."
    else{
      this.error = "";

    //fetch back data
    this.formData.append('Id', this.id);
    this.formData.append('Name', this.form.controls['name'].value.charAt(0).toUpperCase() + this.form.controls['name'].value.slice(1));
    this.formData.append('Email', this.form.controls['email'].value);
    this.formData.append('Description', this.form.controls['description'].value.charAt(0).toUpperCase() + this.form.controls['description'].value.slice(1));
    this.formData.append('Address', this.form.controls['address'].value.charAt(0).toUpperCase() + this.form.controls['address'].value.slice(1));
    this.formData.append('Email', this.form.controls['email'].value);
    this.formData.append('OldPasswordHash', this.oldpasswordHash);
    if(this.form.controls['verifiedAccount'].value == "Yes")
      {this.formData.append('VerifiedAccount', "true");
      this.formData.append('Role', "2");}
    else
      {this.formData.append('VerifiedAccount', "false");
      this.formData.append('Role', "1");}
    if(this.form.controls['photo'].value != "../../../assets/images/companyProfilePhoto.png") //photo exists
      {
        this.formData.append('Photo', this.form.controls['photo'].value);
      }
        
    if(this.section == 2){
      if(!this.admin){
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
      else{
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
      this.service.saveCompany(this.id, this.formData).subscribe((data)=>{
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
  create() {
    this.router.navigate(['/jobs/create']);
  }
  cancel(){
    this.getCompanyDetails(this.id);
    this.formData.delete;
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
        this.logout();
      });
      this.router.navigate(['/dashboard']);
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
}
