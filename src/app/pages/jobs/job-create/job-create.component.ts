import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Job } from 'app/classes/job';
import { Company } from 'app/classes/company';
import { CompaniesService } from 'app/services/companies.service';
import { AuthService } from 'app/services/auth.service';
import { JobsService } from '../../../services/jobs.service';
import { DomainService } from 'app/services/domain.service';
import { Domain } from 'app/classes/domain';

@Component({
  selector: 'app-job-create',
  templateUrl: './job-create.component.html',
  styleUrls: ['./job-create.component.scss']
})
export class JobCreateComponent implements OnInit {

  public Job = new Job();
  CompanyList:Array<Company> = [];
  DomainList:Array<Domain> = [];
  selectedDomain = new Domain();
  JobTypes:any=["Full-Time", "Part-Time", "Internship", "Volunteering"];
  Experience:any=["Entry Level", "Junior Level", "Mid-Senior Level", "Senior Level", "Associate", "Director"]
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
                subdomain: new FormControl('', [Validators.required]),
              });
              
  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private service: JobsService,
    private authService: AuthService,
    private companyService: CompaniesService,
    private domainService: DomainService) { }

  ngOnInit(): void {
    this.getCompanies();
    this.getDomains();
  }
  cancel(){
    this.router.navigate(['/jobs']);
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
    if (sessionStorage.getItem("Admin") != null)
    this.Job.companyId = this.form.controls['companyId'].value;
    if (sessionStorage.getItem("Company") != null){
      var company = JSON.parse(sessionStorage.getItem('Company') || "")
      this.Job.companyId = company.id;
    }
    this.Job.subdomainId = this.form.controls['subdomain'].value;

    this.service.createJob(this.Job).subscribe((data)=>{
       console.log("Created successfully");
       alert("Created successfully");
       this.router.navigate(['/jobs']);
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
      console.log(data);
      this.CompanyList=data;
      this.CompanyList = this.CompanyList.filter( x=> x.verifiedAccount == true);
    });;
  }
  updateCompany(e: any){
    this.form.patchValue({companyId: e.value});
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
