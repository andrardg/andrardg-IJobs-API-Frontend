import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Job } from 'app/interfaces/job';
import { AuthService } from 'app/services/auth.service';
import { CompaniesService } from '../../services/companies.service';
import { JobsService } from '../../services/jobs.service';
@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {

  JobList:any=[];
  columnsToDisplay : string[] = ['JobTitle', 'Company.Name', 'Company.Address', 'Salary', 'JobType', 'Options'];
  dataSource = new MatTableDataSource<Job>(this.JobList);
  createRights = sessionStorage.getItem('Admin') || (sessionStorage.getItem('Company') && sessionStorage.getItem('role') ==  '2');
  

  deleteProgress = 0;

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
}
