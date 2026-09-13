import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UbmHelpOverlayComponent } from '../ubm-help-overlay/ubm-help-overlay.component';
import { AssetsPublicPathDirective } from '../services/assets-public-path.directive'; 


// On définit une interface pour typer proprement nos données
interface Institution {
  code: string;
  name: string;
  vid:  string;
  url?: string;
}

@Component({
  selector: 'custom-ubm-footer',
  standalone: true,
  imports: [CommonModule, UbmHelpOverlayComponent, AssetsPublicPathDirective],
  templateUrl: './ubm-footer.component.html',
  styleUrl: './ubm-footer.component.scss'
})
export class UbmFooterComponent implements OnInit {
  // Équivalent du binding parentCtrl:'<' d'AngularJS
  @Input() parentCtrl: any;

  message: string = "Réseau des bibliothèques universitaires bordelaises";
  displayFooter: boolean = true;
  institutionsList: Institution[] = [
    { 'code': 'BXSA', 'name': 'Babord + Bordeaux Sciences Agro','vid': '33PUDB_BXSA:33PUDB_BXSA_NDE' },
    { 'code': 'IEP',  'name': 'Babord + Sciences Po Bordeaux' , 'vid': '33PUDB_IEP:33PUDB_IEP_NDE_VU1'},
    { 'code': 'INP',  'name': 'Babord + Institut National Polytechnique de Bordeaux', 'vid':'33PUDB_INP:33PUDB_INP_VU3' },
    { 'code': 'UB',   'name': 'Babord + Université de Bordeaux', 'vid':'33PUDB_UB:33PUDB_UB_NDE' },
    { 'code': 'UBM',  'name': 'Babord + Université Bordeaux Montaigne','vid':'33PUDB_UBM:NDE' }
  ];

  ngOnInit(): void {
    console.log("Custom footer started");

    // Récupération de l'URL actuelle
    const url = new URL(window.location.href);
    const displayFooterParam = url.searchParams.get('displayFooter');

    if (displayFooterParam === 'false') {
      this.displayFooter = false;
    }

    // Traitement de la liste des institutions
    this.institutionsList.forEach((institution) => {
      let modifiedHostname = url.hostname;

      if (modifiedHostname.startsWith('pudb-')) {
        modifiedHostname = `https://pudb-${institution.code.toLowerCase()}.primo.exlibrisgroup.com`;
      } else {
        // Optionnel : si on n'est pas sur pudb-, on s'assure d'avoir le protocole correct
        modifiedHostname = `${url.protocol}//${url.host}`;
      }

      institution.url = `${modifiedHostname}/nde/home?vid=${institution.vid}`;
    });

    // Tri alphabétique correct par code (ex: BXSA, IEP, INP...)
    this.institutionsList.sort((a, b) => a.code.localeCompare(b.code));

    console.log("Custom footer finished", this.institutionsList);
  }
}