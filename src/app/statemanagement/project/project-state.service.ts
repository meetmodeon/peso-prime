import { inject, Injectable, signal } from '@angular/core';
import { ProjectResponse } from '../../services/model/ProjectResponse.model';
import { ProjectService } from '../../services/project/project.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectStateService {

  private _projects=signal<ProjectResponse[]>([]);
  private _totalElements=signal(0);
  private projectService=inject(ProjectService);
  private _homeProject=signal<ProjectResponse[]>([]);

  private _homeCache=new Map<number,ProjectResponse[]>();
  private _projectCache=new Map<number,ProjectResponse[]>();

  //readonly for components
  readonly projects=this._projects.asReadonly();
  readonly homeProject=this._homeProject.asReadonly();
  readonly totalElements=this._totalElements.asReadonly();

  loadHomeProject(page:number,size:number){

    if(this._homeCache.has(page)){
      this._homeProject.set(this._homeCache.get(page)??[]);
      return;
    }
    this.projectService.getAll('ALL',page,size).subscribe({
      next:(res)=>{
        this._homeProject.set(res.content);
        this._homeCache.set(page,res.content);
        this._totalElements.set(res.totalElements);
      },
      error:(err:Error)=>{
        console.error('Error loading projects: ',err);
      }
    })
  }

  loadProject(page:number,size:number){
    if(this._projectCache.has(page)){
      const cacheData=this._projectCache.get(page);
      this._projects.set(cacheData??[]);
      return;
    }
  
    this.projectService.getAll('ALL',page,size).subscribe({
      next:(res)=>{
        this._homeProject.set(res.content);
        this._projects.set(res.content);
        this._totalElements.set(res.totalElements);
      },
      error:(err:Error)=>{
        console.log(err.message ||'Something went wrong');
      }
    })
  }

  
  setProjects(projects: ProjectResponse[],total:number){
    this._projects.set(projects);
    this._totalElements.set(total);
  }

  // add new Project to top of list
  addProject(project: ProjectResponse){
    this._projects.update((list)=>[project,...list]);
    this._totalElements.update((t)=>t+1);

  }

  // update existing project in place
  updateProject(updated: ProjectResponse){
    this._projects.update((list)=>
    list.map((p)=>(p.id=== updated.id ? updated:p))
    );
  }

  //remove project from list
  removeProject(id:number){
    this._projects.update((list)=>list.filter((p)=>p.id !== id));
    this._totalElements.update((t)=>t-1);
  }
}
