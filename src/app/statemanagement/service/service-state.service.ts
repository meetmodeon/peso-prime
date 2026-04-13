import { Injectable, signal } from '@angular/core';
import { ServiceResponse } from '../../services/model/Services.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceStateService {
  private _services=signal<ServiceResponse[]>([]);
  private _totalElements=signal(0);

  //readonly for component
  services=this._services.asReadonly();
  totalElements=this._totalElements.asReadonly();

  setServices(services:ServiceResponse[],total:number){
    this._services.set(services);
    this._totalElements.set(total);
  }

  //add new service to top of list
  addService(service:ServiceResponse){
    this._services.update((list)=>[service,...list]);
    this._totalElements.update((t)=>t+1);
  }

  //update existing service in place
  updateService(updated: ServiceResponse){
    this._services.update((list)=>
    list.map((s)=>(s.id === updated.id?updated:s))
    )
  }

  //remove service from list
  removeService(id:number){
    this._services.update((list)=>list.filter((s)=>s.id !== id));
    this._totalElements.update((t)=>t-1);
  }
}
