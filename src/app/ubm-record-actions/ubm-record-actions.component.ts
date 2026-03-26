import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

/**
 * UbmRecordActionsComponent
 *
 * Le menu "Exporter" de Primo NDE s'ouvre dans un .cdk-overlay-container
 * injecté directement dans <body>, hors de l'arbre Angular du composant.
 * Le panneau est un  mat-mdc-menu-panel.action-sub-menu
 * Le bouton Leganto s'y trouve avec le texte "Biblio(s)+" et l'icône Reading-list.
 *
 * Stratégie :
 *  1. MutationObserver sur .cdk-overlay-container (déjà dans le DOM au boot Primo)
 *  2. Dès que le panel action-sub-menu apparaît, on y injecte un bouton ZoteroBib
 *     juste après le bouton "Biblio(s)+"
 *  3. Les métadonnées PNX sont stockées dans une Map globale indexée par recordId
 */

const ZOTERO_META_MAP = new Map<string, ZoteroMeta>();

interface ZoteroMeta {
  doi?: string;
  isbn?: string;
  title?: string;
  author?: string;
  identifier: string;
}

@Component({
  selector: 'custom-ubm-record-actions',
  standalone: true,
  template: '',
  encapsulation: ViewEncapsulation.None
})
export class UbmRecordActionsComponent implements OnInit, OnDestroy {

  private mutationObserver: MutationObserver | null = null;
  private currentResultId = '';
  private meta: ZoteroMeta | null = null;

  // ------------------------------------------------------------------ //
  //  Input Primo
  // ------------------------------------------------------------------ //
  @Input() set hostComponent(host: any) {
    console.log("INPUT",host);
    if (!host?.searchResult?.pnx) return;

    const pnx   = host.searchResult.pnx;
     console.log("PNX :", pnx);
    const docId = pnx.control?.sourcerecordid?.[0]
               ?? pnx.control?.recordid?.[0]
               ?? String(Date.now());

    this.currentResultId = docId;
    this.meta = this.extractMeta(pnx);
    ZOTERO_META_MAP.set(docId, this.meta);
  }

  // ------------------------------------------------------------------ //
  //  Lifecycle
  // ------------------------------------------------------------------ //
  ngOnInit(): void {
    this.observeOverlay();
  }

  ngOnDestroy(): void {
    this.mutationObserver?.disconnect();
  }

  // ------------------------------------------------------------------ //
  //  Extraction métadonnées PNX
  // ------------------------------------------------------------------ //
  private extractMeta(pnx: any): ZoteroMeta {
    const doi    = pnx.addata?.doi?.[0];
    const isbn   = pnx.addata?.isbn?.[0];
    const title  = pnx.display?.title?.[0] ?? pnx.addata?.btitle?.[0];
    const author = pnx.display?.creator?.[0] ?? pnx.addata?.au?.[0] ?? '';
    const identifier = doi ?? isbn ?? (title ? `${title} ${author}`.trim() : '');
    return { doi, isbn, title, author, identifier };
  }

  // ------------------------------------------------------------------ //
  //  Observer le cdk-overlay-container
  // ------------------------------------------------------------------ //
  private observeOverlay(): void {
    // .cdk-overlay-container est présent dans le DOM dès le boot de Primo
    const overlayRoot = document.querySelector('.cdk-overlay-container') ?? document.body;

    this.mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of Array.from(mutation.addedNodes)) {
          if (!(node instanceof HTMLElement)) continue;

          // Cas 1 : le panneau lui-même est ajouté directement
          if (node.classList.contains('mat-mdc-menu-panel') &&
              node.classList.contains('action-sub-menu')) {
            this.handleMenuPanel(node);
            return;
          }

          // Cas 2 : un wrapper (cdk-overlay-pane, bounding-box…) contient le panneau
          const panel = node.querySelector?.('.mat-mdc-menu-panel.action-sub-menu');
          if (panel instanceof HTMLElement) {
            this.handleMenuPanel(panel);
            return;
          }
        }
      }
    });

    this.mutationObserver.observe(overlayRoot, { childList: true, subtree: true });
  }

  // ------------------------------------------------------------------ //
  //  Traitement du panneau de menu
  // ------------------------------------------------------------------ //
  private handleMenuPanel(panel: HTMLElement): void {
    // Petit délai : laisser Angular finir de rendre tous les boutons du menu
    setTimeout(() => {
      if (panel.querySelector('.ubm-zotero-btn')) return; // déjà injecté

      const menuContent = panel.querySelector('.mat-mdc-menu-content');
      if (!menuContent) return;

      const biblioBtn   = this.findBiblioButton(menuContent);
      const zoteroItem  = this.createZoteroMenuItem();

      if (biblioBtn) {
        biblioBtn.insertAdjacentElement('afterend', zoteroItem);
      } else {
        menuContent.appendChild(zoteroItem);
      }
    }, 300);
  }

  // ------------------------------------------------------------------ //
  //  Trouver le bouton "Biblio(s)+" — icône data-mat-icon-name="Reading-list"
  // ------------------------------------------------------------------ //
  private findBiblioButton(root: Element): Element | null {
    const buttons = root.querySelectorAll('button.mat-mdc-menu-item');

    for (const btn of Array.from(buttons)) {
      // Critère principal : attribut sur mat-icon (visible dans le DOM partagé)
      if (btn.querySelector('[data-mat-icon-name="Reading-list"]')) return btn;

      // Critère secondaire : texte
      const text = btn.querySelector('.mat-mdc-menu-item-text')?.textContent ?? '';
      if (/biblio/i.test(text)) return btn;
    }
    return null;
  }

