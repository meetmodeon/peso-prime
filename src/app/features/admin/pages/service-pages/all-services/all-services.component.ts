import { Component } from '@angular/core';
import { ServiceResponse } from '../../../../../services/model/Services.model';
import { ServicesService } from '../../../../../services/service/services.service';
import { ServiceStateService } from '../../../../../statemanagement/service/service-state.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SecureImageDirective } from "../../../../../directives/secure-image/secure-image.directive";
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-all-services',
  imports: [
    CommonModule,
    RouterLink,
    FormsModule,
    SecureImageDirective
],
  templateUrl: './all-services.component.html',
  styleUrl: './all-services.component.scss'
})
export class AllServicesComponent {

  services:ServiceResponse[]=[];
  loading=false;
  error:string|null=null;

  searchQuery='';
  currentPage=0;
  pageSize=10;
  totalElements=0;
  totalPages=0;
  
  deleting:number|null=null;

  constructor(
    private serviceApi: ServicesService,
    private state: ServiceStateService
  ){}

  ngOnInit(){
    this.loadServices();
  }

  loadServices(){
    this.loading=true;
    this.error=null;

    this.serviceApi.getAllService(
      this.searchQuery,
      this.currentPage,
      this.pageSize
    ).subscribe({
      next:(page:any)=>{
        

        this.services=page.content;
        this.totalElements=page.totalElements;
        this.totalPages=page.totalPages;
        this.currentPage=page.number;

        this.state.setServices(page.content,page.totalElements);
        this.loading=false;
      },
      error:()=>{
        this.error='Failed to load services';
        this.loading=false;
      }
    });
  }


  onSearch(value:any){
    this.searchQuery=value;
    this.currentPage=0;
    this.loadServices();
  }

  clearSearch(){
    this.searchQuery='';
    this.currentPage=0;
    this.loadServices();
  }

  goToPage(page:number){
    if(page<0 || page>= this.totalPages) return ;
    this.currentPage=page;
    this.loadServices();
  }

  confirmDelete(service:ServiceResponse){
    if(!confirm(`Delete ${service.title}?`)) return;

    this.deleting=service.id;

    this.serviceApi.deleteServiceById(service.id).subscribe({
      next:()=>{
        this.state.removeService(service.id);
        this.loadServices();
        toast.success("Deleted successfully!")
        this.deleting=null;
      },
      error:()=>{
        this.deleting=null;
        this.error='Delete failed';
        toast.error(this.error);
      }
    });
    
  }

  trackById(index: number, item: ServiceResponse) {
    return item.id;
  }

  truncate(text: string, limit: number = 100) {
    if (!text) return '';
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  }

  typeIcon(type: string): string {
    switch (type?.toLowerCase()) {
      case 'design': return 'pi pi-pencil';
      case 'survey': return 'pi pi-compass';
      case 'supervision': return 'pi pi-eye';
      default: return 'pi pi-cog';
    }
  }

  typeClass(type: string): string {
    switch (type?.toLowerCase()) {
      case 'design': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'survey': return 'bg-green-50 text-green-600 border-green-100';
      case 'supervision': return 'bg-purple-50 text-purple-600 border-purple-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  }

  // pagination helpers
  get startItem() {
    return this.totalElements === 0 ? 0 : this.currentPage * this.pageSize + 1;
  }

  get endItem() {
    return Math.min((this.currentPage + 1) * this.pageSize, this.totalElements);
  }

  get isFirstPage() {
    return this.currentPage === 0;
  }

  get isLastPage() {
    return this.currentPage >= this.totalPages - 1;
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];

    for (let i = 0; i < this.totalPages; i++) {
      if (
        i === 0 ||
        i === this.totalPages - 1 ||
        (i >= this.currentPage - 1 && i <= this.currentPage + 1)
      ) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== -1) {
        pages.push(-1);
      }
    }

    return pages;
  }
  

}
