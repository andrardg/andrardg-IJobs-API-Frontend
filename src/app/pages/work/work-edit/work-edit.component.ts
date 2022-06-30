import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Application } from 'app/classes/application';
import { Company } from 'app/classes/company';
import { Domain } from 'app/classes/domain';
import { Job } from 'app/classes/job';
import { User } from 'app/classes/user';
import { ApplicationService } from 'app/services/application.service';
import { AuthService } from 'app/services/auth.service';
import { CompaniesService } from 'app/services/companies.service';
import { DomainService } from 'app/services/domain.service';
import { InterviewService } from 'app/services/interview.service';
import { InviteService } from 'app/services/invite.service';
import { JobsService } from 'app/services/jobs.service';
import { UsersService } from 'app/services/users.service';

@Component({
  selector: 'app-work-edit',
  templateUrl: './work-edit.component.html',
  styleUrls: ['./work-edit.component.scss']
})
export class WorkEditComponent implements OnInit {
  Job = new Job();
  admin = sessionStorage.getItem('Admin');
  ownerIsCompany:boolean = true;
  public id: any; 
  public hide: boolean = true; //for the password
  JobTypes:Array<string> = ["One day", "A few days", "Weekly", "Monthly", "Regularly"];
  Experience:any=["Entry Level", "Junior Level", "Mid-Senior Level", "Senior Level", "Associate", "Director"]
  Vacant:any=["Yes", "No"];
  CompanyList:Array<Company> = [];
  UserList:Array<User> = [];
  DomainList:Array<Domain> = [];
  selectedDomain = new Domain();
  public error: boolean | string = false;
  public form: FormGroup = new FormGroup({
                jobTitle: new FormControl('', [Validators.required]),
                description: new FormControl('', [Validators.required]),
                salary: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
                jobType: new FormControl('', [Validators.required]),
                experience: new FormControl('', [Validators.required]),
                address: new FormControl('', [Validators.required]),
                companyId: new FormControl(''),
                domain: new FormControl(''),
                subdomain: new FormControl('', [Validators.required]),
              });
  applicationsList : Array<Application> = [];
              
  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private service: JobsService,
    private authService: AuthService,
    private companyService: CompaniesService,
    private userService: UsersService,
    private domainService: DomainService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.id = params['id'];
      console.log(this.id);
    });

    this.getJobDetails(this.id);
    this.getCompanies();
    this.getUsers();
    this.getDomains();
  }

  getJobDetails(id:any){
    this.service.getJobDetails(id).subscribe(data=>{
      this.Job=data;
      console.log(data);
      
      this.form.patchValue({jobTitle: this.Job.jobTitle});
      this.form.patchValue({description: this.Job.description});
      this.form.patchValue({jobType: this.Job.jobType});
      this.form.patchValue({address: this.Job.address});
      this.form.patchValue({experience: this.Job.experience});
      this.form.patchValue({salary: this.Job.salary});
    });
  }
  cancel(){
    this.router.navigate(['/work', this.id]);
  }
  save(){
    const sal: number = Number(this.form.controls['salary'].value);
    if(isNaN(sal))
    {
      this.error = "Salary has to be a number.";
      return;
    }

    if(this.form.invalid || (this.admin && this.form.controls["companyId"].value=='' && this.form.controls["userId"].value=='')){
      console.log("Edit Job error");
      this.error = 'You cannot register empty fields. ';
      return;
    }
      delete this.Job.company;
      delete this.Job.subdomain;
      delete this.Job.applications;
      delete this.Job.user;
      this.Job.userId;
      this.Job.jobTitle = this.form.controls['jobTitle'].value.charAt(0).toUpperCase() + this.form.controls['jobTitle'].value.slice(1);
      this.Job.description = this.form.controls['description'].value.charAt(0).toUpperCase() + this.form.controls['description'].value.slice(1);
      this.Job.salary = this.form.controls['salary'].value;
      this.Job.jobType = this.form.controls['jobType'].value;
      this.Job.experience = this.form.controls['experience'].value;
      this.Job.address = this.form.controls['address'].value.charAt(0).toUpperCase() + this.form.controls['address'].value.slice(1);
      this.Job.open = true;

          this.Job.open = false;

      if(this.admin)
      if(this.form.controls['companyId'].value != '')
        this.Job.companyId = this.form.controls['companyId'].value;
      else if(this.form.controls['userId'].value != '')
        this.Job.userId = this.form.controls['userId'].value;
      this.Job.subdomainId = this.form.controls['subdomain'].value;
      console.log(this.Job);
      this.service.saveJob(this.Job).subscribe((data)=>{
        console.log("Update successful");
        alert('Updated successfully');
        this.error= '';
      },
      error => {
        this.error=error;
      }
      );
      if(this.error)
        console.log(this.error);
      else
        this.router.navigate(['/work', this.id]);

  }
  logout() {
    this.authService.logout();
  }
  getCompanies(){
    this.companyService.getCompanies().subscribe(data=>{
      this.CompanyList=data;
      this.CompanyList = this.CompanyList.sort((a,b) => a.name!.localeCompare(b.name!));
    });;
  }
  getUsers(){
    this.userService.getUsers().subscribe((data: User[])=>{
      this.UserList=data;
      this.UserList = this.UserList.sort((a,b) => a.firstName!.localeCompare(b.firstName!));
    })
  }
  updateCompany(e: any){
    this.form.patchValue({userId: ""});
    this.form.patchValue({companyId: e.value});
  }
  updateUser(e: any){
    this.form.patchValue({userId: e.value});
    this.form.patchValue({companyId: ""});
  }
  getDomains(){
    this.domainService.getDomains().subscribe(data=>{
      this.DomainList = data;
      this.DomainList = this.DomainList.filter( x => x.subdomains!.length > 0);
      this.DomainList = this.DomainList.sort((a,b) => a.name.localeCompare(b.name));
    },
    error =>{
      console.log(error);
    }
  )};
  changeDomain(event:any){
    console.log(event.target.value);
    this.selectedDomain = this.DomainList.filter(x => x.id == event.target.value)[0];
    if(this.selectedDomain.name == 'Other')
      this.form.patchValue({subdomain: this.selectedDomain.subdomains![0].id});
    else
      this.form.patchValue({subdomain:''});
    this.selectedDomain.subdomains = this.selectedDomain.subdomains!.sort((a,b) => a.name.localeCompare(b.name));
    console.log(this.selectedDomain);
  }
  changeSubdomain(event:any){
    console.log(event.target.value);
    this.form.patchValue({subdomain: event.target.value});

  }
}
