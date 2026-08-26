import { Component, OnInit, OnDestroy, Inject, Input, Renderer2 } from '@angular/core';

import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'custom-request-services',
  standalone: true,
  imports: [],
  templateUrl: './ubm-request-card-hook.component.html',
  styleUrl: './ubm-request-card-hook.component.scss',
})
export class RequestServicesComponent implements OnInit, OnDestroy {
  private intervalId: any;
  private attempts = 0;
  private readonly MAX_ATTEMPTS = 40; // Max 10 secondes (40 * 250ms)
  
  private relationText: string | null = null;

  @Input() set hostComponent(value: any) {
    if (value) {
      console.log("--- Requests : Valeurs du Host Component ---", value);
      
      const relations: string[] = value.searchResult?.pnx?.display?.relation;
      
      if (Array.isArray(relations)) {
        // 1. Trouver le premier élément qui commence par $$C461_label
        const targetRelation = relations.find(rel => rel && rel.startsWith('$$C461_label'));
        
if (targetRelation) {
  // 1. Regex pour capturer tout ce qui est après $$V jusqu'au prochain $$
  const match = targetRelation.match(/\$\$V([^$]+)/);
  
  if (match && match[1]) {
    const rawData = match[1].trim(); // Exemple : "Les Carnets du paysage ; no. 1 ; 1998"
    
    // 2. Découpage par le séparateur ";"
    const parts = rawData.split(';').map(part => part.trim());
    
    if (parts.length >= 3) {
      const titreRevue = parts[0];
      const numeroFascicule = parts[1];
      const anneeFascicule = parts[2];
      
      // 3. Construction de la chaîne HTML avec des classes CSS pour le style
this.relationText = `
  <div class="custom-revue-container">
    <svg class="custom-revue-icon-svg" viewBox="0 0 24 24" width="24" height="24">
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" fill="currentColor"/>
    </svg>
    
    <div class="custom-revue-content">
      <span class="custom-revue-intro">Ce document est un numéro de la revue</span>
      <span class="custom-revue-title">${titreRevue}</span>
      <span class="custom-revue-separator">. Voici les références du fascicule :</span>
      <span class="custom-revue-refs">${numeroFascicule} (${anneeFascicule})</span>
    </div>
  </div>
`;
    } else {
      // Fallback au cas où le format ne contient pas les 3 parties attendues
      this.relationText = `<span class="custom-revue-title">${rawData}</span>`;
    }

    console.log("HTML généré :", this.relationText);
    
    // Si le DOM est déjà prêt, on applique
    this.replaceRelatedTitlesDiv();
  }
}
      }
    }
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.startPolling();
  }

  private startPolling(): void {
    this.intervalId = setInterval(() => {
      this.attempts++;
      
      const success = this.replaceRelatedTitlesDiv();

      if (success || this.attempts >= this.MAX_ATTEMPTS) {
        this.stopPolling();
      }
    }, 250);
  }

private replaceRelatedTitlesDiv(): boolean {
  if (!this.relationText) return false;

  // 1. On cherche la div parente principale
  const parentDiv = this.document.querySelector('.related-titles-list');
  
  if (parentDiv) {
    const children = parentDiv.children;
    
    // 2. On vérifie qu'on a bien la deuxième div enfant
    if (children && children.length >= 2) {
      const targetDiv = children[1]; // Deuxième div enfant
      
      // 3. On cherche le span à l'intérieur de cette deuxième div
      const targetSpan = targetDiv.querySelector('span');
      
      if (targetSpan) {
        // 4. On remplace le contenu du span par notre texte/HTML formaté
        this.renderer.setProperty(targetSpan, 'innerHTML', this.relationText);
        console.log("Remplacement du span réussi !");
        return true; // Arrête le polling
      }
    }
  }
  return false;
}

  private stopPolling(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }
}