// ------------------------------------------------------------------ //
//  Créer un <button> identique aux items natifs du menu
// ------------------------------------------------------------------ //
private createZoteroMenuItem(): HTMLButtonElement {
  // On capture l'id au moment de la création (snapshot)
  const snapshotId   = this.currentResultId;
  const snapshotMeta = this.meta;

  const btn = document.createElement('button');
  btn.className =
    'mat-mdc-menu-item mat-focus-indicator mat-mdc-tooltip-trigger ng-star-inserted ubm-zotero-btn';
  btn.setAttribute('role', 'menuitem');
  btn.setAttribute('tabindex', '0');
  btn.setAttribute('aria-label', 'Exporter vers ZoteroBib');

  btn.innerHTML = `
    <mat-icon role="img"
      class="mat-icon notranslate nde-mat-icon-size-default grey-icon-color-no-stroke mat-icon-no-color ng-star-inserted"
      aria-hidden="true"
      data-mat-icon-type="svg"
      data-mat-icon-name="ZoteroBib">
      <svg width="100%" height="100%" viewBox="0 0 16 16" fill="none"
           xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" focusable="false">
        <path fill-rule="evenodd" clip-rule="evenodd"
          d="M2.5 1C2.22 1 2 1.22 2 1.5V11.5C2 11.78 2.22 12 2.5 12H6V13H4.5C4.22 13 4 13.22 4 13.5S4.22 14 4.5 14H7V11H9V14H11.5C11.78 14 12 13.78 12 13.5S11.78 13 11.5 13H10V12H7.5V2H9.79L12 4.21V7.5C12 7.78 12.22 8 12.5 8S13 7.78 13 7.5V3.8L10.2 1H2.5ZM9.5 2V4.5H12L9.5 2ZM3 3H7.5V4H3V3ZM3 5.5H7.5V6.5H3V5.5ZM3 8H7.5V9H3V8Z"
          fill="currentColor"/>
        <path d="M11 10.5L13.5 13L11 15.5" stroke="currentColor" stroke-width="1.1" fill="none"
              stroke-linecap="round" stroke-linejoin="round"/>
        <line x1="8.5" y1="13" x2="13" y2="13" stroke="currentColor" stroke-width="1.1"
              stroke-linecap="round"/>
      </svg>
    </mat-icon>
    <span class="mat-mdc-menu-item-text">
      <span>ZoteroBib</span>
    </span>
    <div class="mat-ripple mat-mdc-menu-ripple"></div>
  `;

  btn.addEventListener('click', (e: MouseEvent) => {
    e.preventDefault();
    e.stopImmediatePropagation();

    // Au moment du clic, on relit la Map — le setter a eu le temps de s'exécuter
    const meta = ZOTERO_META_MAP.get(snapshotId)  // id capturé à la création
              ?? ZOTERO_META_MAP.get(this.currentResultId) // id courant (peut avoir changé)
              ?? snapshotMeta                              // fallback snapshot
              ?? this.meta;                               // fallback instance courante

    console.log('[UBM-Zotero] clic — snapshotId:', snapshotId);
    console.log('[UBM-Zotero] clic — meta:', meta);
    console.log('[UBM-Zotero] clic — map complète:', [...ZOTERO_META_MAP.entries()]);

    const url = this.buildZoteroUrl(meta);
    if (!url) {
      console.warn('[UBM-Zotero] Aucune métadonnée pour', snapshotId);
      return;
    }

    console.log('[UBM-Zotero] → ZoteroBib', url);
    window.open(url, '_blank', 'noopener,noreferrer');
  });

  return btn;
}

private buildZoteroUrl(meta: ZoteroMeta | null | undefined): string | null {
  if (!meta?.identifier) return null;
  const q = meta.doi ?? meta.isbn ?? meta.identifier;
  return `https://zbib.org/import?q=${encodeURIComponent(q)}`;
}
}