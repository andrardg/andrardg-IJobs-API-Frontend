import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompaniesService } from 'app/pages/companies/companies.service';
import { AuthService } from 'app/services/auth.service';
import { JobsService } from '../jobs.service';

@Component({
  selector: 'app-job-edit',
  templateUrl: './job-edit.component.html',
  styleUrls: ['./job-edit.component.scss']
})
export class JobEditComponent implements OnInit {

  Job:any;
  admin = sessionStorage.getItem('admin');
  public id: any; 
  public hide: boolean = true; //for the password
  public form: FormGroup = new FormGroup({
                jobTitle: new FormControl(''),
                description: new FormControl(''),
                salary: new FormControl(''),
                jobType: new FormControl(''),
                experience: new FormControl(''),
                open: new FormControl(''),
              });
              
  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private service: JobsService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      this.id = params['id'];
      console.log(this.id);
    });

    this.getJobDetails(this.id);
  }

  getJobDetails(id:any){
    this.service.getJobDetails(id).subscribe(data=>{
      this.Job=data;
      console.log(data);

      this.form.patchValue({jobTitle: this.Job.jobTitle});
      this.form.patchValue({description: this.Job.description});
      this.form.patchValue({salary: this.Job.salary});
      this.form.patchValue({jobType: this.Job.jobType});
      this.form.patchValue({experience: this.Job.experience});
      this.form.patchValue({open: this.Job.open});
    });
  }
  cancel(){
    this.router.navigate(['/jobs', this.id]);
  }
  save(){
    this.Job.jobTitle = this.form.controls['jobTitle'].value;
    this.Job.description = this.form.controls['description'].value;
    this.Job.salary = this.form.controls['salary'].value;
    this.Job.jobType = this.form.controls['jobType'].value;
    this.Job.experience = this.form.controls['experience'].value;
    this.Job.open = this.form.controls['open'].value;

    console.log(this.Job);
    this.service.saveJob(this.Job).subscribe((data)=>{
      console.log("Update successful");
    });
    this.router.navigate(['/jobs', this.id]);
  }
  logout() {
    this.authService.logout();
  }
}
