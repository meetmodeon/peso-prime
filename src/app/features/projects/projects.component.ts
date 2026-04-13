import { Component } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { DialogService } from '../../services/project/dialog.service';
import { DrawerModule } from 'primeng/drawer';
import { ProjectComponent } from "./project/project.component";
import { CommonModule } from '@angular/common';
import { CountAnimationDirective } from "../../directives/countAnimation/count-animation.directive";
import { ProjectStateService } from '../../statemanagement/project/project-state.service';
import { ProjectResponse } from '../../services/model/ProjectResponse.model';
import { ProjectService } from '../../services/project/project.service';
import { SecureImageDirective } from '../../directives/secure-image/secure-image.directive';
import { StatusFilter } from '../../services/model/FileType.model';
import { SeoService } from '../../services/seo/seo.service';
import { SEO_CONFIG } from '../../services/model/SEO_CONFIG.model';

export interface Tab {
  label: string;
  value: string;
}

@Component({
  selector: 'app-projects',
  imports: [
    GoogleMapsModule,
    DrawerModule,
    CommonModule,
    ProjectComponent,
    CountAnimationDirective,
    SecureImageDirective
],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent {
  projects:ProjectResponse[]=[];
  loading = false;
  loadingMore = false;
  isLastPage = false;
  totalElements = 0;
  remainingCount = 0;
 
  visible=false;
  selectedProject!: ProjectResponse;
 
  activeTab:StatusFilter = 'ALL';
 
  tabs: Tab[] = [
    { label: 'All Projects', value: 'ALL' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Ongoing', value: 'ONGOING' },
    { label: 'Upcoming', value: 'UPCOMING' },
  ];
 
  private currentPage = 0;
  private pageSize = 8;
 
  constructor(
    private projectService: ProjectService,
    private dialogService:DialogService,
    private seoService:SeoService
  ) {}
 
  ngOnInit(): void {
    this.loadProjects();
    this.dialogService.projectDialog$.subscribe((status)=>{
      this.visible=status;
    })
    this.seoService.setSEO(SEO_CONFIG.projects);
  }
 
  loadProjects(): void {
    this.loading = true;
    this.currentPage = 0;
    this.projects = [];
    this.projectService.getAll(this.activeTab,this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.projects = res.content;
        this.totalElements = res.totalElements;
        this.isLastPage = res.last;
        this.remainingCount = this.totalElements - this.projects.length;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
 
  selectTab(tab: Tab): void {
    if (this.activeTab === tab.value) return;
    this.activeTab = tab.value as StatusFilter;
    this.loadProjects();
  }
 
  loadMore(): void {
    this.loadingMore = true;
    this.currentPage++;
 
    const status = this.activeTab;
 
    this.projectService.getAll(status,this.currentPage, this.pageSize).subscribe({
      next: (res) => {
        this.projects = [...this.projects, ...res.content];
        this.isLastPage = res.last;
        this.remainingCount = this.totalElements - this.projects.length;
        this.loadingMore = false;
      },
      error: () => {
        this.loadingMore = false;
      }
    });
  }
 
  showProject(project: ProjectResponse): void {
   this.selectedProject={...project};
   this.dialogService.openProjectDialog();
  }
  
  getTags(tags:string|null|undefined):string[]{
    if(!tags) return [];
    return tags.split(',').map(t=>t.trim());
  }

}
