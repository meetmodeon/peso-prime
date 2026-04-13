import { Component, effect, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Drawer, DrawerModule } from 'primeng/drawer';
import { PopoverModule } from 'primeng/popover';
import { DialogModule, Dialog } from 'primeng/dialog';
import TypeIt from 'typeit';
import { QueryPageComponent } from "../query-page/query-page.component";
import { DialogService } from '../../../services/query-dialogbox/dialog.service';
import { SiteSettingsStateService } from '../../../statemanagement/siteSettings/site-settings-state.service';
import { SecureImageDirective } from "../../../directives/secure-image/secure-image.directive";
@Component({
  selector: 'app-navbar',
  imports: [
    ButtonModule,
    PopoverModule,
    DrawerModule,
    RouterLink,
    RouterLinkActive,
    DialogModule,
    QueryPageComponent,
    SecureImageDirective,
    
],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  visible=false;
  siteSetting:any
  constructor(
    private router:Router,
    private dialogService:DialogService,
    private siteSettingState:SiteSettingsStateService
  ){
    this.siteSetting=this.siteSettingState.siteSetting;
   
  }
  ngOnInit(){
    this.siteSettingState.loadSiteSetting();
    this.dialogService.dialog$.subscribe(show=>{
      this.visible=show;
    })
  }

  showDialog(){
    this.dialogService.openDialog();
  }
  
  getSpliteString(value:string,index:number):string{
    if(value==null) return 'Hi Peso';
    const firstSpaceIndex=value.indexOf(' ');
    
    const part1= value.substring(0,firstSpaceIndex);
    const part2= value.substring(firstSpaceIndex+1);
    return index==0?part1:part2;
  }



 
}
