import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public authenticated?: boolean;
  constructor(private authService: AuthService) { }

  ngOnInit(): void {
  }
  public isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
  logout() {
    this.authService.logout();
  }

}
