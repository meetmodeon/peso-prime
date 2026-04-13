import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./shared/components/navbar/navbar.component";
import { FooterComponent } from "./shared/components/footer/footer.component";
import { CommonModule } from '@angular/common';         // ← add
import { MessageService } from 'primeng/api';          
import { NgxSonnerToaster } from 'ngx-sonner';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, 
    NavbarComponent,
    CommonModule,
    NgxSonnerToaster,
    FooterComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers:[
    MessageService
  ]
})
export class AppComponent {
  title = 'frontend';
  currentUrl:string='';

  constructor(private router:Router){
    this.router.events.subscribe(event=>{
      if(event instanceof NavigationEnd){
        this.currentUrl=event.url;
      }
    });
  }

  hideLayout():boolean{
    return this.currentUrl.startsWith('/common') ||
    this.currentUrl.startsWith('/admin');
  }
}
