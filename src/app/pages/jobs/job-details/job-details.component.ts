import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompaniesService } from 'app/pages/companies/companies.service';
import { AuthService } from 'app/services/auth.service';
import { JobsService } from '../jobs.service';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss']
})
export class JobDetailsComponent implements OnInit {

  Job:any;
  Company: any;
  public id: any;
  admin = sessionStorage.getItem('admin');

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
      this.service.getCompany(data.companyId).subscribe(data2 =>{
        this.Job.Company = data2;
      })
    });
  }
  removeJob(id:any){
    console.log(id);
    this.service.removeJob(id).subscribe(data=>{
          console.log("success");
    });
    this.router.navigate(['/jobs']);
  }
  editJob(id:any){
    console.log(id);
    this.router.navigate(['/jobs/edit', id]);
  }
  back(){
    this.router.navigate(['/jobs']);
  }
  logout() {
    this.authService.logout();
  }
}
