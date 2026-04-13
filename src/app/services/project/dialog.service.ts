import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  
  private projectDialogSource=new BehaviorSubject<boolean>(false);
  projectDialog$=this.projectDialogSource.asObservable();
  constructor() { }

  openProjectDialog(){
    this.projectDialogSource.next(true);
  }
  closeProjectDialog(){
    this.projectDialogSource.next(false);
  }
}
