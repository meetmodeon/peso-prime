import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ProjectsHeroSectionRequest,
  SiteSettingsRequest,
} from '../../../../../services/model/siteSettings.model';
import { SiteSettingService } from '../../../../../services/siteSetting/site-setting.service';
import { ImageService } from '../../../../../services/image/image.service';
import { toast } from 'ngx-sonner';
import { FileType } from '../../../../../services/model/FileType.model';
import { SecureImageDirective } from '../../../../../directives/secure-image/secure-image.directive';


@Component({
  selector: 'app-add-site-info',
  imports: [CommonModule, 
    ReactiveFormsModule,
    SecureImageDirective,
    FormsModule],
  templateUrl: './add-site-info.component.html',
  styleUrl: './add-site-info.component.scss',
})
export class AddSiteInfoComponent implements OnInit {
  tab: 'general' | 'hero' = 'general';

  form: any = {
    id: null,
    companyName: '',
    phone: '',
    email: '',
    address: '',
    days: '',
    openTime: '',
    closeTime: '',
    companyLogoId: null,
    socialMediaLinks: {
      facebook: '',
      instagram: '',
      twitter: '',
      youtube: '',
      linkedin: '',
      tiktok: '',
    },
    metaTitle:'',
    metaDescription:''
  };
  maxHeroSection=10;
  heroList: any[] = [];
  logoPreview: string | ArrayBuffer | null = null;
  savingSiteInfo = false;

  constructor(
    private siteSettingService: SiteSettingService,
    private imageService: ImageService,
  ) {}

  ngOnInit(): void {
    this.loadSiteInfo();
    
  }

  loadSiteInfo() {
    this.savingSiteInfo = true;
    this.siteSettingService.getSettings().subscribe({
      next: (res) => {
        const data=res;
        if(!data){
          this.heroList=[];
          this.savingSiteInfo=false;
          return;
        }
       
          this.form = {
            id: data.id,
            companyName: data.companyName,
            phone: data.phone,
            email: data.email,
            address: data.address,
            days: data.workingHours?.days,
            openTime: data.workingHours?.openTime,
            closeTime: data.workingHours?.closeTime,
            companyLogoId: data.companyLogoId,
            socialMediaLinks: {
              facebook: data.socialMediaLinks?.facebook || '',
              instagram: data.socialMediaLinks?.instagram || '',
              twitter: data.socialMediaLinks?.twitter || '',
              youtube: data.socialMediaLinks?.youtube || '',
              linkedin: data.socialMediaLinks?.linkedin || '',
            },
            metaTitle:data.metaTitle,
            metaDescription:data.metaDescription
          };

          this.heroList = (data.projectHeroSection || []).map((h: any) => ({
            id: h.id,
            title: h.title,
            details: h.details,
            imageId: h.imageId,
            preview: null,
            saving: false,
          }));
        
        this.savingSiteInfo = false;
      },
      error: (error) => {
        this.savingSiteInfo = false;
        toast.error(error);
      },
    });
  }

  goToHeroTab() {
    this.tab = 'hero';
  }

  uploadLogo(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => (this.logoPreview = reader.result);
    reader.readAsDataURL(file);
    const formData = new FormData();
    formData.set('file', file);
    formData.set('type', 'COMPANY_LOGO' as FileType);
    this.imageService.uploadImage(formData).subscribe({
      next: (res) => {
        this.form.companyLogoId = res.id;
        toast.success('Logo uploaded');
      },
      error: () => toast.error('Logo upload failed'),
    });
  }

  uploadHero(event: any, index: number) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => (this.heroList[index].preview = reader.result);
    reader.readAsDataURL(file);
    const formData = new FormData();
    formData.set('file', file);
    formData.set('type', 'PROJECT_HERO' as FileType);
    this.imageService.uploadImage(formData).subscribe({
      next: (res) => {
        this.heroList[index].imageId = res.id;
        toast.success('Image uploaded', this.heroList[index].imageId );
      },
      error: () => toast.error('Image upload failed'),
    });
  }

  // ── Save site info (general + social) ──────────────────────────
  saveSiteInfo() {
    this.savingSiteInfo = true;

    const payload: SiteSettingsRequest = {
      companyName: this.form.companyName,
      phone: this.form.phone,
      email: this.form.email,
      address: this.form.address,
      companyLogoId: this.form.companyLogoId,
      workingHours: {
        days: this.form.days,
        openTime: this.form.openTime,
        closeTime: this.form.closeTime,
      },
      socialMediaLinks: {
        facebook: this.form.socialMediaLinks.facebook,
        instagram: this.form.socialMediaLinks.instagram,
        twitter: this.form.socialMediaLinks.twitter,
        youtube: this.form.socialMediaLinks.youtube,
        linkedin: this.form.socialMediaLinks.linkedin,
      },
      metaTitle: this.form.metaTitle,
      metaDescription: this.form.metaDescription,
    };

    const req$ = this.form.id !=null
      ? this.siteSettingService.updateSiteInfo(this.form.id, payload)
      : this.siteSettingService.addSiteSettings(payload);

    req$.subscribe({
      next: (res: any) => {
        const data=res;
        this.form = {
            id: data.id,
            companyName: data.companyName,
            phone: data.phone,
            email: data.email,
            address: data.address,
            days: data.workingHours?.days,
            openTime: data.workingHours?.openTime,
            closeTime: data.workingHours?.closeTime,
            companyLogoId: data.companyLogoId,
            socialMediaLinks: {
              facebook: data.socialMediaLinks?.facebook || '',
              instagram: data.socialMediaLinks?.instagram || '',
              twitter: data.socialMediaLinks?.twitter || '',
              youtube: data.socialMediaLinks?.youtube || '',
              linkedin: data.socialMediaLinks?.linkedin || '',
              tiktok: data.socialMediaLinks?.tiktok || ''
            },
            metaTitle:data.metaTitle,
            metaDescription:data.metaDescription
          };
        this.savingSiteInfo = false;
        toast.success('Site info saved');
      },
      error: () => {
        this.savingSiteInfo = false;
        toast.error('Save failed');
      },
    });
  }

  // ── Hero helpers ────────────────────────────────────────────────
  addHero() {
    if(this.heroList.length>=this.maxHeroSection){
      return;
    }
    this.heroList.unshift({
      id: null,
      title: '',
      details: '',
      imageId: null,
      preview: null,
      saving: false,
    });

  }

  deleteHero(id: number, index: number) {
    if (id) {
      this.siteSettingService.deleteHero(id).subscribe({
        next: () => toast.success('Hero deleted'),
        error: () => toast.error('Delete failed'),
      });
    }
    this.heroList.splice(index, 1);
  }

  saveHero(hero: any) {
    if (this.form.id === null || this.form.id==='') return;
    hero.saving = true;
    const payload: ProjectsHeroSectionRequest = {
      title: hero.title,
      siteSettingId: this.form.id,
      details: hero.details,
      imageId: hero.imageId,
    };

    const req$ = hero.id
      ? this.siteSettingService.updateHero(hero.id, payload)
      : this.siteSettingService.createHero(payload);

    req$.subscribe({
      next: (res: any) => {
        if (!hero.id) hero.id = res.data?.id ?? res.id;
        hero.saving = false;
        toast.success(hero.id ? 'Hero updated' : 'Hero saved');
      },
      error: () => {
        hero.saving = false;
        toast.error('Hero save failed');
      },
    });
  }
}
