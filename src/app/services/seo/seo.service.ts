import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SeoService {

  constructor(
    private title:Title,
    private meta:Meta
  ) { }

  setSEO(data:{title:string;description:string;keywords?:string}){
    this.title.setTitle(data.title);

    this.meta.updateTag({
      name: 'description',
      content: data.description
    });

    //Open Graph
    this.meta.updateTag({
      property:"og:title",
      content:data.title
    });

    this.meta.updateTag({
      property:'og:description',
      content:data.description
    })
  }
}
