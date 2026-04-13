import { Injectable, signal } from '@angular/core';
import { TeamMemberResponse } from '../../services/model/team-member.model';

@Injectable({
  providedIn: 'root'
})
export class TeamMemberStateService {
  private _teamMembers=signal<TeamMemberResponse[]>([]);
  private _totalElements=signal(0);

  //readonly for components
  teamMembers=this._teamMembers.asReadonly();
  totalElements=this._totalElements.asReadonly();

  //called once by TeamMemberTableComponent on load
  setTeamMembers(members:TeamMemberResponse[],total:number){
    this._teamMembers.set(members);
    this._totalElements.set(total);
  }

  //add new member directly to top of list
  addTeamMember(member:TeamMemberResponse){
    this._teamMembers.update(list=>[member,...list]);
    this._totalElements.update(t=>t+1);
  }

  //update existing member in place
  updateTeamMember(update:TeamMemberResponse){
    this._teamMembers.update(
      list=>list.map(m=>m.id === update.id? update:m)
    );
  }

  //remove member from list
  removeTeamMember(id:number){
    this._teamMembers.update(list=>list.filter(m=>m.id != id));
    this._totalElements.update(t=>t-1);
  }
}
