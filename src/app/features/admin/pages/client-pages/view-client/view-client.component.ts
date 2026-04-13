import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ClientService } from '../../../../../services/client/client.service';
import { SecureImageDirective } from '../../../../../directives/secure-image/secure-image.directive';

@Component({
  selector: 'app-view-client',
  imports: [
    CommonModule,
    SecureImageDirective,
    RouterLink
],
  templateUrl: './view-client.component.html',
  styleUrl: './view-client.component.scss'
})
export class ViewClientComponent {

  clientId !:number;
  clientData: any;
  loading = true;

  constructor(
    private route:ActivatedRoute,
    private service: ClientService
  ){}

  ngOnInit():void{
    this.clientId = Number(this.route.snapshot.paramMap.get('id'));

    this.service.getById(this.clientId).subscribe({
      next:(res)=>{
        this.clientData= res;
        this.loading= false;
      },
      error:()=>{
        this.loading=false;
      }
    });
  }

}
