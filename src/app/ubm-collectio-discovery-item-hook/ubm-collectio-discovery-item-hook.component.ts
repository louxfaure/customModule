import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'custom-ubm-collectio-discovery-item-hook',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ubm-collectio-discovery-item-hook.component.html',
  styleUrl: './ubm-collectio-discovery-item-hook.component.scss'
})
export class UbmCollectioDiscoveryItemHookComponent {
  
  firstLine: string = '';
  secondLine: string = '';

  @Input() set hostComponent(value: any) {
    console.log(value);
    if (value?.item?.pnx?.display) {
      // Inversion demandée : lds02 (AngularJS) devient lds01 (Angular)
      this.firstLine = value.item.pnx.display.lds01[0] || '';
      // Inversion demandée : lds01 (AngularJS) devient lds02 (Angular)
      this.secondLine = value.item.pnx.display.lds02[0] || '';
    }
  }
}