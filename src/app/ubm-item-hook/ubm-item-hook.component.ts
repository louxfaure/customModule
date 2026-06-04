import { Component, Input, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UbmAuthService } from '../ubm-services/ubm-auth.service';

@Component({
  selector: 'custom-ubm-item-hook',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ubm-item-hook.component.html',
  styleUrl: './ubm-item-hook.component.scss',
  encapsulation: ViewEncapsulation.None // FORCE Angular à injecter le HTML de manière globale
})
export class UbmItemHookComponent {
  public itemData: any = null;
  public fieldTwo: string = "";
  public fieldThree: string = "";
  public loginLink: boolean = false;

  // Propriétés prêtes pour les conditions (évite les répétitions de toLowerCase)
  private cleanedStatus: string = "";
  private cleanedCategory: string = "";
  private cleanedLoc: string = "";

  constructor(private cdr: ChangeDetectorRef, public authService: UbmAuthService) { }

  @Input() set hostComponent(value: any) {
    if (!value || !value.item) return;

    this.itemData = value.item;
    console.log("Données exemplaires", value.item);

    // On pré-nettoie les variables pour les fonctions de test
    this.cleanedStatus = (this.itemData.itemstatusname || '').toLowerCase().trim();
    this.cleanedCategory = (this.itemData.itemcategoryname || '').toLowerCase().trim();
    this.cleanedLoc = (this.itemData.secondarylocationname || '').toLowerCase().trim();

    /* ==========================================================================
       TRAITEMENT CHAMP 2 : RÈGLE DE CIRCULATION
       ========================================================================== */
    //règle de circulation par défaut
    this.fieldTwo = this.itemData.itemcategoryname || '';

    // Si l'usager est non authentifié
    if (this.isNotLogIn()) {
      //Livre empunté on l'invite à s'authentifier pour réserver
      if (this.isOnLoan()) {
        this.fieldTwo = "S’identifier pour réserver l'exemplaire";
        this.loginLink = true;
      } else {
        if (!this.itemData.itempolicy || this.itemData.itempolicy === "") {
          this.fieldTwo = "Empruntable"; //Quand l'ouvrage est empruntable il n'y a pas d'item policy
        } else {
          this.fieldTwo = this.itemData.itempolicy;
        }
        // Doc. Magasin on ajoute un lien vers l'authentification
        if (this.isInClosedStacks()) {
          this.loginLink = true;
          this.fieldTwo = `${this.fieldTwo} (S'identifier pour demander le document.)`;
        }
      }

    }
    /* ==========================================================================
       TRAITEMENT CHAMP 3 : DESCRIPTION / COTE / NOTE
       ========================================================================== */
    // 1. On commence par la description de l'item (vol., n°...) si elle existe
    let descriptionPart = this.itemData.itemdescription || '';

    // Nettoyage éventuel (comme le NOT_DEFINED que tu avais dans le HTML)
    descriptionPart = descriptionPart.replace('NOT_DEFINED:', '').trim();

    // 2. Si callnumber2 existe, on prépare le préfixe "cote exemplaire :"
    let cotePart = '';
    if (this.itemData.callnumber2 && this.itemData.callnumber2.trim() !== '') {
      cotePart = `> ${this.itemData.callnumber2.trim()}`;
    }

    // 3. Si itempublicnote existe, on la prépare entre parenthèses
    let notePart = '';
    if (this.itemData.itempublicnote && this.itemData.itempublicnote.trim() !== '') {
      notePart = `(${this.itemData.itempublicnote.trim()})`;
    }

    // 4. On assemble les morceaux proprement en filtrant les chaînes vides
    // afin d'éviter les espaces superflus s'il manque une info
    this.fieldThree = [descriptionPart, cotePart, notePart]
      .filter(part => part !== '')
      .join(' ');

    this.cdr.detectChanges();
  }

  /**
   * Vérifie si le document est disponible en rayon
   */
  isItemAvailable(): boolean {
    return this.cleanedStatus.startsWith('exemplaire en rayon') ||
      this.cleanedStatus.startsWith('item in place') ||
      this.cleanedStatus.startsWith('ejemplar en sitio');
  }

  /**
   * Vérifie si l'utilisateur n'est pas connecté
   */
  isNotLogIn(): boolean {
    // Correction de .contains() par .includes()
    return this.cleanedCategory.includes('identifier') ||
      this.cleanedCategory.includes('log in') ||
      this.cleanedCategory.includes('inicie sesión');
  }

  /**
   * Vérifie si le document est actuellement emprunté
   */
  isOnLoan(): boolean {
    return this.cleanedStatus.startsWith('prêt') ||
      this.cleanedStatus.startsWith('on loan') ||
      this.cleanedStatus.startsWith('en préstamo');
  }

  /**
 * Vérifie si le document est localisé en magasin. L'intitulé public de la loc contient "À demander/réserver en ligne", "Log in to make a request" ou "Identificarse para reservar"
 */
  isInClosedStacks(): boolean {
    console.log("Est en magasin :",this.cleanedLoc.includes('réserver en ligne'));
    return this.cleanedLoc.includes('réserver en ligne') ||
      this.cleanedLoc.includes('log in to make a request') ||
      this.cleanedLoc.includes('en préstamo');
  }
}