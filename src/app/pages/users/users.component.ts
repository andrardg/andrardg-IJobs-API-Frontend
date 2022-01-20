import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { PrivateService } from 'src/app/services/private.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements User, OnInit {

  public users:   User[] = [];
  constructor(private privateService: PrivateService) { }
  
  FirstName?: string | undefined;
  LastName?: string | undefined;
  Email: string = "";
  Password: string ="";

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers(){
    this.privateService.getUsers().subscribe((response: any)=>{
      this.users = response.allUsers;
    });
  }
}