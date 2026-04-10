
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { RssItem, RssService, } from './ubm-rss.service';
import {OaRssItem, OaRssService} from './ubm-oagenda-rss.service'
import { AssetsPublicPathDirective } from '../services/assets-public-path.directive'; 
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable, map } from 'rxjs'; // Ajoute map dans tes imports rxjs
// import { OsmService } from './osm.service'; Horaires depuis Open Street Map

@Component({
  selector: 'app-actualites',
  standalone: true,
  imports: [CommonModule, DatePipe, AssetsPublicPathDirective,TranslateModule],
  templateUrl: './ubm-homepage-actu.component.html',
  styleUrl: './ubm-homepage-actu.component.scss'
})
export class UbmHomepageActuComponent implements OnInit {
  librariesData = [
    {"Name" : "Bibliothèque de Lettres et Sciences humaines",
      "Code" : "bulsh",
      "Url" : "https://www.u-bordeaux-montaigne.fr/fr/documentation/vos-bibliotheques/bibliotheque-de-lettres-et-sciences-humaines.html"
    },
    {"Name" : "Bibliothèque Rigoberta Menchú",
      "Code" : "brm",
      "Url" : "https://www.u-bordeaux-montaigne.fr/fr/documentation/vos-bibliotheques/bibliotheque-rigoberta-menchu.html"
    },
    {"Name" : "Bibliothèque Robert Étienne",
      "Code" : "bre",
      "Url" : "https://www.u-bordeaux-montaigne.fr/fr/documentation/vos-bibliotheques/bibliotheque-robert-etienne.html"
    },
    {"Name" : "Bibliothèque universitaire du campus du Pin (Agen)",
      "Code" : "agen",
      "Url" : "https://www.u-bordeaux-montaigne.fr/fr/documentation/vos-bibliotheques/bibliotheque-universitaire-du-campus-du-pin-agen.html"
    },
    {"Name" : "Centre de ressources Montaigne IUT/IJBA",
      "Code" : "iut",
      "Url" : "https://www.u-bordeaux-montaigne.fr/fr/documentation/vos-bibliotheques/centre_de_ressources_montaigne.html"
    },
    {"Name" : "Centre Regards – Espace GeoDock",
      "Code" : "regards",
      "Url" : "https://www.u-bordeaux-montaigne.fr/fr/documentation/vos-bibliotheques/centre-regards-espace-geodock.html"
    },
  ]
  // libraryIds = ['1064001697', '1062954753']; Horaires depuis Open Street Map
  // librariesData: any[] = []; Horaires depuis Open Street Map
  items: RssItem[] = [];
  oaitems: OaRssItem[] = [];
  loading = true;
  error   = false;
  vue: string | null = null;
  langue: string | null = null;

   @Input() set hostComponent(value: any) {
      console.log('UbmHomePageComponent hostComponent:', value);
      if (!value) return;
    }


  constructor(
    private rss: RssService, 
    private oarss: OaRssService,
    private translate: TranslateService,
    // private osmService: OsmService Horaires depuis Open Street Map
  ) {}

  ngOnInit() {

    const params = new URLSearchParams(window.location.search);
    this.vue = params.get('vid');
    this.langue = params.get('lang');
    console.log('Paramètres reçus :', { vue: this.vue, langue: this.langue });
    // this.osmService.getLibraryHours(this.libraryIds).subscribe(data => {
    //   this.librariesData = data;
    // }); Horaires depuis Open Street Map
    this.rss.getItems(3).subscribe({
      next:  items => { this.items = items; this.loading = false; },
      error: ()    => { this.error = true;  this.loading = false; }
    });
    this.oarss.getItems(3).subscribe({
      next:  oaitems => { this.items = oaitems; this.loading = false; },
      error: ()    => { this.error = true;  this.loading = false; }
    });
    
  }


  excerpt(html: string, max: number): string {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    const text = (tmp.textContent || '').replace(/\s+/g, ' ').trim();
    return text.length > max ? text.slice(0, max).trimEnd() + '…' : text;
  }
}