import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Job } from 'app/interfaces/job';
import { AuthService } from 'app/services/auth.service';
import { JobsService } from './jobs.service';
@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent implements OnInit {

  JobList:any=[];
  columnsToDisplay : string[] = ['JobTitle', 'Description', 'Salary', 'JobType', 'Experience', 'Open', 'Options'];
  dataSource = new MatTableDataSource<Job>(this.JobList);
  admin = localStorage.getItem('admin');

  constructor(
    private router:Router,
    private service: JobsService,
    private authService: AuthService) { }
  
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
  removeJob(id:any){
    console.log(id);
    this.service.removeJob(id).subscribe((data)=>{
      console.log("success");
      this.getJobList();
 });
  }
  logout() {
    this.authService.logout();
  }
}
