import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UbmAuthService } from '../ubm-services/ubm-auth.service';
import { AssetsPublicPathDirective } from '../services/assets-public-path.directive'; 

@Component({
  selector: 'custom-ubm-help-overlay',
  standalone: true,
  imports: [CommonModule, AssetsPublicPathDirective],
  templateUrl:'./ubm-help-overlay.component.html',
  styleUrl:'./ubm-help-overlay.component.scss'
})

export class UbmHelpOverlayComponent {
  isOpen = false;
  activeTab = 0;
  // Injection du service partagé
  constructor(public authService: UbmAuthService) {}


  toggleAide() {
    this.isOpen = !this.isOpen;
  }
}