import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Définition d'une interface pour typer proprement les institutions
interface Institution {
  id: string;
  baseUrl: string;
  vid:string;
  name: string;
  redirectUrl?: string; // Stockera l'URL finale calculée
}

@Component({
  selector: 'custom-ubm-login-form-hook',
  standalone: true,
  imports: [CommonModule], // Obligatoire pour le *ngFor
  templateUrl: './ubm-login-form-hook.component.html',
  styleUrl: './ubm-login-form-hook.component.scss'
})
export class UbmLoginFormHookComponent implements OnInit {
  
  // Liste brute des institutions disponibles
  institutions: Institution[] = [
    { id: "33PUDB_INP",  baseUrl: "https://pudb-inp.primo.exlibrisgroup.com/nde/login?", vid: "33PUDB_INP:NDE",  name: "Bordeaux INP" },
    { id: "33PUDB_BXSA", baseUrl: "https://pudb-bxsa.primo.exlibrisgroup.com/nde/login?", vid: "33PUDB_BXSA:NDE", name: "Bordeaux Sciences Agro" },
    { id: "33PUDB_IEP",  baseUrl: "https://pudb-iep.primo.exlibrisgroup.com/nde/login?", vid: "33PUDB_IEP:NDE",   name: "Bordeaux Sciences Po" },
    { id: "33PUDB_UB",   baseUrl: "https://pudb-ub.primo.exlibrisgroup.com/nde/login?", vid: "33PUDB_UB:33PUDB_UB_VU5",    name: "Université de Bordeaux" },
    { id: "33PUDB_UBM",  baseUrl: "https://pudb-ubm.primo.exlibrisgroup.com/nde/login?", vid: "33PUDB_UBM:NDE",  name: "Université Bordeaux Montaigne" }
  ];

  // Liste finale qui sera affichée dans le HTML (filtrée)
  filteredInstitutions: Institution[] = [];

  ngOnInit(): void {
    this.genererRedirections();
  }

  genererRedirections(): void {
    try {
      const urlActuelle = new URL(window.location.href);
      
      // 1. Extraction du state et de la structure des paramètres
      const state = urlActuelle.pathname.split('/nde/').pop() || 'account/overview';
      const vidActuelle = urlActuelle.searchParams.get('vid') || '';
      const institutionActuelle = vidActuelle.split(':')[0]; // Ex: "33PUDB_UBM"

      // 2. Extraction des query params dans un objet clé/valeur
      const paramsObj: { [key: string]: string } = {};
      urlActuelle.searchParams.forEach((value, key) => {
        if (key !== 'vid') {
          paramsObj[key] = value;
        }
      });
      
      const toParamsJson = JSON.stringify(paramsObj);
      const encodedParams = encodeURIComponent(toParamsJson);

      // 3. Filtrage de l'institution actuelle + construction des URLs cibles
      this.filteredInstitutions = this.institutions
        .filter(inst => inst.id !== institutionActuelle)
        .map(inst => ({
          ...inst,
          // Correction : ajout du '/' manquant potentiel dans vos URLs initiales avant le 'login'
          redirectUrl: `${inst.baseUrl}vid=${inst.vid}&toState=${state}&toParams=${encodedParams}`
        }));

    } catch (error) {
      console.error('Erreur lors de la génération des URLs de redirection', error);
    }
  }
  redirigerVers(url?: string): void {
  if (url) {
    window.location.href = url;
  }
}
  SurChangementInstitution(event: Event): void {
  const selectElement = event.target as HTMLSelectElement;
  const url = selectElement.value;
  if (url) {
    window.location.href = url;
  }
}
}