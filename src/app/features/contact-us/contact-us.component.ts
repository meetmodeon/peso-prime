import { Component } from '@angular/core';
import AOS from 'aos';
import { QueryPageComponent } from '../../shared/components/query-page/query-page.component';
import { SiteSettingsStateService } from '../../statemanagement/siteSettings/site-settings-state.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SeoService } from '../../services/seo/seo.service';
import { SEO_CONFIG } from '../../services/model/SEO_CONFIG.model';

@Component({
  selector: 'app-contact-us',
  imports: [QueryPageComponent],
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss',
})
export class ContactUsComponent {
  slide = {
    image: 'hero.jpg',
    alt: 'Soli testing web',
    title: 'Contact',
    highlight:
      'Initiate your technical assessment with our expert engineering team. Provide project details below for a comprehensive scope evaluation.',
  };

  siteSettingResponse:any;
  constructor(private siteSettingStateService: SiteSettingsStateService,
    private seoService:SeoService,
    private sanitizer: DomSanitizer) {
    this.siteSettingResponse=this.siteSettingStateService.siteSetting;
  }

  ngOnInit() {
    AOS.init({
      duration: 800,
      once: false,
      easing: 'ease-in-out',
      offset: 120,
    });
    this.siteSettingStateService.loadSiteSetting();
    this.seoService.setSEO(SEO_CONFIG.contact);
  }

  // ✅ Safe Google Map URL
  get mapAddress(): SafeResourceUrl {
    const data = this.siteSettingStateService.siteSetting();

    const company = data?.companyName || '';
    const address = data?.address || '';

    const url = `https://maps.google.com/maps?q=${encodeURIComponent(company + ', ' + address)}&z=16&output=embed`;

    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
