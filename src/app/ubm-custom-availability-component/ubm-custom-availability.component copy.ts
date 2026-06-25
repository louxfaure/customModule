import { Component, Input, Inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
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

  holdings: Holding[] = [];
  physicalAvailability: string | null = null;
  isFullDisplay: boolean = false;

  private originalAvailabilityEl: HTMLElement | null = null;
  
  private intervalId: any;
  private attempts = 0;
  private readonly MAX_ATTEMPTS = 60; // 15 secondes de polling max (60 * 250ms)

  constructor(@Inject(DOCUMENT) private document: Document) {}

  // 1. Point d'entrée garanti par Angular dès l'injection du composant dans le DOM
  ngOnInit(): void {
    console.log('[UBM-Availability] 🚀 Composant initialisé (ngOnInit). Démarrage du polling autonome...');
    this.clearPolling();
    this.startGlobalCheckPolling();
  }

  ngOnDestroy(): void {
    this.clearPolling();
  }

  private clearPolling(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // 2. On garde les setters au cas où Primo se réveille, mais on ne compte plus uniquement sur eux
  @Input() set hostComponent(value: any) {
    if (!value) return;
    console.log('[UBM-Availability] 📥 Données reçues via hostComponent');
    console.log(value);
    this.physicalAvailability = value.physicalAvailability;
    if (value.docDelivery?.holding) {
      this.holdings = value.docDelivery.holding;
    }
  }

  @Input() set parentElement(el: HTMLElement) {
    if (!el) return;
    this.originalAvailabilityEl = el.querySelector('nde-physical-availability-line');
  }

  // 3. Logique de Polling totalement autonome
  private startGlobalCheckPolling(): void {
    this.intervalId = setInterval(() => {
      try {
        this.attempts++;

        // Sécurité d'arrêt
        if (this.attempts > this.MAX_ATTEMPTS) {
          console.warn('[UBM-Availability] 🛑 Fin du polling automatique (Timeout 15s).');
          this.clearPolling();
          return;
        }

        // Étape A : Est-on sur une notice complète ? 
        let fullDisplayContenair = this.document.querySelector('nde-full-display-service-container');
        if(fullDisplayContenair){
          this.isFullDisplay = true;
        }
        //Etape B :O n regarde si le lecteur est connecté
        let isLogin = false;
        const userButton = this.document.getElementById('user-area-button');
        if (userButton) {
          // Si le bouton possède la classe spécifique aux utilisateurs connectés
          isLogin = userButton.classList.contains('user-area-logged-in');
        }

        // Étape C : Est-ce qu'on a la mention "Magasin" quelque part dans le DOM de la notice ?
        // Si 'this.holdings' est vide à cause de l'Input manquant, on inspecte directement le texte de la page !
        let hasMagasin = false;

       
        
        if (this.holdings && this.holdings.length > 0) {
          hasMagasin = this.holdings.some(h => JSON.stringify(h).toLowerCase().includes('magasin'));
        } else {
          // Diagnostic de secours : scan textuel des sections de localisation de Primo
          const locationsText = this.document.querySelector('nde-physical-availability-line, prm-physical-availability-line')?.textContent || '';
          hasMagasin = locationsText.toLowerCase().includes('magasin');
        }

         //Etape D: on récupère le conteneur qui doit chargerle message
         let serviceContainer = this.document.querySelector('[id="nde.getit.locations"]');
        // Trace systématique pour comprendre ce qui bloque
        if (this.attempts % 2 === 0) {
          console.log(`[UBM-Availability] [Cycle ${this.attempts}] Conteneur HTML trouvé : ${!!serviceContainer} | Détection Magasin : ${hasMagasin}`);
        }        


        // Si le conteneur est prêt et que le "Magasin" est confirmé
        if (serviceContainer && hasMagasin && !isLogin) {
          
          // Anti-doublon
          if (this.document.getElementById('ubm-magasin-warning')) {
            this.clearPolling();
            return;
          }

          // Injection de l'alerte
          const warningEl = this.document.createElement('div');
          warningEl.id = 'ubm-magasin-warning';
          warningEl.className = 'ubm-magasin-alert';
          warningEl.style.marginBottom = '15px'; // Marge de sécurité visuelle
          warningEl.innerHTML = `
            <div class="warning-content" style="padding: 12px; backgphysicalAvailabilityround-color: #fff3cd; border-left: 5px solid #ffc107; color: #856404; border-radius: 4px;">
                <span class="warning-icon" style="margin-right: 8px;">⚠️</span>
                <strong>Information Magasin :</strong> Ce document contient des exemplaires archivés en magasin. 
                Pour effectuer une demande, veuillez <a href="#" id="ubm-trigger-login-link" style="color: #856404; text-decoration: underline; font-weight: bold;">vous identifier ici</a>.
              </div>
          `;
          // Attacher l'événement du clic juste après l'injection dans le DOM :
            const loginLink = warningEl.querySelector('#ubm-trigger-login-link');
            if (loginLink) {
              loginLink.addEventListener('click', (event) => {
                event.preventDefault();
                this.triggerLogin(); // Appelle le composant nde-login
              });
            }
          serviceContainer.prepend(warningEl);
          console.log('[UBM-Availability] 🎉 SUCCÈS : Alerte réservation injectée avec succès.');
          
          this.clearPolling();
        }

      } catch (error) {
        console.error('[UBM-Availability] ❌ Erreur dans le cycle autonome :', error);
        this.clearPolling();
      }
    }, 250);
  }

  // ------------------------------------------------------------------ //
  //  Helpers
  // ------------------------------------------------------------------ //
  triggerLogin(): void {
  // On cible le bouton à l'intérieur de la balise <nde-login>
  const loginButton = this.document.querySelector<HTMLButtonElement>('nde-login button');
  
  if (loginButton) {
    console.log('[UBM-Availability] Déclenchement de l\'authentification Primo...');
    loginButton.click();
  } else {
    console.error('[UBM-Availability] Impossible de trouver le bouton de connexion <nde-login> dans la page.');
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