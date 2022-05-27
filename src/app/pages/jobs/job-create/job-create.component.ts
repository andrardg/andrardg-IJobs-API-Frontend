import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Job } from 'app/interfaces/job';
import { Company } from 'app/interfaces/company';
import { CompaniesService } from 'app/pages/companies/companies.service';
import { AuthService } from 'app/services/auth.service';
import { JobsService } from '../jobs.service';

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
    Open: false,
    CompanyId: '',
    Company: null//{Id:'', Name:'', Email:'', Password:'', Role:'2', verifiedAccount:true}
  };
  CompanyList:any=[];
  JobTypes:any=["Full-Time", "Part-Time", "Internship", "Volunteering"];
  Experience:any=["Entry Level", "Junior Level", "Mid-Senior Level", "Senior Level", "Associate", "Director"]
  admin = sessionStorage.getItem('Admin');
  public form: FormGroup = new FormGroup({
                jobTitle: new FormControl(''),
                description: new FormControl(''),
                salary: new FormControl(''),
                jobType: new FormControl(''),
                experience: new FormControl(''),
                open: new FormControl('0'),
                companyId: new FormControl(''),
              });
              
  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private service: JobsService,
    private companiesService: CompaniesService,
    private authService: AuthService,
    private companyService: CompaniesService) { }

  ngOnInit(): void {
    this.getCompanies();
  }
  cancel(){
    this.router.navigate(['/jobs']);
  }
  createJob(){

    if(this.form.invalid){
      console.log("Create Job error");
      return;
    }
    
    this.Job.JobTitle = this.form.controls['jobTitle'].value;
    this.Job.Description = this.form.controls['description'].value;
    this.Job.Salary = this.form.controls['salary'].value;
    this.Job.JobType = this.form.controls['jobType'].value;
    this.Job.Experience = this.form.controls['experience'].value;
    this.Job.Open = ('true' == (this.form.controls['open'].value));
    if (sessionStorage.getItem("Admin") != null)
    this.Job.CompanyId = this.form.controls['companyId'].value;
    if (sessionStorage.getItem("Company") != null){
      var company = JSON.parse(sessionStorage.getItem('Company') || "")
      this.Job.CompanyId = company.id;
    }

    console.log(this.Job);
    
    this.service.createJob(this.Job).subscribe((data)=>{
       console.log("Created successful");
     },
            error => {
              console.log(error)
            }
     );
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
