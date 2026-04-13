import { Component } from '@angular/core';
import { ServiceResponse } from '../../../../../services/model/Services.model';
import { ServiceType } from '../../../../../services/model/FileType.model';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ServicesService } from '../../../../../services/service/services.service';
import { CommonModule } from '@angular/common';
import { SecureImageDirective } from "../../../../../directives/secure-image/secure-image.directive";

@Component({
  selector: 'app-view-service',
  imports: [
    CommonModule,
    RouterLink,
    SecureImageDirective
],
  templateUrl: './view-service.component.html',
  styleUrl: './view-service.component.scss'
})
export class ViewServiceComponent {
  service:ServiceResponse|null=null;
  loading=true;
  deleting=false;
  error:string|null=null;

  readonly imageBase='';

  readonly typeIcons: Record<ServiceType, string> = {
  ENVIRONMENT:      'pi-globe',
  AGRICULTURAL:     'pi-leaf',
  PROFESSIONAL:     'pi-briefcase',
  GOVERNMENT:       'pi-building',
  ADVANCED_RESEARCH: 'pi-search',
};
 
  readonly typeBadgeClass: Record<ServiceType, string> = {
  ENVIRONMENT:      'bg-green-50  text-green-700  border-green-200',
  AGRICULTURAL:     'bg-lime-50   text-lime-700   border-lime-200',
  PROFESSIONAL:     'bg-blue-50   text-blue-700   border-blue-200',
  GOVERNMENT:       'bg-slate-50  text-slate-700  border-slate-200',
  ADVANCED_RESEARCH: 'bg-purple-50 text-purple-700 border-purple-200',
};
 
  readonly typeIconBg: Record<ServiceType, string> = {
  ENVIRONMENT:      'bg-green-100  text-green-600',
  AGRICULTURAL:     'bg-lime-100   text-lime-600',
  PROFESSIONAL:     'bg-blue-100   text-blue-600',
  GOVERNMENT:       'bg-slate-200  text-slate-600',
  ADVANCED_RESEARCH: 'bg-purple-100 text-purple-600',
};


constructor(
  private route:ActivatedRoute,
  private router:Router,
  private svc:ServicesService,
){}


ngOnInit():void{
  const id=Number(this.route.snapshot.paramMap.get('id'));
  this.svc.getServiceById(id).subscribe({
    next:(s)=>{
      this.service=s;
      this.loading=false;
    },
    error:()=>{this.error='Failed to load service details.';
      this.loading=false;
    }
  });
}

confirmDelete():void{
  if(!this.service) return;
  if(!confirm(`Delete "${this.service.title}"? this cannot be undone`)) return;

  this.deleting=true;
  this.svc.deleteServiceById(this.service.id).subscribe({
    next:()=>this.router.navigate(['/admin/services']),
    error:()=> {this.deleting=false; this.error='Failed to delete service.';},
  }
)
}

badge(type: ServiceType): string {
  return this.typeBadgeClass[type] ?? this.typeBadgeClass['PROFESSIONAL'];
}

iconBg(type: ServiceType): string {
  return this.typeIconBg[type] ?? this.typeIconBg['PROFESSIONAL'];
}

icon(type: ServiceType): string {
  return this.typeIcons[type] ?? 'pi-briefcase';
}

trackByIndex(i: number): number { return i; };

}
