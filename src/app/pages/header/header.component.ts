import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  search: string = '';
  name:any;
  constructor(
    private router:Router,
    private authService: AuthService) { 
    }

  ngOnInit(): void {
    let name = sessionStorage.getItem('name');
    if(name != null)
      this.name = name;
    this.authService.name.subscribe(data =>{
        this.name = data;
      })
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
