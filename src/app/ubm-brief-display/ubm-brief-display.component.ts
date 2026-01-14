import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ubm-brief-display',
  standalone: true,
  templateUrl: './ubm-brief-display.component.html',
  styleUrl: './ubm-brief-display.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class UbmBriefDisplayComponent {
  @Input() set hostComponent(value: any) {
    console.log('UbmBriefDisplayComponent hostComponent:', value);
    const lds01 = value?.recordMainDetails?.pnx?.display?.lds01;
     if (value?.recordMainDetails?.displayLinesCache && 
      (lds01 === undefined || lds01 === null || lds01.length === 0)) {
      console.log('UbmBriefDisplayComponent : Notice CDI, on affiche les auteurs');
      this.wrapCacheWithProxy(value.recordMainDetails);
    }
  }

  private wrapCacheWithProxy(recordMainDetails: any) {
    const originalCache = recordMainDetails.displayLinesCache;
    
    recordMainDetails.displayLinesCache = new Proxy(originalCache, {
      get: (target, prop) => {
        if (prop === 'get') {
          return (key: any) => {
            const result = target.get(key);
            
            // Si on accède à lds01 ET que le résultat est vide ou n'existe pas
            if (key.items === "lds01" && (!result || result.length === 0)) {
              // Récupérer les créateurs et contributeurs
              const pnxDisplay = recordMainDetails?.pnx?.display;
              const creators = pnxDisplay?.creator || [];
              const contributors = pnxDisplay?.contributor || [];
              
              // Combiner les deux listes
              const allAuthors = [...creators, ...contributors];
              
              // Si on a des auteurs, retourner la liste formatée
              if (allAuthors.length > 0) {
                return allAuthors.map(author => ({
                  text: author,

                }));
              }
            }
            
            // Retourner le résultat original dans tous les autres cas
            return result;
          };
        }
        
        return target[prop];
      }
    });
  }
}