import { Component, OnInit } from '@angular/core';
import { PrivateService } from 'src/app/services/private.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public users: any[] = [];

  constructor(private privateService: PrivateService) { }

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers(){
    this.privateService.getUsers().subscribe((response: any)=>{
      this.users = response.allUsers;
    });
  }
}
