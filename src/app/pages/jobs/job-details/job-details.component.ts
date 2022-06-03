import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompaniesService } from 'app/services/companies.service';
import { AuthService } from 'app/services/auth.service';
import { JobsService } from '../../../services/jobs.service';

@Component({
  selector: 'app-job-details',
  templateUrl: './job-details.component.html',
  styleUrls: ['./job-details.component.scss']
})
export class JobDetailsComponent implements OnInit {

  Job:any;
  Company: any;
  public id: any;
  editDeleteRights : boolean = false;

  constructor(
    private activatedRoute:ActivatedRoute,
    private router:Router,
    private service: JobsService,
    private companyService: CompaniesService,
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
      
    console.log(data);
    this.Job=data;
    this.companyService.getCompanyDetails(data.companyId).subscribe(data2 =>{
      this.Job.Company = data2;
      })
    if (sessionStorage.getItem("Company") != null)
      var company = JSON.parse(sessionStorage.getItem('Company') || "")
    if(sessionStorage.getItem('Admin') || (company!=null && company.id == data.companyId))
      this.editDeleteRights = true;
    });
  }
  getCompanyDetails(id: any){
    console.log(id);
    this.router.navigate(['/companies', id]);
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
