import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    RouterLinkWithHref,
    RouterLinkActive,
    CommonModule
],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  title:string='Admin dashboard';

  setTitle(title:string):string{
    return title;
  }
  constructor(
    private authService:AuthService,
    private router:Router
  ){}

  logout(){
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  isAdmin():boolean{
    return this.authService.isAdmin();
  }

}
