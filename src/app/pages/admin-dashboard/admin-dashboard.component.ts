import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';
import { ConnectableObservable } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService) { }

  ngOnInit(): void {
    console.log(sessionStorage.getItem('Admin'));
  }
  logout() {
    this.authService.logoutAdmin();
  }
}
