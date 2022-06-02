import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public authenticated?: boolean;
  search: string = '';
  constructor(
    private router:Router,
    private authService: AuthService) { }

  ngOnInit(): void {
  }
  public isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
  logout() {
    this.authService.logout();
  }
  searchData(){
    this.router.navigate(['/search', this.search]);
  }
}
