import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

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
  imports:[MatButtonModule,MatIconModule, MatTooltipModule],
  templateUrl: './ubm-record-actions.component.html',
  styleUrls: ['./ubm-record-actions.component.scss'],
  encapsulation: ViewEncapsulation.None // Permet de s'intégrer harmonieusement dans les styles globaux Primo
})
export class UbmRecordActionsComponent {

  public meta: ZoteroMeta | null = null;

  // ------------------------------------------------------------------ //
  //  Input Primo (Déclenché automatiquement par l'interface)
  // ------------------------------------------------------------------ //
  @Input() set hostComponent(value: any) {
    if (!value?.searchResult?.pnx) return;
    console.log("zoterobib",value)
    const pnx = value.searchResult.pnx;
    console.log("zoterobib pnx",value)
    this.meta = this.extractMeta(pnx);
  }

  // ------------------------------------------------------------------ //
  //  Extraction des métadonnées PNX
  // ------------------------------------------------------------------ //
  private extractMeta(pnx: any): ZoteroMeta {
    const doi    = pnx.addata?.doi?.[0];
    const isbn   = pnx.addata?.isbn?.[0];
    const title  = pnx.display?.title?.[0] ?? pnx.addata?.btitle?.[0];
    const author = pnx.display?.creator?.[0] ?? pnx.addata?.au?.[0] ?? '';
    const identifier = doi ?? isbn ?? (title ? `${title} ${author}`.trim() : '');
    console.log("zoterobib identifier",identifier)
    return { doi, isbn, title, author, identifier };
  }

  // ------------------------------------------------------------------ //
  //  Action de clic et redirection
  // ------------------------------------------------------------------ //
  public exportToZotero(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    if (!this.meta?.identifier) {
      console.warn('[UBM-Zotero] Aucune métadonnée exploitable pour l\'export.');
      return;
    }

    const q = this.meta.doi ?? this.meta.isbn ?? this.meta.identifier;
    const url = `https://zbib.org/import?q=${encodeURIComponent(q)}`;

    window.open(url, '_blank', 'noopener,noreferrer');
  }
}