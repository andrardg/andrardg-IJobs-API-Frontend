import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Job } from 'app/interfaces/job';
import { Company } from 'app/interfaces/company';
import { CompaniesService } from 'app/services/companies.service';
import { AuthService } from 'app/services/auth.service';
import { JobsService } from '../../../services/jobs.service';

@Component({
  selector: 'app-job-create',
  templateUrl: './job-create.component.html',
  styleUrls: ['./job-create.component.scss']
})
export class JobCreateComponent implements OnInit {

  public Job: Job = {
    JobTitle: '',
    Description: '',
    Salary: 0,
    JobType: '',
    Experience: '',
    Address: '',
    Open: false,
    CompanyId: '',
    Company: null//{Id:'', Name:'', Email:'', Password:'', Role:'2', verifiedAccount:true}
  };
  CompanyList:any=[];
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
              });
              
  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private service: JobsService,
    private authService: AuthService,
    private companyService: CompaniesService) { }

  ngOnInit(): void {
    this.getCompanies();
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
    
    this.Job.JobTitle = this.form.controls['jobTitle'].value.charAt(0).toUpperCase() + this.form.controls['jobTitle'].value.slice(1);
    this.Job.Description = this.form.controls['description'].value.charAt(0).toUpperCase() + this.form.controls['description'].value.slice(1);
    this.Job.Salary = this.form.controls['salary'].value;
    this.Job.JobType = this.form.controls['jobType'].value;
    this.Job.Experience = this.form.controls['experience'].value;
    this.Job.Address = this.form.controls['address'].value.charAt(0).toUpperCase() + this.form.controls['address'].value.slice(1);
    this.Job.Open = true;
    if (sessionStorage.getItem("Admin") != null)
    this.Job.CompanyId = this.form.controls['companyId'].value;
    if (sessionStorage.getItem("Company") != null){
      var company = JSON.parse(sessionStorage.getItem('Company') || "")
      this.Job.CompanyId = company.id;
    }

    console.log(this.Job);
    
    this.service.createJob(this.Job).subscribe((data)=>{
       console.log("Created successfully");
       alert("Created successfully");
     },
            error => {
              this.error=error;
            }
     );
    if(this.error)
      console.log(this.error);
    else
      this.router.navigate(['/jobs']);
  }
  logout() {
    this.authService.logout();
  }
  getCompanies(){
    this.companyService.getCompanies().subscribe(data=>{
      console.log(data);
      this.CompanyList=data;
    });;
  }
  updateCompany(e: any){
    this.form.patchValue({companyId: e.value});
  }
}
