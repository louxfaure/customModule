import {ApplicationRef, DoBootstrap, Injector, NgModule, LOCALE_ID} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import { HttpClientModule } from '@angular/common/http';
import {createCustomElement, NgElementConstructor} from "@angular/elements";
import {Router} from "@angular/router";
import {selectorComponentMap} from "./custom1-module/customComponentMappings";
import {TranslateModule} from "@ngx-translate/core";
import { CommonModule, registerLocaleData } from '@angular/common';
import { AutoAssetSrcDirective } from './services/auto-asset-src.directive';
import {SHELL_ROUTER} from "./injection-tokens";
import localeFr from '@angular/common/locales/fr'; // Importe les données FR

// ENREGISTREMENT DE LA LOCALE 
registerLocaleData(localeFr);


export const AppModule = ({providers, shellRouter}: {providers:any, shellRouter: Router}) => {
   @NgModule({
    declarations: [
      AppComponent,
      AutoAssetSrcDirective,
    ],
    exports: [AutoAssetSrcDirective],
    imports: [
      BrowserModule,
      CommonModule,
      TranslateModule.forRoot({}),
      HttpClientModule
    ],
    providers: [...providers, 
              {provide: SHELL_ROUTER, useValue: shellRouter},
              {provide: LOCALE_ID, useValue: 'fr-FR'}],
    bootstrap: []
  })
  class AppModule implements DoBootstrap{
    private webComponentSelectorMap = new Map<string,  NgElementConstructor<unknown>>();

    constructor(private injector: Injector, private router: Router) {
      router.dispose(); //this prevents the router from being initialized and interfering with the shell app router
    }

    ngDoBootstrap(appRef: ApplicationRef) {
      for (const [key, value] of selectorComponentMap) {
        const customElement = createCustomElement(value, {injector: this.injector});
        this.webComponentSelectorMap.set(key, customElement);
      }
    }

    /**
     * Use componentMapping, selectorComponentMap
     * @param componentName
     */
    public getComponentRef(componentName:string) {
      return this.webComponentSelectorMap.get(componentName);
    }
  }
  return AppModule
}

