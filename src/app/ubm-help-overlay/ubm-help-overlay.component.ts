import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'custom-ubm-help-overlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl:'./ubm-help-overlay.component.html',
  styleUrl:'./ubm-help-overlay.component.scss'
})
export class UbmHelpOverlayComponent {
  isOpen = false;
  activeTab = 0;

  toggleAide() {
    this.isOpen = !this.isOpen;
  }
}