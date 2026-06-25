import { Component, OnInit, OnDestroy, Inject, Input } from '@angular/core';
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
  private readonly MAX_ATTEMPTS = 40; // Max 10 seconds of polling (40 * 250ms);

  // Correction ici : ajout du @ devant Input
  @Input() set hostComponent(value: any) {
    if (value) {
      console.log("--- Requests : Valeurs du Host Component ---");
      console.log(value);
      // Optionnel : si tu veux voir directement ses propriétés clés (ex: parentCtrl) dans la console :
      // console.dir(value); 
    }
  }

  constructor(@Inject(DOCUMENT) private document: Document) {}

  ngOnInit(): void {
    // Ton code de polling actuel...
  }

  ngOnDestroy(): void {
    // Ton code de nettoyage...
  }
}