import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule} from '@angular/material/card'
import { AssetsPublicPathDirective } from '../services/assets-public-path.directive'; 


@Component({
  selector: 'custom-ubm-custom-result-list-after',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatDialogModule, MatButtonModule, AssetsPublicPathDirective],
  templateUrl: './ubm-custom-result-list-after.component.html',
  styleUrl: './ubm-custom-result-list-after.component.scss'
})
export class UbmCustomResultListAfterComponent implements OnInit {

  showExternalSiteList: boolean = false;
  queryTerm: string = '';
  queryDisplay: string = '';
  titleText: string = '';
  contentText: string = '';

  private readonly STORAGE_KEY = 'ubm_external_search_dismissed';

  constructor() {}

  @Input() set hostComponent(value: any) {
    if (!value) return;
    // Fallback via hostComponent si disponible (optionnel)
    const mainSearch =
      value.searchService?.searchFieldsService?._mainSearch ||
      value.parentCtrl?.searchService?.searchFieldsService?._mainSearch;
    if (mainSearch) {
      this.queryTerm = encodeURIComponent(mainSearch);
      this.queryDisplay = mainSearch;
    }
  }

  ngOnInit(): void {
    // Priorité à l'URL — fonctionne dans tous les cas
    if (!this.queryTerm) {
      this.extractQueryFromUrl();
    }
    this.checkSessionStorage();
    this.detectLanguage();
  }

  // ------------------------------------------------------------------ //
  //  Extraction du terme depuis l'URL (simple + avancé)
  // ------------------------------------------------------------------ //
  private extractQueryFromUrl(): void {
    const url = new URL(window.location.href);
    const raw = url.searchParams.get('query') || '';
    if (!raw) return;

    let term = '';

    // Cas simple : "grizzly jam"  (pas de virgule = pas de préfixe de champ)
    if (!raw.includes(',')) {
      term = decodeURIComponent(raw.trim());
    } else {
      // Cas avancé : "title,contains,grizzly jam" ou "any,contains,grizzly jam"
      // Le format Primo est : field,operator,value
      const parts = raw.split(',');
      // La valeur est toujours la 3ème partie (index 2)
      // Plusieurs critères sont séparés par " AND " ou concatenés
      if (parts.length >= 3) {
        term = decodeURIComponent(parts.slice(2).join(',').trim());
      }
    }

    if (term) {
      this.queryTerm = encodeURIComponent(term);
      // Tronquer l'affichage si trop long
      this.queryDisplay = term.length > 40 ? term.slice(0, 38) + '…' : term;
    }
  }

  private checkSessionStorage(): void {
    try {
      const dismissed = sessionStorage.getItem(this.STORAGE_KEY);
      this.showExternalSiteList = dismissed !== 'true';
    } catch {
      this.showExternalSiteList = true;
    }
  }

  detectLanguage(): void {
    const urlParams = new URLSearchParams(window.location.search);
    const lang = urlParams.get('lang') || document.documentElement.lang || 'fr';

    switch (lang) {
      case 'en':
        this.titleText = "Can't find the document you're looking for in Babord+?";
        this.contentText = "Try your search on these external sources:";
        break;
      case 'es':
        this.titleText = "¿No encuentras el documento en Babord+?";
        this.contentText = "Relanza tu búsqueda en estos sitios:";
        break;
      default:
        this.titleText = "Document introuvable dans Babord+ ?";
        this.contentText = "Relancez votre recherche sur ces bases :";
    }
  }

  externalSearchMsgOnClick(): void {
    this.showExternalSiteList = false;
    try {
      sessionStorage.setItem(this.STORAGE_KEY, 'true');
    } catch { /* si cookies bloqués */ }
  }
}