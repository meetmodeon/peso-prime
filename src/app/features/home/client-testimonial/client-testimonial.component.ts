import { Component, effect, Input } from '@angular/core';
import { SecureImageDirective } from "../../../directives/secure-image/secure-image.directive";
import { CommonModule } from '@angular/common';
import { ClientStateService } from '../../../statemanagement/client/client-state.service';
import { ClientService } from '../../../services/client/client.service';
import { ClientRequest } from '../../../services/model/Client.model';

@Component({
  selector: 'app-home-client-testimonial',
  imports: [
    CommonModule,
    SecureImageDirective
],
  templateUrl: './client-testimonial.component.html',
  styleUrl: './client-testimonial.component.scss'
})
export class ClientTestimonialComponent {
  clientResponse:ClientRequest[]=[];
  constructor(private clientService:ClientService){
  
  }

  ngOnInit(){
    this.clientService.getAll(undefined,0,4).subscribe({
      next:(res)=>{
        this.clientResponse=res.content;
      }
    })
  }

  


  

}
