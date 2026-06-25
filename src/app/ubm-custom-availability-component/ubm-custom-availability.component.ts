import { Component, Input, Inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';


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
  available: { color: '#368704', label: 'delivery.code.available_in_maininstitution', cssClass: 'ubm-holding--available' },
  unavailable: { color: '#c0392b', label: 'delivery.code.unavailable', cssClass: 'ubm-holding--unavailable' },
  check_holdings: { color: '#e67e22', label: 'delivery.code.check_holdings_in_maininstitution', cssClass: 'ubm-holding--check' },
  default: { color: '#7f8c8d', label: 'Statut inconnu', cssClass: 'ubm-holding--unknown' }
};

@Component({
  selector: 'custom-ubm-custom-availability-component',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatIconModule],
  templateUrl: './ubm-custom-availability.component.html',
  styleUrl: './ubm-custom-availability.component.scss'
})
export class UbmCustomAvailabilityComponent implements OnInit, OnDestroy {

  @Input() hostComponent: any;
  @Input() parentElement!: HTMLElement;

  holdings: Holding[] = [];
  physicalAvailability: string | null = null;
  
  isFullDisplay: boolean = false;
  hasAlmaInstitutions: boolean = false;
  isLogin: boolean = false;

  hasMagasin: boolean = false;
  isUnavailable: boolean = false;
  isNoInventory: boolean = false;

  private urlCheckIntervalId: any = null;
  private lastUrl: string = '';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.lastUrl = window.location.href;
    this.evaluateState();

    // Surveillance active et permanente de l'URL (Infaillible lors de la navigation par flèches)
    this.urlCheckIntervalId = setInterval(() => {
      const currentUrl = window.location.href;
      if (currentUrl !== this.lastUrl) {
        console.log('[UBM-Availability] 🗺️ L\'URL a changé ! Navigation latérale détectée.');
        this.lastUrl = currentUrl;
        
        // 1. On nettoie tout immédiatement pour effacer l'ancien message menteur
        this.resetState();
        
        // 2. On attend un tout petit peu (150ms) que Primo injecte le nouveau DOM de la notice
        setTimeout(() => {
          this.evaluateState();
        }, 150);
      }
    }, 200); // Très réactif (5 fois par seconde)
  }

  ngOnDestroy(): void {
    if (this.urlCheckIntervalId) {
      clearInterval(this.urlCheckIntervalId);
    }
  }

  private resetState(): void {
    this.hasMagasin = false;
    this.isUnavailable = false;
    this.isNoInventory = false;
    this.hasAlmaInstitutions = false;
    this.cdr.detectChanges(); // Force l'effacement visuel instantané dans le template
  }

  private evaluateState(): void {
    // Si Primo ne met pas à jour l'objet hostComponent, on va chercher l'information directement
    // là où elle se trouve : dans le DOM mis à jour de la nouvelle notice.
    
    // 1. Détection environnementale
    const userButton = this.document.getElementById('user-area-button');
    this.isLogin = userButton ? userButton.classList.contains('user-area-logged-in') : false;
    this.isFullDisplay = !!this.document.querySelector('nde-full-display-service-container, prm-full-display');

    // 2. Extraction du statut textuel de disponibilité natif
    const availabilityEl = this.document.querySelector('nde-physical-availability-line, prm-physical-availability-line');
    const locationsText = availabilityEl?.textContent || '';
    
    // Détection Magasin
    this.hasMagasin = locationsText.toLowerCase().includes('magasin');

    // Détection d'indisponibilité textuelle (en secours si l'objet de données est figé)
    const textLower = locationsText.toLowerCase();
    this.isUnavailable = textLower.includes('indisponible') || textLower.includes('emprunté') || textLower.includes('all items are checked out');
    this.isNoInventory = textLower.includes('pas d\'exemplaire') || textLower.includes('no inventory');

    // 3. Si toutefois l'objet hostComponent s'est mis à jour, on affine avec les données réelles
    if (this.hostComponent) {
      if (this.hostComponent.physicalAvailability) {
        this.physicalAvailability = this.hostComponent.physicalAvailability;
        this.isUnavailable = this.physicalAvailability === 'unavailable';
        this.isNoInventory = this.physicalAvailability === 'no_inventory';
      }
      if (this.hostComponent.docDelivery?.holding) {
        this.holdings = this.hostComponent.docDelivery.holding;
        const holdingsText = JSON.stringify(this.holdings).toLowerCase();
        if (holdingsText.includes('magasin')) {
          this.hasMagasin = true;
        }
      }
      this.hasAlmaInstitutions = !!(this.hostComponent.docDelivery?.almaInstitutionsList && this.hostComponent.docDelivery.almaInstitutionsList.length > 0);
    }

    console.log(`[UBM-Availability] 📊 État appliqué -> Magasin: ${this.hasMagasin}, Indispo: ${this.isUnavailable}, Hors-Murs: ${this.isNoInventory}`);
    
    // 4. On force la mise à jour graphique du template HTML
    this.cdr.detectChanges();
  }

  // --- Gardez vos méthodes d'action triggerLogin, etc. à l'identique ---
  triggerLogin(event: Event): void {
    event.preventDefault();
    const loginButton = this.document.querySelector<HTMLButtonElement>('nde-login button');
    if (loginButton) loginButton.click();
  }

  scrollToAndExpandNetwork(event: Event): void {
    event.preventDefault();
    const networkSection = this.document.getElementById('nui.brief.results.tabs.getit_other');
    if (networkSection) {
      networkSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const expansionHeader = networkSection.querySelector<HTMLElement>('mat-expansion-panel-header');
      if (expansionHeader && expansionHeader.getAttribute('aria-expanded') === 'false') {
        expansionHeader.click();
      }
    }
  }

  getConfig(holding: Holding): AvailabilityConfig {
    return AVAILABILITY_CONFIG[holding.availabilityStatus] ?? AVAILABILITY_CONFIG['default'];
  }

  getAriaLabel(holding: Holding): string {
    return [this.getConfig(holding).label, holding.mainLocation, holding.subLocation, holding.callNumber].filter(Boolean).join(' – ');
  }

  onHoldingClick(event: MouseEvent): void {
    event.preventDefault(); event.stopPropagation();
    const btn = (event.currentTarget as HTMLElement).closest('nde-physical-availability-line')?.querySelector<HTMLButtonElement>('button.available-at-button');
    if (btn) btn.click();
  }

  onMapClick(event: MouseEvent): void { event.stopPropagation(); }
}