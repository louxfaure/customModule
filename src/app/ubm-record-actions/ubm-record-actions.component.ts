import { Component, Input, OnDestroy, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'custom-ubm-record-actions',
  standalone: true,
  template: '',
  encapsulation: ViewEncapsulation.None
})
export class UbmRecordActionsComponent implements OnDestroy {
  private clickListener: any;

  constructor() {
    // Capture globale pour devancer Primo
    this.clickListener = this.interceptClick.bind(this);
    window.addEventListener('click', this.clickListener, true);
  }

  @Input() set hostComponent(value: any) {
    if (value?.actions && value.searchResult?.pnx) {
      this.prepareZoteroAction(value);
    }
  }

  prepareZoteroAction(host: any) {
    const pnx = host.searchResult.pnx;
    const actions = host.actions;

    const leganto = actions.find((a: any) => 
      a.shortActionLabel === 'pushto.option.Leganto' || a.iconName === 'Reading-list'
    );

    if (leganto) {
      // 1. Changement visuel
      leganto.actionLabel = 'ZoteroBib';
      leganto.iconName = 'ic_archive_24px';
      
      // 2. Extraction des métadonnées
      const doi = pnx.addata?.doi?.[0];
      const isbn = pnx.addata?.isbn?.[0];
      const title = pnx.display?.title?.[0];
      const author = pnx.display?.creator?.[0] || '';
      
      // On crée l'identifiant unique pour Zotero
      const identifier = doi || isbn || (title ? `${title} ${author}` : '');

      // 3. STOCKAGE CRUCIAL : on injecte l'ID dans l'objet action
      // Primo lie souvent cet objet au bouton HTML via Angular
      leganto.zoteroId = identifier;
      
      // On ajoute aussi une classe CSS pour l'identification
      leganto.cssClasses = (leganto.cssClasses || '') + ' custom-zotero-btn';
    }
  }

  interceptClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const button = target.closest('button') as HTMLButtonElement;

    if (!button) return;

    // Détection : On cherche notre label ou notre classe injectée
    const isZotero = button.innerText.includes('ZoteroBib') || 
                     button.getAttribute('aria-label')?.includes('ZoteroBib') ||
                     button.classList.contains('custom-zotero-btn');

    if (isZotero) {
      // STOP : On bloque Leganto immédiatement
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation();

      console.log('🎯 Clic ZoteroBib intercepté');
      this.handleFinalClick(button);
    }
  }

  private handleFinalClick(button: HTMLButtonElement) {
    // On essaie de récupérer l'ID stocké dans l'objet lié au bouton
    // @ts-ignore
    const actionObj = button['action'] || (button as any).$ctrl?.action || (button as any).ngContext?.[8]?.action;
    
    let identifier = actionObj?.zoteroId;

    // Si l'objet Angular est inaccessible, plan B : lecture du DOM
    if (!identifier) {
      console.log('⚠️ Objet action inaccessible, lecture du DOM...');
      const container = button.closest('prm-search-result') || button.closest('prm-brief-result-container');
      const title = container?.querySelector('.item-title')?.textContent;
      const author = container?.querySelector('.item-author')?.textContent;
      identifier = title ? `${title} ${author || ''}` : null;
    }

    if (identifier) {
      console.log('🚀 Envoi vers ZoteroBib :', identifier);
      window.open(`https://zbib.org/import?q=${encodeURIComponent(identifier.trim())}`, '_blank');
    } else {
      console.error('❌ Impossible de trouver les métadonnées de la notice');
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('click', this.clickListener, true);
  }
}