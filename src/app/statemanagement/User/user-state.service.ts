import { Injectable, signal } from '@angular/core';
import { SystemUserResponse } from '../../services/User/user.service';

@Injectable({
  providedIn: 'root'
})
export class UserStateService {
  private _users = signal<SystemUserResponse[]>([]);
  private _totalElements= signal(0);

  //readonly for components
  users= this._users.asReadonly();
  totalElements= this._totalElements.asReadonly();

  //called once by UsersComponents on load
  setUsers(users:SystemUserResponse[],total:number){
    this._users.set(users);
    this._totalElements.set(total);
  }

  // add new user directly to top of list
  addUser(user:SystemUserResponse){
    this._users.update(list=>[user,...list]);
    this._totalElements.update(t=>t+1);
  }

  //update existing user in place
  updateUser(updated: SystemUserResponse){
    this._users.update(list=>
      list.map(u=> u.username=== updated.username ? updated: u)
    );
  }

  //remove user from list
  removeUser(username: string){
    this._users.update(list=>list.filter(u=>u.username !== username));
    this._totalElements.update(t=>t-1);
  }
}
