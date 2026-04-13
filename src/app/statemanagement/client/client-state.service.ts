import { Injectable, signal } from '@angular/core';
import { ClientResponse } from '../../services/model/Client.model';
import { ClientService } from '../../services/client/client.service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientStateService {

  private _clients=signal<ClientResponse[]>([]);
  private _totalElements=signal(0);
  private _loaded=signal(false);
  private _loading=signal(false);
  

  //readonly for components
  clients=this._clients.asReadonly();
  totalElements=this._totalElements.asReadonly();
  loaded=this._loaded.asReadonly();
  loading=this._loading.asReadonly();

  constructor(private clientService:ClientService){}

  loadClientOnce(){
    if(this._loaded()) return;
    if(this._loading()) return;

    this._loading.set(true);

    this.clientService.getAll().pipe(
      tap((res)=>{
        this._clients.set(res.content||[]);
        this._totalElements.set(res.totalElements || 0);

        this._loaded.set(true);
        this._loading.set(false);
      })
    ).subscribe();
  }
  
  setClients(clients:ClientResponse[],total:number){
    this._clients.set(clients);
    this._totalElements.set(total);
  }

  // add new client to top of list
  addClient(client:ClientResponse){
    this._clients.update((list)=>[client,...list]);
    this._totalElements.update((t)=>t+1);
  }

  //update existing client in place
  updateClient(updated:ClientResponse){
    this._clients.update((list)=>
    list.map((c)=>(c.id === updated.id?updated:c)));
  }

  //remove client from list
  removeClient(id:number){
    this._clients.update((list)=>list.filter((p)=>p.id != id));
    this._totalElements.update((t)=>t-1);
  }


  
}
