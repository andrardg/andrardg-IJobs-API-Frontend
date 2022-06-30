import { LowerCasePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { User } from 'app/classes/user';
import { AuthService } from 'app/services/auth.service';
import { PrivateService } from 'app/services/private.service';
import { elementAt } from 'rxjs';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  Users:Array<User>=[];
  UserList:Array<User>=[];
  admin = sessionStorage.getItem('admin');
  residenceFilter:string = '';
  study:Array<string> = ['Primary School', 'Middle School', 'Highschool', 'Vocational School', 'University'];
  studiesFilter2: Array<boolean> = [false, false, false, false, false];
  cvFilter:boolean = false;
  photoFilter:boolean = false;


  constructor( 
    private router:Router,
    private service: UsersService,
    private authService: AuthService) { }
  
  ngOnInit(): void {
    sessionStorage.removeItem('jobId');
    sessionStorage.removeItem('companyId');
    sessionStorage.removeItem('workId');
    this.getAllUsers();
  }

  getAllUsers(){
    this.service.getUsers().subscribe(data=>{
      console.log(data);
      this.Users = data;
      this.UserList = data;
    });
  }
  getUserDetails(id:any){
    console.log(id);
    this.router.navigate(['/users', id]);
  }
  logout() {
    this.authService.logout();
  }
  toggleCv(event:any){
    if(this.cvFilter == false && event.pointerId == 1)
        this.cvFilter = true;
    else if(event.pointerId == 1)
        this.cvFilter = false;
  }
  togglePhoto(event:any){
    if(this.photoFilter == false && event.pointerId == 1)
      this.photoFilter = true;
    else if(event.pointerId == 1)
      this.photoFilter = false;
  }
  done(){
    this.UserList = this.Users.filter(elem => (
      (this.cvFilter == false || (this.cvFilter == true && elem.cv != null)) &&
      (this.photoFilter == false || (this.photoFilter == true && elem.photo != null)) &&
      (this.residenceFilter == '' || (elem.residence !=null && elem.residence?.toLowerCase().indexOf((this.residenceFilter).toLowerCase()) != -1))
    ));
    if(this.studiesFilter2)
      this.UserList.forEach(user => { // for each user, loop over studies list
        var add:boolean = false;
        for(let i=0; i< this.studiesFilter2.length; i++)
            if(this.studiesFilter2[i] == true && user.studies !=null && user.studies?.toLowerCase().indexOf(this.study[i].toLowerCase())!= -1)
              add = true;
        if(add == false && this.studiesFilter2.indexOf(true) != -1) // if user studies not in filter list, delete
          this.UserList = this.UserList.filter( elem => (elem != user));
      });
  }
}