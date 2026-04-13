import { Component } from '@angular/core';
import { ClientFormComponent } from "../client-form/client-form.component";
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../../../../services/client/client.service';
import { ClientRequest } from '../../../../../services/model/Client.model';
import { toast } from 'ngx-sonner';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-edit-client',
  imports: [
    ClientFormComponent, 
    CommonModule
  ],
  templateUrl: './edit-client.component.html',
  styleUrl: './edit-client.component.scss'
})
export class EditClientComponent {

  clientId !: number;
  clientData: any;

  constructor(
    private route:ActivatedRoute,
    private service: ClientService,
    private router:Router
  ){}

  ngOnInit():void{
    this.clientId=Number(this.route.snapshot.paramMap.get('id'));

    this.service.getById(this.clientId).subscribe(res=>{
      this.clientData=res;
    });
  }

  handleSubmit(data:ClientRequest){
    this.service.update(this.clientId,data).subscribe({
      next:()=>{
        toast.success('Client updated successfully');
        this.router.navigate(['/admin/clients']);
      }
    })
  }

}
