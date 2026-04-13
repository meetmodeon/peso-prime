import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { GalleriaModule } from 'primeng/galleria';
import { DialogService } from '../../../services/project/dialog.service';
import { DividerModule } from 'primeng/divider';
import { ProjectResponse } from '../../../services/model/ProjectResponse.model';
import { SecureImageDirective } from '../../../directives/secure-image/secure-image.directive';

@Component({
  selector: 'app-project',
  imports: [
    GalleriaModule,
    DividerModule,
    SecureImageDirective
  ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss',
})
export class ProjectComponent {
  @Input() project!:ProjectResponse;
  
  images: any[] = [];
  responsiveOptions: any[] = [
    { breakpoint: '1024px', numVisbile: 3 },
    { breakpoint: '768px', numVisible: 2 },
    { breakpoint: '560px', numVisible: 1 },
  ];

  constructor(private projectDialogs:DialogService){}

   ngOnChanges(changes: SimpleChanges) {
    if (changes['project'] && this.project) {
      this.images = this.project.imageIds ? [...this.project.imageIds] : [];
    }
  }
  closeForm(){
    this.projectDialogs.closeProjectDialog();
  }

  getYear(date:string){
    const year=new Date(date).getFullYear();
    return year;
  }
}
