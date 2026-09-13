import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule} from '@angular/material/card';
import { AssetsPublicPathDirective } from '../services/assets-public-path.directive'; 
import { TranslateModule } from '@ngx-translate/core';



@Component({
  selector: 'custom-ubm-rebond-full-display',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatExpansionModule, MatDividerModule,MatCardModule,AssetsPublicPathDirective,TranslateModule],
  templateUrl: './ubm-rebond-full-display.component.html',
  styleUrl: './ubm-rebond-full-display.component.scss'
})
export class UbmRebondFullDisplayComponent {
  showExternalSearch: boolean = false;
  isPanelExpanded: boolean = true;
  sudocQuery: string = '';
  bmQuery: string = '';



  @Input() set hostComponent(value: any) {
    const sectionType = value?.service?.type;
    const pnx = value?.searchResult?.pnx;
    const source = pnx?.display?.source;

    if (sectionType === 'brief.results.tabs.details' && source?.includes('Alma')) {
      this.showExternalSearch = true;

      const identifiers: string[] | undefined = pnx?.display?.identifier;
      const title: string | undefined = pnx?.display?.title?.[0];
      const author: string | undefined = pnx?.display?.creator?.[0];

      this.sudocQuery = this.buildQueryTermsSudoc(identifiers, title, author);
      this.bmQuery = this.buildQueryTermsBm(identifiers, title, author);

    }
  }

  // ------------------------------------------------------------------ //
  //  Construction des clé de recherche
  // ------------------------------------------------------------------ //

  // Pour le SUDOC

  private buildQueryTermsSudoc(identifiers: string[] | undefined, title?: string, author?: string): string {
    // Priorité : PPN > ISBN > ISSN
    const ppn = this.extractIdentifier(identifiers, 'PPN');
    if (ppn) return "https://www.sudoc.fr/"+ppn;

    const isbn = this.extractIdentifier(identifiers, 'ISBN');
    if (isbn) return "https://www.sudoc.abes.fr/cbs//DB=2.1/SET=1/TTL=1/CMD?ACT=SRCHA&IKT=7&SRT=RLV&TRM="+isbn;

    const issn = this.extractIdentifier(identifiers, 'ISSN');
    if (issn) return "https://www.sudoc.abes.fr/cbs//DB=2.1/SET=1/TTL=1/CMD?ACT=SRCHA&IKT=8&SRT=RLV&TRM="+issn;

    // Fallback : clé auteur-titre
    const titleKey = this.cleanTitle(title ?? '', 10); // <- longueur ajustable ici
    const authorKey = this.extractAuthorKey(author ?? '');
    return "https://www.sudoc.abes.fr/cbs//DB=2.1/SET=1/TTL=1/CMD?ACT=SRCHA&IKT=1016&SRT=RLV&TRM="+[titleKey, authorKey].filter(Boolean).join(' ').trim();
  }

  // Pour les BM de Bordeaux
  private buildQueryTermsBm(identifiers: string[] | undefined, title?: string, author?: string): string {

    //Clé auteur-titre
    const titleKey = this.cleanTitle(title ?? '', 10); // <- longueur ajustable ici
    const authorKey = this.extractAuthorKey(author ?? '');
    return "https://mediatheques.bordeaux-metropole.fr/osiros/result/resultat.php?type_rech=rs&index%5B%5D=fulltext&bool%5B%5D=&value%5B%5D="+[titleKey, authorKey].filter(Boolean).join(' ').trim()+"&op=Ok&spec_expand=1";
  }
  // Extrait la valeur associée à un type d'identifiant donné ($$CPPN, $$CISBN, $$CISSN...)
  private extractIdentifier(identifiers: string[] | undefined, type: string): string | null {
    if (!identifiers?.length) return null;
    const regex = new RegExp(`\\$\\$C${type}\\$\\$V([^;]+)`);
    for (const entry of identifiers) {
      const match = entry.match(regex);
      if (match) return match[1];
    }
    return null;
  }

  // Nettoie le titre : retire la ponctuation, limite le nombre de mots
  private cleanTitle(title: string, maxWords: number): string {
    if (!title) return '';
    const cleaned = title
      .replace(/[^\p{L}\p{N}\s]/gu, ' ') // retire tout sauf lettres/chiffres/espaces (garde les accents)
      .replace(/\s+/g, ' ')
      .trim();
    return cleaned.split(' ').slice(0, maxWords).join(' ');
  }

  // Extrait le nom d'auteur après $$Q et retire les virgules
  private extractAuthorKey(author: string): string {
    if (!author) return '';
    const match = author.match(/\$\$Q(.+)$/);
    const raw = match ? match[1] : author;
    return raw.replace(/,/g, '').replace(/\s+/g, ' ').trim();
  }

    togglePanel(): void {
    this.isPanelExpanded = !this.isPanelExpanded;
  }

}