import { Component, effect } from '@angular/core';
import { ProjectStateService } from '../../../../statemanagement/project/project-state.service';
import { CommonModule } from '@angular/common';
import { SecureImageDirective } from "../../../../directives/secure-image/secure-image.directive";
import { SeoService } from '../../../../services/seo/seo.service';
import { SEO_CONFIG } from '../../../../services/model/SEO_CONFIG.model';

@Component({
  selector: 'app-home-project',
  imports: [
    CommonModule,
    SecureImageDirective
],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent {
  homeProject:any;

  constructor(private projectStateService:ProjectStateService,private seoService:SeoService){
    this.homeProject=this.projectStateService.homeProject;
  };

  ngOnInit(){
    this.projectStateService.loadHomeProject(0,3);
    this.seoService.setSEO(SEO_CONFIG.projects)
  }

}
