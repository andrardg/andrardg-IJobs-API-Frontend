import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { User } from 'app/interfaces/user';
import { AuthService } from 'app/services/auth.service';
import { PrivateService } from 'app/services/private.service';
import { UsersService } from './users.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  UserList:any=[];
  columnsToDisplay : string[] = ['FirstName', 'LastName', 'Email', 'PasswordHash', 'Role', 'Options'];
  dataSource = new MatTableDataSource<User>(this.UserList);
  admin = sessionStorage.getItem('admin');

  
  constructor( 
    private router:Router,
    private service: UsersService,
    private authService: AuthService) { }
  
  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers(){
    console.log(sessionStorage.getItem('role'));
    this.service.getUsers().subscribe(data=>{
      console.log(data);
      this.UserList = data;
    });
  }
  removeUser(id:any){
    console.log(id);
    this.service.removeUser(id).subscribe((data)=>{
      console.log("success");
      this.getAllUsers();
 });
  }
  logout() {
    this.authService.logout();
  }
}