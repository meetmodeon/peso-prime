import { Component } from '@angular/core';
import { ClientFormComponent } from "../client-form/client-form.component";
import { ClientService } from '../../../../../services/client/client.service';
import { Router } from '@angular/router';
import { ClientStateService } from '../../../../../statemanagement/client/client-state.service';
import { ClientRequest } from '../../../../../services/model/Client.model';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-add-client',
  imports: [ClientFormComponent],
  templateUrl: './add-client.component.html',
  styleUrl: './add-client.component.scss'
})
export class AddClientComponent {

  constructor(
    private service:ClientService,
    private router:Router,
    private clientState:ClientStateService
  ){}
  
  handleSubmit(data:ClientRequest){
    this.service.add(data)
    .subscribe({
      next:(res)=>{
        this.clientState.addClient(res);
        toast.success('Client added successfully');
        this.router.navigate(['/admin/clients']);
      }
    });
    
  }
}
