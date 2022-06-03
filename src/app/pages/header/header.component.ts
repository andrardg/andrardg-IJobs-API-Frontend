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
  name: string = '';
  constructor(
    private router:Router,
    private authService: AuthService) { }

  ngOnInit(): void {
    if(sessionStorage.getItem('Admin'))
      this.name = JSON.parse(sessionStorage.getItem('Admin') || "").firstName;
    if (sessionStorage.getItem("Company") != null)
    this.name = JSON.parse(sessionStorage.getItem('Company') || "").name;
    if (sessionStorage.getItem("User") != null)
    this.name = JSON.parse(sessionStorage.getItem('User') || "").firstName;

  }
  public isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
  logout() {
    this.authService.logout();
  }
  searchData(event:any){
    console.log(this.router.url);
    if (event.keyCode == 13 && this.search != '')
      {
        this.router.navigate(['/search', this.search]);
        this.search='';
  }
  }
}
