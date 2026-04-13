import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-component',
  templateUrl: './map-component.component.html',
  styleUrls: ['./map-component.component.scss'],
})
export class MapComponentComponent implements AfterViewInit {

  projects = [
    { name: 'Road Construction Project', lat: 27.717194, lng: 85.323999 },
    { name: 'Bridge Soil Testing', lat: 27.705, lng: 85.315 },
    { name: 'Apartment Foundation Study', lat: 27.73, lng: 85.335 },
    { name: 'Janakpur Apartment Foundation Study', lat: 26.7284541, lng: 85.9249005 },
  ];

  ngAfterViewInit(): void {
    const map = L.map('map').setView([27.7172, 85.324], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    const projectIcon = L.icon({
      iconUrl: '/map_icons/marker-icon-2x.png',
      iconRetinaUrl: '/map_icons/marker-icon.png',
      shadowUrl: '/map_icons/marker-shadow.png',
      iconSize: [30, 40],
      iconAnchor: [15, 40],
      popupAnchor: [0, -40]
    });

    this.projects.forEach((project) => {
      L.marker([project.lat, project.lng], { icon: projectIcon })
        .addTo(map)
        .bindPopup(project.name);
    });
  }
}