import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { StatusFilter } from '../../../../../services/model/FileType.model';
import { ProjectService } from '../../../../../services/project/project.service';
import { ProjectStateService } from '../../../../../statemanagement/project/project-state.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-all-pojects',
  imports: [
    RouterLink,
    CommonModule,
  ],
  templateUrl: './all-pojects.component.html',
  styleUrl: './all-pojects.component.scss'
})
export class AllPojectsComponent {

  //Pagination state
  currentPage=0;
  pageSize=10;
  totalPages=0;
  isFirstPage=true;
  isLastPage=true;

  //UI state
  loading=false;
  error:string|null=null;
  activeTab:StatusFilter='ALL';

  //Filter tabs config
  tabs:{label:string;value:StatusFilter}[]=[
    {label:'All Projects',value:'ALL'},
    {label:'OnGoing', value:'ONGOING'},
    {label:"Completed",value:'COMPLETED'},
    {label:'Pending',value:'PENDING'}
  ];

  constructor(
    private projectService:ProjectService,
    public state:ProjectStateService
  ){}

  ngOnInit():void{
    this.loadProjects();
  }

  // Load/Reload
  loadProjects():void{
    this.loading=true;
    this.error=null;
    const statusParam=this.activeTab;

    this.projectService.getAll(statusParam,this.currentPage,this.pageSize).subscribe({
      next:(data)=>{
        this.state.setProjects(data.content,data.totalElements);
        this.totalPages=data.totalPages;
        this.isFirstPage=data.first;
        this.isLastPage=data.last;
        this.loading=false;
      },
      error:()=>{
        this.error='Failed to load projects.Please try again.';
        this.loading=false;
      }
    });
  }

  //Tab filter
    setActiveTab(tab: StatusFilter): void {
    if (this.activeTab === tab) return;
    this.activeTab   = tab;
    this.currentPage = 0;
    this.loadProjects();
    // TODO: pass status filter param to your API when backend supports it
    // e.g. this.projectService.getAll(0, this.pageSize, tab !== 'ALL' ? tab : undefined)
  }

  //Pagination
  goToPage(page:number):void{
    if(page<0 || page>= this.totalPages) return;
    this.currentPage=page;
    this.loadProjects();
  }

  get startItem():number{
    return this.currentPage*this.pageSize+1;
  }

  get endItem():number{
    return Math.min(
      (this.currentPage+1)*this.pageSize,
      this.state.totalElements()
    );
  }

  getVisiblePages(): number[]{
    const total=this.totalPages;
    const current=this.currentPage;
    const pages: number[]=[];

    if(total<=7) return Array.from({length:total},(_,i)=>i);
    pages.push(0);
    if(current>2) pages.push(-1);

    for(let i=Math.max(1,current-1);i <=Math.min(total-2,current+1);i++){
      pages.push(i);
    }

    if(current<total-3) pages.push(-1);
    pages.push(total-1);
    return pages;
  }


  //Delete
  deleteProject(id:number,title:string):void{
    if(!confirm(`Delete "${title}"? This Cannot be undone.`)) return;

    this.projectService.delete(id).subscribe({
      next:(data:any)=>this.state.removeProject(id),
      error:()=>alert('Failed to delete project. Please try again.'),
    });
  }

  //Status styling
  getStatusClass(status:string):string{
    const map:Record<string,string>={
      ONGOING:   'bg-blue-50 text-blue-700 border-blue-200',
      COMPLETED: 'bg-green-50 text-green-700 border-green-200',
      PENDING:   'bg-amber-50 text-amber-700 border-amber-200',
    };
    return map[status] ?? 'bg-slate-100 text-slate-600 border-slate-200';
  }

  getStatusDotClass(status: string):string{
    const map: Record<string, string> = {
      ONGOING:   'bg-blue-500',
      COMPLETED: 'bg-green-500',
      PENDING:   'bg-amber-500',
    };
    return map[status] ?? 'bg-slate-400';
  }
}
