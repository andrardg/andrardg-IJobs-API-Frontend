import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Company } from 'app/classes/company';
import { Domain } from 'app/classes/domain';
import { Job } from 'app/classes/job';
import { User } from 'app/classes/user';
import { AuthService } from 'app/services/auth.service';
import { CompaniesService } from 'app/services/companies.service';
import { DomainService } from 'app/services/domain.service';
import { JobsService } from 'app/services/jobs.service';
import { UsersService } from 'app/services/users.service';

@Component({
  selector: 'app-work-create',
  templateUrl: './work-create.component.html',
  styleUrls: ['./work-create.component.scss']
})
export class WorkCreateComponent implements OnInit {
  
  ownerIsCompany:boolean = true;
  public Job = new Job();
  CompanyList:Array<Company> = [];
  UserList:Array<User> = [];
  DomainList:Array<Domain> = [];
  selectedDomain = new Domain();
  JobTypes:Array<string> = ["One day", "A few days", "Weekly", "Monthly", "Regularly"];
  Experience:any=["Entry Level", "Junior Level", "Mid-Senior Level", "Senior Level"];
  admin = sessionStorage.getItem('Admin');
  public error: boolean | string = false;
  public form: FormGroup = new FormGroup({
                jobTitle: new FormControl('', [Validators.required]),
                description: new FormControl('', [Validators.required]),
                salary: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
                jobType: new FormControl('', [Validators.required]),
                experience: new FormControl('', [Validators.required]),
                address: new FormControl('', [Validators.required]),
                companyId: new FormControl(''),
                userId: new FormControl(''),
                subdomain: new FormControl('', [Validators.required]),
              });
            
  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private service: JobsService,
    private authService: AuthService,
    private companyService: CompaniesService,
    private userService: UsersService,
    private domainService: DomainService) { }

  ngOnInit(): void {    
    this.getCompanies();
    this.getUsers();
    this.getDomains();
  }
  cancel(){
    this.router.navigate(['/work']);
  }
  createJob(){
    const sal: number = Number(this.form.controls['salary'].value);
    if(isNaN(sal))
    {
      this.error = "Salary has to be a number.";
      return;
    }

    if(this.form.invalid){
      console.log("Create Job error");
      this.error = 'You cannot register empty fields. ';
      return;
    }
    delete this.Job.company;
    this.Job.jobTitle = this.form.controls['jobTitle'].value.charAt(0).toUpperCase() + this.form.controls['jobTitle'].value.slice(1);
    this.Job.description = this.form.controls['description'].value.charAt(0).toUpperCase() + this.form.controls['description'].value.slice(1);
    this.Job.salary = this.form.controls['salary'].value;
    this.Job.jobType = this.form.controls['jobType'].value;
    this.Job.experience = this.form.controls['experience'].value;
    this.Job.address = this.form.controls['address'].value.charAt(0).toUpperCase() + this.form.controls['address'].value.slice(1);
    this.Job.open = true;
    this.Job.workType = true;
    if (sessionStorage.getItem("Admin") != null)
      {
        if(this.form.controls['companyId'].value != "")
          {
            console.log("here")
            this.Job.companyId = this.form.controls['companyId'].value;
            delete this.Job.userId;
            console.log(this.Job)
          }
        else if(this.form.controls['userId'].value != "")
          {
            this.Job.userId = this.form.controls['userId'].value;
            delete this.Job.companyId;
          } 
      }

    if (sessionStorage.getItem("Company") != null){
      var company = JSON.parse(sessionStorage.getItem('Company') || "")
      this.Job.companyId = company.id;
      delete this.Job.userId;
    }
    if (sessionStorage.getItem("User") != null){
      var user = JSON.parse(sessionStorage.getItem('User') || "")
      delete this.Job.companyId;
      this.Job.userId = user.id;
    }
    this.Job.subdomainId = this.form.controls['subdomain'].value;

    this.service.createJob(this.Job).subscribe((data)=>{
       console.log("Created successfully");
       alert("Created successfully");
       this.router.navigate(['/work']);
     },error => {
        this.error=error;
        console.log(this.error);
        }
     );
  }
  logout() {
    this.authService.logout();
  }
  getCompanies(){
    this.companyService.getCompanies().subscribe(data=>{
      this.CompanyList=data;
      this.CompanyList = this.CompanyList.filter( x=> x.verifiedAccount == true);
    });;
  }
  getUsers(){
    this.userService.getUsers().subscribe(data=>{
      this.UserList=data;
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
    },
    error =>{
      console.log(error);
    }
  )};
  changeDomain(event:any){
    console.log(event.target.value);
    this.selectedDomain = this.DomainList.filter(x => x.id == event.target.value)[0];
    console.log(this.selectedDomain);
  }
}
