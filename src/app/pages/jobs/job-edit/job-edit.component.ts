import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompaniesService } from 'app/services/companies.service';
import { AuthService } from 'app/services/auth.service';
import { JobsService } from '../../../services/jobs.service';

@Component({
  selector: 'app-job-edit',
  templateUrl: './job-edit.component.html',
  styleUrls: ['./job-edit.component.scss']
})
export class JobEditComponent implements OnInit {

  Job:any;
  admin = sessionStorage.getItem('Admin');
  public id: any; 
  public hide: boolean = true; //for the password
  JobTypes:any=["Full-Time", "Part-Time", "Internship", "Volunteering"];
  Experience:any=["Entry Level", "Junior Level", "Mid-Senior Level", "Senior Level", "Associate", "Director"]
  Vacant:any=["Yes", "No"];
  CompanyList:any=[];
  public error: boolean | string = false;
  public form: FormGroup = new FormGroup({
                jobTitle: new FormControl('', [Validators.required]),
                description: new FormControl('', [Validators.required]),
                salary: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*$")]),
                jobType: new FormControl('', [Validators.required]),
                experience: new FormControl('', [Validators.required]),
                address: new FormControl('', [Validators.required]),
                open: new FormControl('', [Validators.required]),
                companyId: new FormControl(''),
              });
              
  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private service: JobsService,
    private authService: AuthService,
    private companyService: CompaniesService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.id = params['id'];
      console.log(this.id);
    });

    this.getJobDetails(this.id);
    this.getCompanies();
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
      if(this.Job.open == true)
        this.form.patchValue({open: "Yes"});
        else
        this.form.patchValue({open: "No"});
      
    });
  }
  cancel(){
    this.router.navigate(['/jobs', this.id]);
  }
  save(){
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
    if(this.form.controls['open'].value == "Yes")
      this.Job.open = true;
    else
      this.Job.open = false;
    if(this.admin)
      this.Job.companyId = this.form.controls['companyId'].value;
    console.log(this.Job);
    this.service.saveJob(this.Job).subscribe((data)=>{
      console.log("Update successful");
      alert('Updated successfully');
    },
    error => {
      this.error=error;
    }
    );
    if(this.error)
      console.log(this.error);
    else
      this.router.navigate(['/jobs', this.id]);
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
}
