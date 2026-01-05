
// import { Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from "@ngx-translate/core";

import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'custom-test-alex',
  standalone: true,
  templateUrl: './test-alex.component.html',
  styleUrl: './test-alex.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class TestAlexComponent {

  @Input() set hostComponent(value: any) {
    console.log('PnxTestComponent ngOnInit:', value);
    if (value?.recordMainDetails?.displayLinesCache) {
      this.interceptAndModify(value.recordMainDetails.displayLinesCache);
    }
  }

  private interceptAndModify(cache: Map<any, any>) {
    // On cherche la clé spécifique
    for (let [key, val] of cache.entries()) {
      if (key.items === "creator,contributor") {
        
        // 1. On modifie la donnée
        if (val[0]) {
          val[0].text = "Marx, Krl (Le barbu)";
        }

        // 2. ASTUCE : On ré-injecte la valeur dans la Map pour "forcer" le parent 
        // à voir un changement de référence s'il utilise un pipe ou un trackBy
        cache.set(key, [...val]); 
        
        break; // On arrête dès qu'on a trouvé
      }
    }
  }
}
// @Component({
//   selector: 'custom-test-alex',
//   standalone: true,
//   imports: [CommonModule,TranslateModule],
//   templateUrl: './test-alex.component.html',
//   styleUrl: './test-alex.component.scss'
// })

// export class TestAlexComponent implements OnInit {
//   @Input() hostComponent!: any;
  
//   title = "";
//   titleSpaced = '';
//   recordErrorLink = '';

//   ngOnInit() {
// 	console.log('PnxTestComponent ngOnInit:', this.hostComponent);
//   // console.log('PnxTestComponent ngOnInit:' + JSON.stringify(this.hostComponent, null, 2));     
//   const pnx = this.hostComponent?.recordMainDetailsContainer?.pnx;
//   const firstLine = this.hostComponent?.recordMainDetailsContainer?.lds01;
//   console.log('PnxTestComponent title:' + this.title);
//   const cache = this.hostComponent.recordMainDetailsContainer.displayLinesCache;

// if (cache instanceof Map) {
//   // Parcourir la Map pour trouver l'entrée "creator,contributor"
//   cache.forEach((value, key) => {
//     if (key.items === "creator,contributor") {
      
//       // 'value' est l'Array contenant Karl Marx et Jules Molitor
//       // Si on veut modifier le texte du premier auteur (Karl Marx) :
//       if (value[0]) {
//         value[0].text = "Marx, Krl (Le barbu)"; // Remplacement de la valeur
//       }
      
//       console.log("Valeur modifiée avec succès !");
//     }
//   });
// }

//   }
// }