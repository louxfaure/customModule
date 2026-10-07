import { Component, Input, Inject, OnInit, OnDestroy, NgZone, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'custom-ubm-location-hook',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './ubm-location-hook.component.html',
  styleUrl: './ubm-location-hook.component.scss'
})
export class UbmLocationHookComponent implements OnInit, OnDestroy {
  hasMagasin: boolean = false;
  isUnavailable: boolean = false;
  isNoInventory: boolean = false;
  inReserve: boolean = false;
  isLogin: boolean = false;

  private loginObserver?: MutationObserver;
  private bodyObserver?: MutationObserver;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  @Input() set hostComponent(value: any) {
    console.log('Location Hook Valeurs du parent :', value);
    //En magasin ?
    const locationText = value.location?.subLocation;
    const magTerms = ['magasin', 'log in to make a request', 'identificarse para reservar'];
    const text = locationText.toLowerCase();
    this.hasMagasin = magTerms.some(term => text.includes(term));
    //Dan sune réserve ?
      const reserveCodes = ['3100400111', '3100400184'];
    this.inReserve = reserveCodes.includes(value.location?.subLocationCode ?? '');
    //Est indisponible ?
    this.isUnavailable = value.location?.availabilityStatus === 'unavailable';
    this.updateLoginState(); // valeur initiale
  }

  ngOnInit(): void {
    this.observeLoginButton();
  }

  ngOnDestroy(): void {
    this.loginObserver?.disconnect();
    this.bodyObserver?.disconnect();
  }

  private updateLoginState(): void {
    const userButton = this.document.getElementById('user-area-button');
    this.isLogin = userButton ? userButton.classList.contains('user-area-logged-in') : false;
  }

  private observeLoginButton(): void {
    const userButton = this.document.getElementById('user-area-button');

    if (userButton) {
      this.attachClassObserver(userButton);
      return;
    }

    // Si le bouton n'existe pas encore au chargement, on attend son apparition dans le DOM
    this.bodyObserver = new MutationObserver(() => {
      const btn = this.document.getElementById('user-area-button');
      if (btn) {
        this.bodyObserver?.disconnect();
        this.attachClassObserver(btn);
      }
    });
    this.bodyObserver.observe(this.document.body, { childList: true, subtree: true });
  }

  private attachClassObserver(el: HTMLElement): void {
    this.updateLoginState();

    this.loginObserver = new MutationObserver((mutations) => {
      const classChanged = mutations.some(m => m.attributeName === 'class');
      if (classChanged) {
        this.ngZone.run(() => {
          this.updateLoginState();
          this.cdr.markForCheck();
        });
      }
    });

    this.loginObserver.observe(el, { attributes: true, attributeFilter: ['class'] });
  }

  triggerLogin(event: Event): void {
    event.preventDefault();
    const loginButton = this.document.querySelector<HTMLButtonElement>('nde-login button');
    if (loginButton) loginButton.click();
  }
}