import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'     
}) 
export class UbmAuthService {

  constructor() {}

  /**
   * Génère l'URL de connexion Primo à partir de l'URL courante du navigateur
   */
  getLoginUrl(page?: string): String {
    try {
      const currentUrlStr = window.location.href;
      const url = new URL(currentUrlStr);

      const state = page ?? url.pathname.split('/nde/').pop() ?? "account/overview";
      const vid = url.searchParams.get('vid') || '33PUDB_UBM:NDE';
      
      const paramsObj: { [key: string]: string } = {};
      url.searchParams.forEach((value, key) => {
        paramsObj[key] = value;
      });

      const toParamsJson = JSON.stringify(paramsObj);
      return `login?vid=${vid}&toState=${state}&toParams=${encodeURIComponent(toParamsJson)}`;
      
    } catch (e) {
      console.error("Erreur lors de la construction de l'URL de login", e);
      return 'login?vid=33PUDB_UBM:NDE&toState=account/overview&toParams={"vid":"33PUDB_UBM:NDE","lang":"fre"}';
    }
  }

}