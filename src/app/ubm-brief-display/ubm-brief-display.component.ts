import { Component, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';


@Component({
  selector: 'ubm-brief-display',
  standalone: true,
  imports: [CommonModule,TranslateModule],
  templateUrl: './ubm-brief-display.component.html',
  styleUrl: './ubm-brief-display.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class UbmBriefDisplayComponent {
  isUbmPublication = false;
  @Input() set hostComponent(value: any) {
    console.log('UbmBriefDisplayComponent hostComponent:', value);
    const pnxDisplay = value?.recordMainDetails?.pnx?.display;
    const lds01 = pnxDisplay?.lds01;
    const lds30 = pnxDisplay?.lds30;
    console.log('lds30', lds30);

    // Badge UBM : lds30 vaut 'publicationUBM'
    // (lds30 peut être un tableau ou une string selon le champ PNX)
    this.isUbmPublication = Array.isArray(lds30)
      ? lds30.includes('publicationUBM')
      : lds30 === 'publicationUBM';
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
            console.log('Cache key:', JSON.stringify(key)); // log toutes les clés
            const result = target.get(key);
    
            // Si on accède à lds01 ET que le résultat est vide ou n'existe pas
            if (typeof key === 'string' && key.includes('lds01') && (!result || result.length === 0)) {
              const pnxDisplay = recordMainDetails?.pnx?.display;
              
              // On définit le type string pour l'argument 'val'
              const cleanField = (val: string): string => {
                return typeof val === 'string' ? val.replace(/\$\$Q.*/g, '').trim() : val;
              };

              const creators: string[] = (pnxDisplay?.creator || []).map(cleanField);
               console.log("auteurs. :",creators); 
              const contributors: string[] = (pnxDisplay?.contributor || []).map(cleanField);
              console.log("Contrib. :",contributors);  
              // Combiner les deux listes
              const allAuthors = [...creators, ...contributors];
            
              
              // Si on a des auteurs, retourner un string formatée
              if (allAuthors.length > 0) {
                return [{
                  text: allAuthors.join('; ')
                }];
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