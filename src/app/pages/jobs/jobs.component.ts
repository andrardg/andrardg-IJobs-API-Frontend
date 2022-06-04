import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Job } from 'app/classes/job';
import { AuthService } from 'app/services/auth.service';
import { CompaniesService } from '../../services/companies.service';
import { JobsService } from '../../services/jobs.service';
@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {

  JobList:Array<Job> = [];
  createRights = sessionStorage.getItem('Admin') || (sessionStorage.getItem('Company') && sessionStorage.getItem('role') ==  '2');
  admin = sessionStorage.getItem('Admin');
  deleteProgress = 0;

  jobTypes:Array<string> = ["Full-Time", "Part-Time", "Internship", "Volunteering"];
  jobTypesFilter: Array<boolean> = [false, false, false, false];
  experience:any=["Entry Level", "Junior Level", "Mid-Senior Level", "Senior Level", "Associate", "Director"];
  experienceFilter: Array<boolean> = [false, false, false, false, false, false];
  salaryFilter:number = 0;
  error:any = '';
  Jobs:Array<Job> = [];

  constructor(
    private router:Router,
    private service: JobsService,
    private authService: AuthService) {
    }
  
  ngOnInit(): void {  
    this.getJobList();
  }

  getJobList(){
    this.service.getJobs().subscribe(data=>{
      console.log(data);
      this.JobList=data;
    });
  }
  getJobDetails(id: any){
    console.log(id);
    this.router.navigate(['/jobs', id]);
  }
  removeJob(time:any, id:any){
    
    console.log(id);
    console.log(time);
    this.deleteProgress = Math.max(this.deleteProgress, time / 10);
    if( this.deleteProgress > 100 && time == 0){
      
        this.deleteProgress = 0;

        this.service.removeJob(id).subscribe((data)=>{
        console.log("success");
        this.getJobList();
    });
    }  
  }
  create() {
    this.router.navigate(['/jobs/create']);
  }

  logout() {
    this.authService.logout();
  }
  doneJob(){
    if(!Number.isNaN(Number(this.salaryFilter)) == false)
    this.error= 'Salary has to be numeric';
    else{
      this.error = '';
      this.Jobs = this.JobList.filter(elem => (
        this.salaryFilter == 0 || elem.salary > this.salaryFilter
        ));
      this.Jobs.forEach(job => { // for each user, loop over studies list
        var add:boolean = false;
        var add2:boolean = false;
        for(let i=0; i< this.jobTypesFilter.length; i++)
            if(this.jobTypesFilter[i] == true && job.jobType?.indexOf(this.jobTypes[i])!= -1)
              add = true;
        for(let i=0; i< this.experienceFilter.length; i++)
          if(this.experienceFilter[i] == true && job.experience?.indexOf(this.experience[i])!= -1)
            add2 = true;
        if(add == false && this.jobTypesFilter.indexOf(true) != -1) // if job type not in filter list, delete
          this.Jobs = this.Jobs.filter( elem => (elem != job));
        if(add2 == false && this.experienceFilter.indexOf(true) != -1) // if job experience not in filter list, delete
          this.Jobs = this.Jobs.filter( elem => (elem != job));
      });
    }
    
  }
}
