import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

// ------------------------------------------------------------------ //
//  Interfaces
// ------------------------------------------------------------------ //

interface Holding {
  '@id'?: string;
  availabilityStatus: 'available' | 'unavailable' | 'check_holdings' | string;
  mainLocation: string;
  subLocation?: string;
  callNumber?: string;
  stackMapUrl?: string;
  libraryCode?: string;
  subLocationCode?: string;
  uniqId?: string;
  [key: string]: any;
}

interface AvailabilityConfig {
  color: string;
  label: string;
  cssClass: string;
}

const AVAILABILITY_CONFIG: Record<string, AvailabilityConfig> = {
  available: {
    color: '#368704',
    label: 'delivery.code.available_in_maininstitution',
    cssClass: 'ubm-holding--available'
  },
  unavailable: {
    color: '#c0392b',
    label: 'delivery.code.unavailable',
    cssClass: 'ubm-holding--unavailable'
  },
  check_holdings: {
    color: '#e67e22',
    label: 'delivery.code.check_holdings_in_maininstitution',
    cssClass: 'ubm-holding--check'
  },
  default: {
    color: '#7f8c8d',
    label: 'Statut inconnu',
    cssClass: 'ubm-holding--unknown'
  }
};

// ------------------------------------------------------------------ //
//  Composant
// ------------------------------------------------------------------ //

@Component({
  selector: 'custom-ubm-custom-availability-component',
  standalone: true,
  imports: [CommonModule,TranslateModule],
  templateUrl: './ubm-custom-availability.component.html',
  styleUrl: './ubm-custom-availability.component.scss'
})
export class UbmCustomAvailabilityComponent {

  holdings: Holding[] = [];
  physicalAvailability: string | null = null;
  private originalAvailabilityEl: HTMLElement | null = null;

  // ------------------------------------------------------------------ //
  //  Inputs Primo
  // ------------------------------------------------------------------ //

  @Input() set hostComponent(value: any) {
    console.log('UbmCustomAvailabilityComponentComponent hostComponent:', value);
    if (!value) return;
    this.physicalAvailability  = value.physicalAvailability;
    this.holdings = value.docDelivery?.holding ?? [];
    console.log('[UBM-Availability] holdings :', this.holdings);
  }

  @Input() set parentElement(el: HTMLElement) {
    if (!el) return;
    this.originalAvailabilityEl = el.querySelector('nde-physical-availability-line');
    console.log('[UBM-Availability] originalAvailabilityEl :', this.originalAvailabilityEl);
  }

  // ------------------------------------------------------------------ //
  //  Helpers template
  // ------------------------------------------------------------------ //

  getConfig(holding: Holding): AvailabilityConfig {
    return AVAILABILITY_CONFIG[holding.availabilityStatus] ?? AVAILABILITY_CONFIG['default'];
  }

  getAriaLabel(holding: Holding): string {
    return [
      this.getConfig(holding).label,
      holding.mainLocation,
      holding.subLocation,
      holding.callNumber
    ].filter(Boolean).join(' – ');
  }

  // ------------------------------------------------------------------ //
  //  Clic localisation → déléguer au bouton original
  // ------------------------------------------------------------------ //
  onHoldingClick(event: MouseEvent): void {
  event.preventDefault();
  event.stopPropagation();

  // Recherche au moment du clic — le DOM est forcément rendu
  const originalBtn = this.originalAvailabilityEl
    ?.querySelector<HTMLButtonElement>('button.available-at-button');

  if (originalBtn) {
    console.log('[UBM-Availability] délégation clic → bouton original');
    originalBtn.click();
    return;
  }

  // Fallback : chercher dans tout le document si parentElement n'était pas bon
  console.warn('[UBM-Availability] bouton introuvable via originalAvailabilityEl, fallback document');
  const fallbackBtn = document
    .querySelector<HTMLButtonElement>('nde-physical-availability-line button.available-at-button');

  if (fallbackBtn) {
    fallbackBtn.click();
  } else {
    console.error('[UBM-Availability] bouton .available-at-button introuvable dans tout le document');
  }
}

  // ------------------------------------------------------------------ //
  //  Clic carte → ne pas propager
  // ------------------------------------------------------------------ //

  onMapClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}