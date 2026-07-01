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
  queryDisplay: string = '';
  titleText: string = '';
  contentText: string = '';
  searchMode: string | null = null;
  searchQuery: string | null = null;
  queryTerms: string = '';

  private readonly STORAGE_KEY = 'ubm_external_search_dismissed';

  constructor() {}


  @Input() set hostComponent(value: any) {
  }



  ngOnInit(): void {
    // Priorité à l'URL — fonctionne dans tous les cas
    this.searchMode = this.getUrlParameter('mode');
    this.searchQuery = this.getUrlParameter('query');
    const terms = this.processText(this.searchQuery ?? '');
    this.queryTerms = encodeURIComponent(terms);
    this.queryDisplay = terms.length > 40 ? terms.slice(0, 38) + '…' : terms;
    this.checkSessionStorage();
    this.detectLanguage();
  }

  // ------------------------------------------------------------------ //
  //  Extraction du terme depuis l'URL (simple + avancé)
  // ------------------------------------------------------------------ //
  
  // Récupère la valeur derrière un paramètre dans une URL.
  private getUrlParameter(parameterName: string): string | null {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(parameterName);
  }

  private processText(input: string): string {
    if (this.searchMode === 'advanced') {
      const arrays = input.split(";").map(segment => segment.split(","));
      const thirdElements = arrays.map(arr => arr[2]).filter(Boolean);
      return thirdElements.join(" ");
    } else {
      return this.searchQuery ?? '';
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