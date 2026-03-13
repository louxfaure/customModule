import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { SHELL_ROUTER } from '../injection-tokens';
 
@Component({
  selector: 'ubm-resource-type-bar-hook',
  standalone: true,
  template: '',
})
export class UbmResourceTypeBarHookComponent implements OnInit, OnDestroy {
 
  private router = inject(SHELL_ROUTER);
  private routerSub!: Subscription;
  private observer!: MutationObserver;
  private boundHandler = this.handleClick.bind(this);
 
  ngOnInit(): void {
    this.attachListeners();

    this.routerSub = this.router.events.pipe(
      filter((e: any) => e instanceof NavigationEnd)
    ).subscribe(() => {
      setTimeout(() => {
        this.attachListeners();
        this.syncActiveClass(); // Resync l'état actif après navigation
      }, 300);
    });
  }
 
  ngOnDestroy(): void {
    this.detachListeners();
    this.observer?.disconnect();
    this.routerSub?.unsubscribe();
  }
 
  // ─── DOM ────────────────────────────────────────────────────────────────────
 
  private getBar(): HTMLElement | null {
    return document.querySelector('nde-search-results-resource-type-bar');
  }
 
  private attachListeners(): void {
    this.detachListeners();
    this.observer?.disconnect();
 
    const bar = this.getBar();
    if (!bar) return;
 
    this.bindButtons(bar);

    this.observer = new MutationObserver(() => {
      this.bindButtons(bar);
      this.syncActiveClass(); // Resync si le DOM est reconstruit
    });
    this.observer.observe(bar, { childList: true, subtree: true });
  }
 
  private bindButtons(bar: HTMLElement): void {
    bar.querySelectorAll<HTMLElement>('button[data-qa]').forEach(btn => {
      btn.removeEventListener('click', this.boundHandler, true);
      btn.addEventListener('click', this.boundHandler, true);
    });
  }
 
  private detachListeners(): void {
    document
      .querySelectorAll<HTMLElement>('nde-search-results-resource-type-bar button[data-qa]')
      .forEach(btn => btn.removeEventListener('click', this.boundHandler, true));
  }

  // ─── Gestion classe active ───────────────────────────────────────────────────

  private setActiveButton(activeDataQa: string | null): void {
    const bar = this.getBar();
    if (!bar) return;

    bar.querySelectorAll<HTMLElement>('button[data-qa]').forEach(btn => {
      const qa = btn.getAttribute('data-qa');
      if (activeDataQa === null || activeDataQa === 'rt_All') {
        // Activer "All", désactiver les autres
        btn.classList.toggle('active-resource-type', qa === 'rt_All');
      } else {
        // Activer le bouton cliqué, désactiver "All" et les autres
        btn.classList.toggle('active-resource-type', qa === activeDataQa);
      }
    });
  }

  /**
   * Lit les queryParams courants pour déterminer quel bouton doit être actif.
   * Utilisé après navigation ou reconstruction du DOM.
   */
  private syncActiveClass(): void {
    const urlTree = this.router.parseUrl(this.router.url);
    const facets = this.toArray(urlTree.queryParams['facet']);
    const activeRtype = facets.find(f => f.startsWith('rtype,'));

    if (activeRtype) {
      // ex: "rtype,include,comic" → extraire "comic" → reconstruire "rt_comic"
      const parts = activeRtype.split(',');
      const value = parts[2]; // "comic"
      this.setActiveButton(value ? `rt_${value}` : null);
    } else {
      this.setActiveButton('rt_All');
    }
  }
 
  // ─── Interception clic ──────────────────────────────────────────────────────
 
  private handleClick(event: Event): void {
    const btn = (event.target as HTMLElement).closest<HTMLElement>('button[data-qa]');
    if (!btn) return;
 
    const dataQa = btn.getAttribute('data-qa');
    if (!dataQa) return;
 
    event.stopImmediatePropagation();
    event.preventDefault();
 
    const urlTree = this.router.parseUrl(this.router.url);
    const params: Record<string, any> = { ...urlTree.queryParams };
 
    if (dataQa === 'rt_All') {
      params['facet']   = this.removeByPrefix(params['facet'],   'rtype,');
      params['pfilter'] = this.removeByPrefix(params['pfilter'], 'rtype,');
      delete params['mode'];

      this.setActiveButton('rt_All'); // ← All actif, autres inactifs
    } else {
      const rtypeValue = dataQa.replace(/^rt_/, '');
 
      params['pfilter'] = this.removeByPrefix(params['pfilter'], 'rtype,');
      delete params['mode'];
 
      const facets = this.toArray(params['facet']).filter(f => !f.startsWith('rtype,'));
      facets.push(`rtype,include,${rtypeValue}`);
      params['facet'] = this.fromArray(facets);

      this.setActiveButton(dataQa); // ← bouton cliqué actif, All inactif
    }
 
    params['offset'] = '0';
 
    this.router.navigate([], { queryParams: params, replaceUrl: false });
  }
 
  // ─── Helpers ────────────────────────────────────────────────────────────────
 
  private toArray(val: string | string[] | undefined): string[] {
    if (!val) return [];
    return Array.isArray(val) ? val : [val];
  }
 
  private fromArray(arr: string[]): string | string[] | undefined {
    if (arr.length === 0) return undefined;
    return arr.length === 1 ? arr[0] : arr;
  }
 
  private removeByPrefix(
    val: string | string[] | undefined,
    prefix: string
  ): string | string[] | undefined {
    return this.fromArray(this.toArray(val).filter(v => !v.startsWith(prefix)));
  }
}