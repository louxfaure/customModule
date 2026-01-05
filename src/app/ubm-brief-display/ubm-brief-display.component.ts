import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'custom-ubm-brief-display',
  standalone: true,
  imports: [],
  templateUrl: './ubm-brief-display.component.html',
  styleUrl: './ubm-brief-display.component.scss',
  encapsulation: ViewEncapsulation.None
})

export class UbmBriefDisplayComponent {

  @Input() set hostComponent(value: any) {
    console.log('PnxTestComponent ngOnInit:', value);
    if (value?.recordMainDetailsContainer?.displayLinesCache) {
      this.interceptAndModify(value.recordMainDetailsContainer.displayLinesCache);
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