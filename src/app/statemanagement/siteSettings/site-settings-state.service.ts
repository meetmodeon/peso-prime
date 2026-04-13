import { computed, Injectable, signal } from '@angular/core';
import { SiteSettingService } from '../../services/siteSetting/site-setting.service';
import { ProjectsHeroSectionResponse, SiteSettingsRespone, SocialMediaLinks } from '../../services/model/siteSettings.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SiteSettingsStateService {

  private _siteSettings=signal<SiteSettingsRespone |null>(null);
  private _projectHeroList=signal<ProjectsHeroSectionResponse[]>([]);
  private _socialMediaLinks=signal<SocialMediaLinks>({});
  private _loaded=signal(false);

  constructor(
    private siteSettingService:SiteSettingService,
  ) { }

  siteSetting=this._siteSettings.asReadonly();
  projectHeroList=this._projectHeroList.asReadonly();
  socialMediaLinks=this._socialMediaLinks.asReadonly();

  loadSiteSetting(){
    if(this._loaded()) return;

    this.siteSettingService.getSettings().subscribe({
      next:(data)=>{
        this._siteSettings.set(data);
        this._projectHeroList.set(data.projectHeroSection);
        this._socialMediaLinks.set(data.socialMediaLinks);
        this._loaded.set(true);
      },
      error:(err)=>{
        console.error('Settings load failed',err);
      }
    })
  }

  refresh(){
    this.siteSettingService.getSettings().subscribe({
      next:(data)=>{
        this._siteSettings.set(data);
        this._loaded.set(true);
      }
    })
  }

  clearCache(){
    this._siteSettings.set(null);
    this._loaded.set(false);
  }
}
