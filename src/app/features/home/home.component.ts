import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  effect,
  ViewChild,
} from '@angular/core';
import { CarouselModule } from 'primeng/carousel';

import { CommonModule } from '@angular/common';
import { CountAnimationDirective } from '../../directives/countAnimation/count-animation.directive';
import AOS from 'aos';
import { GalleriaModule } from 'primeng/galleria';
import { Carousel } from 'primeng/carousel';
import { RouterLink } from '@angular/router';
import { TeamSectionComponent } from './team/team-section/team-section.component';
import { SiteSettingsStateService } from '../../statemanagement/siteSettings/site-settings-state.service';
import { SecureImageDirective } from '../../directives/secure-image/secure-image.directive';
import { ClientStateService } from '../../statemanagement/client/client-state.service';
import { ProjectFormComponent } from "../admin/pages/projects/project-form/project-form.component";
import { ProjectComponent } from "./project/project/project.component";
import { ServiceComponent } from "./service/service/service.component";
import { ClientTestimonialComponent } from "./client-testimonial/client-testimonial.component";
import { getExpirenceYear } from '../../core/utils/api.utils';
import { HomeShowCaseDashboardService } from '../../services/dashboard/dashboard/home-show-case-dashboard.service';
import { HomeShowCaseResponse } from '../../services/model/HomeShowCase.model';
import { SeoService } from '../../services/seo/seo.service';
import { SEO_CONFIG } from '../../services/model/SEO_CONFIG.model';

@Component({
  selector: 'app-home',
  imports: [
    CarouselModule,
    CommonModule,
    GalleriaModule,
    CountAnimationDirective,
    RouterLink,
    TeamSectionComponent,
    SecureImageDirective,
    ProjectComponent,
    ServiceComponent,
    ClientTestimonialComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomeComponent {
  currentSlide = 0;
  siteSetting:any;
  totalClient!:string;
  totalProject!:string;
  heroSlides:any;
  clients:any;
  @ViewChild('carousel') carousel!: Carousel;

  constructor(private siteState: SiteSettingsStateService,
    private clientServiceState:ClientStateService,
    private homeShowCaseService:HomeShowCaseDashboardService,
    private seo:SeoService
  ) {
     this.siteSetting=this.siteState.siteSetting;
     this.heroSlides=this.siteState.projectHeroList;
     this.clients=this.clientServiceState.clients;
  }

 
  nextSlide(event: any) {
    this.carousel.navForward(event); // Moves to next slide
  }

  prevSlide(event: any) {
    this.carousel.navBackward(event); // Moves to previous slide
  }
  


  ngOnInit() {
    AOS.init({
      duration: 800,
      once: false,
      easing: 'ease-in-out',
      offset: 120,
    });
    this.siteState.loadSiteSetting();
    this.clientServiceState.loadClientOnce();
    this.homeShowCaseService.getHomeShowCaseInfo().subscribe({
      next:(res)=>{
        this.totalClient=(res.totalClient+400).toString();
        this.totalProject=(res.totalProject+500).toString();
      }
    });
    this.seo.setSEO(SEO_CONFIG.home);
    
  }
  getAge():string{
    return getExpirenceYear().toString();
  }
}
