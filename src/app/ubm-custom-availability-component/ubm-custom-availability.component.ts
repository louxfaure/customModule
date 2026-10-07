import { Component, Input, Inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

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

interface RebondRelation {
  citation: string;
  identifiant: string;
  typerelation: string; 
  url?: string;
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
  imports: [CommonModule, TranslateModule],
  templateUrl: './ubm-custom-availability.component.html',
  styleUrl: './ubm-custom-availability.component.scss'
})
export class UbmCustomAvailabilityComponent implements OnInit, OnDestroy {

  @Input() hostComponent: any;

  holdings: Holding[] = [];
  rebondRelations: RebondRelation[] = [];
  physicalAvailability: string | null = null;

  isFullDisplay: boolean = false;
  hasAlmaInstitutions: boolean = false;
  isDedup: boolean = false;

  isNoInventory: boolean = false;
  inReserve: boolean = false;

  isOpenUrlNoInventory: boolean = false;

  private urlCheckIntervalId: any = null;
  private lastUrl: string = '';
  readonly PEB_FORM_URL = 'https://www.u-bordeaux-montaigne.fr/fr/documentation/informations-pratiques/service_peb_pret_entre_bibliotheques.html';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.lastUrl = window.location.href;
    this.evaluateState();

    // Surveillance active de l'URL : nécessaire car hostComponent ne se met pas
    // à jour lors de la navigation par flèches entre notices dans Primo.
    this.urlCheckIntervalId = setInterval(() => {
      const currentUrl = window.location.href;
      if (currentUrl !== this.lastUrl) {
        this.lastUrl = currentUrl;
        this.resetState();
        // On attend un court instant que Primo injecte le nouveau DOM de la notice
        setTimeout(() => this.evaluateState(), 150);
      }
    }, 200);
  }

  ngOnDestroy(): void {
    if (this.urlCheckIntervalId) {
      clearInterval(this.urlCheckIntervalId);
    }
  }

  private resetState(): void {
    this.rebondRelations = [];
    this.isNoInventory = false;
    this.hasAlmaInstitutions = false;
    this.inReserve = false;
    this.isDedup = false;
    this.isOpenUrlNoInventory = false;
    this.cdr.detectChanges(); // Force l'effacement visuel instantané dans le template
  }

  private evaluateState(): void {
    this.isFullDisplay = !!this.document.querySelector('nde-full-display-service-container, prm-full-display');

    // Extraction du statut textuel de disponibilité natif (en secours si l'objet de données est figé)
    const availabilityEl = this.document.querySelector('nde-physical-availability-line, prm-physical-availability-line');
    const locationsText = availabilityEl?.textContent || '';
    this.isNoInventory = locationsText.toLowerCase().includes('pas d\'exemplaire') || locationsText.toLowerCase().includes('no inventory');

    // Si l'objet hostComponent s'est mis à jour, on affine avec les données réelles
    if (this.hostComponent) {
      console.log('Custom-availability',this.hostComponent);
      if (this.hostComponent.physicalAvailability) {
        this.physicalAvailability = this.hostComponent.physicalAvailability;
        this.isNoInventory = this.physicalAvailability === 'no_inventory';
      }

      if (this.hostComponent.docDelivery?.holding) {
        this.holdings = this.hostComponent.docDelivery.holding;

        const reserveCodes = ['3100400111', '3100400184'];
        this.inReserve = this.holdings.some(h =>
          reserveCodes.includes(h.subLocationCode ?? '')
        );
      }

      this.hasAlmaInstitutions = !!(this.hostComponent.docDelivery?.almaInstitutionsList && this.hostComponent.docDelivery.almaInstitutionsList.length > 0);
    }

    // Détection de la notice fusionnée + extraction des rebonds vers les notices liées
    this.isDedup = !!this.hostComponent?.searchResult?.pnx?.control?.isDedup;
    this.rebondRelations = this.isDedup
      ? this.extractRebondRelations(this.hostComponent.searchResult?.pnx?.display?.relation)
      : [];
    //La requête vient du résolveur de lien et le document st indisponible on affiche un renvoi vers le formulaire de PEB
    this.isOpenUrlNoInventory = this.physicalAvailability === 'no_inventory' && new URL(window.location.href).pathname.includes('/openurl');

    this.cdr.detectChanges();
  }

  private extractRebondRelations(relationRaw: string[] | undefined): RebondRelation[] {
    if (!relationRaw?.length) return [];

    const results: RebondRelation[] = [];
    const relationTypeLabel: Record<string, string> = {
          '455_label': 'Reproduction',
          '452_label': 'Même édition sur un autre support',
          'OTHER_RELATIONSHIP': 'Reproduction ou version originale',
          'form': 'Même édition sur un autre support'
};

    for (const entry of relationRaw) {
      const subfields = entry.split('$$').filter(Boolean).map(token => ({
        code: token.charAt(0),
        value: token.slice(1)
      }));

      const cField = subfields.find(s => s.code === 'C');
      const vField = subfields.find(s => s.code === 'V');
      const qField = subfields.find(s => s.code === 'Q');
      const zField = subfields.find(s => s.code === 'Z');

      if (!cField || !vField) continue;

      const isLabelMatch = cField.value === '455_label' || cField.value === '452_label';
      const isOtherRelationshipMatch =
        (cField.value === 'OTHER_RELATIONSHIP' || cField.value === 'form') && !!zField?.value && /4674$/.test(zField.value);

      if (!isLabelMatch && !isOtherRelationshipMatch) continue;

      const relation: RebondRelation = {
        typerelation: relationTypeLabel[cField.value],
        citation: vField.value.trim(),
        identifiant: zField?.value ?? qField?.value ?? ''
      };

      if (zField?.value) {
        relation.url =
          `/nde/fulldisplay?docid=alma${zField.value}` +
          `&vid=33PUDB_UBM%3ANDE&search_scope=DN_and_CI&tab=Everything&context=L&lang=fr`;
      }
      if (qField?.value) {
        relation.url =
          `search?vid=33PUDB_UBM:NDE&search_scope=DN_and_CI&mode=advanced&tab=Everything&query=lds54,exact,${qField.value}`+         
          `&offset=0&lang=fr`;
      }

      results.push(relation);
    }

    return results;
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