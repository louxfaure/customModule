import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { throwError, of } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators'; // Regroupe les imports

@Injectable({ providedIn: 'root' })
export class OsmService {
  // Utilisation d'un miroir souvent plus stable
  private overpassUrl = 'https://overpass.kumi.systems/api/interpreter';

  constructor(private http: HttpClient) {}

  getLibraryHours(osmIds: string[]) {
    const query = `[out:json][timeout:25];
    nwr(id:${osmIds.join(',')});
    out tags;`;
    console.log("Requête OSM :",query)

    return this.http.get(`${this.overpassUrl}?data=${encodeURIComponent(query)}`).pipe(
      retry(2), 
      // On transforme les données TANT QUE tout va bien
      map((res: any) => {
        if (!res.elements) return [];
return res.elements
    .filter((el: any) => el.tags) // 2. ON FILTRE : On ne garde que ceux qui ont des tags
    .map((el: any) => ({
      name: el.tags.name || 'Bibliothèque sans nom',
      opening_hours: el.tags.opening_hours || 'Horaires non renseignés',
      city: el.tags['addr:city'] || el.tags['addr:town'] || 'Ville non précisée'
    }));
      }),
      // On attrape l'erreur à la fin si le retry a échoué
      catchError(err => {
        console.error('Erreur Overpass API:', err);
        return of([]); 
      })
    );
  }
}