import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  private dialogSoruce=new BehaviorSubject<boolean>(false);
  dialog$=this.dialogSoruce.asObservable();

  openDialog(){
    this.dialogSoruce.next(true);
  }

  closeDialog(){
    this.dialogSoruce.next(false);
  }
}
