import { Component, effect } from '@angular/core';
import { SiteSettingsStateService } from '../../../statemanagement/siteSettings/site-settings-state.service';
import { SecureImageDirective } from "../../../directives/secure-image/secure-image.directive";


@Component({
  selector: 'app-footer',
  imports: [
    SecureImageDirective,
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  siteSettings:any;

  constructor(
    private siteStateService:SiteSettingsStateService
  ){
   this.siteSettings=this.siteStateService.siteSetting;
  }

  ngOnInit(){
    this.siteStateService.loadSiteSetting();
  }
  get currentYear(){
    return new Date().getFullYear();
  }

}
