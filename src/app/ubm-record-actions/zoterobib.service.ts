// zoterobib.service.ts
import { Injectable } from '@angular/core';

export interface CustomAction {
  name: string;
  type: string;
  icon: {
    set: string;
    name: string;
  };
  action: string;
  slug?: string;
  iconname?: string;
  index?: number;
  templateVar?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ZoterobibService {
  private actions: CustomAction[] = [];

  constructor() {}

  /**
   * Traite une action personnalisée
   */
  processCustomAction(prmActionCtrl: any, action: CustomAction): CustomAction {
    action.slug = action.name.replace(/\s+/g, ''); // remove whitespace
    action.iconname = action.slug.toLowerCase();
    action.index = Object.keys(prmActionCtrl.actionListService.actionsToIndex).length - 1;
    this.actions.push(action);
    return action;
  }

  /**
   * Configure une action personnalisée dans le contrôleur Primo
   */
  setCustomAction(prmActionCtrl: any, action: CustomAction): void {
    prmActionCtrl.actionLabelNamesMap[action.slug!] = action.name;
    prmActionCtrl.actionIconNamesMap[action.slug!] = action.iconname;
    prmActionCtrl.actionIcons[action.iconname!] = {
      icon: action.icon.name,
      iconSet: action.icon.set,
      type: "svg"
    };

    // S'assurer qu'on ne duplique pas l'entrée
    if (!prmActionCtrl.actionListService.actionsToIndex[action.slug!]) {
      prmActionCtrl.actionListService.requiredActionsList[action.index!] = action.slug;
      prmActionCtrl.actionListService.actionsToDisplay.unshift(action.slug);
      prmActionCtrl.actionListService.actionsToIndex[action.slug!] = action.index;
    }

    let actionurl = "";

    if (action.type === 'urlredirectzotero') {
      console.log(prmActionCtrl.item);
      let zoterobibq = "0";

      // Construire le lien vers l'enregistrement PNX
      const url = new URL(document.location.href);
      const hostname = url.hostname;
      console.log(url.hostname);

      const context = prmActionCtrl.item.context;
      const recordid = prmActionCtrl.item.pnx.control.recordid;
      const linktopnx = prmActionCtrl.item.pnx;

      // Vérifier si RISTYPE existe
      if (typeof prmActionCtrl.item.pnx.addata.ristype === 'undefined') {
        console.log("format" + prmActionCtrl.item.pnx.addata.format);
        zoterobibq = linktopnx;
      } else {
        console.log("format" + prmActionCtrl.item.pnx.addata.ristype.toString().toLowerCase());
        
        const ristype = prmActionCtrl.item.pnx.addata.ristype.toString().toLowerCase();
        switch(ristype) {
          case "book":
            zoterobibq = this.getZoterobibq(prmActionCtrl.item.pnx.addata, 0, linktopnx);
            break;
          case "jour":
            zoterobibq = this.getZoterobibq(prmActionCtrl.item.pnx.addata, 1, linktopnx);
            break;
          case "gen":
            zoterobibq = this.getZoterobibq(prmActionCtrl.item.pnx.addata, 2, linktopnx);
            break;
          case "thes":
            zoterobibq = this.getZoterobibq(prmActionCtrl.item.pnx.addata, 3, linktopnx);
            break;
          default:
            zoterobibq = this.getZoterobibq(prmActionCtrl.item.pnx.addata, 4, linktopnx);
        }
      }

      if (action.hasOwnProperty('templateVar')) {
        action.action = action.action.replace(/{\d}/g, (r) => {
          const index = r.replace(/[^\d]/g, '');
          return action.templateVar![parseInt(index)];
        });
        console.log("templateVar");
      }

      actionurl = action.action + zoterobibq;
      console.log(actionurl);
    }

    prmActionCtrl.actionListService.onToggle[action.slug!] = () => {
      window.open(actionurl, '_blank');
    };
  }

  /**
   * Récupère toutes les actions personnalisées
   */
  getCustomActions(): CustomAction[] {
    return this.actions;
  }

  /**
   * Fonction pour obtenir ISBN, DOI, PMID, arXiv ID, ou titre
   */
  private getZoterobibq(addata: any, risformattype: number, linktopnx: any): string {
    switch(risformattype) {
      case 0: // book
        if (typeof addata.isbn !== 'undefined') {
          if (addata.isbn.length > 1) {
            return addata.isbn[0];
          } else {
            return addata.isbn;
          }
        }
        return linktopnx;

      case 1: // jour
        if (typeof addata.doi !== 'undefined') {
          return addata.doi;
        }
        if (typeof addata.pmid !== 'undefined') {
          return addata.pmid;
        }
        if (typeof addata.lad21 !== 'undefined') {
          return addata.lad21.toString().replace(/\barXiv.org:\b~?/g, '');
        }
        return linktopnx;

      case 2: // gen
        if (typeof addata.doi !== 'undefined') {
          return addata.doi;
        }
        if (typeof addata.pmid !== 'undefined') {
          return addata.pmid;
        }
        if (typeof addata.lad21 !== 'undefined') {
          return addata.lad21.toString().replace(/\barXiv.org:\b~?/g, '');
        }
        return linktopnx;

      case 3: // thesis
        if (typeof addata.doi !== 'undefined') {
          return addata.doi;
        }
        if (typeof addata.pmid !== 'undefined') {
          return addata.pmid;
        }
        if (typeof addata.lad21 !== 'undefined') {
          return addata.lad21.toString().replace(/\barXiv.org:\b~?/g, '');
        }
        return linktopnx;

      default: // utilisera le titre si pas d'ISBN, DOI, PMID, arXiv ID
        return linktopnx;
    }
  }
}
