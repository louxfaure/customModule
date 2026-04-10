import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface OaRssItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  imageUrl?: string; // Nouveau champ pour l'image
}

@Injectable({ providedIn: 'root' })
export class OaRssService {
  private readonly PROXY = 'https://corsproxy.io/?';
  private readonly RSS = 'https://openagenda.com/agendas/72413086/events.v2.rss?relative%5B0%5D=current&relative%5B1%5D=upcoming&sort=updatedAt.desc';

  constructor(private http: HttpClient) {}

  getItems(count = 3): Observable<OaRssItem[]> {
    // const url = this.PROXY + encodeURIComponent(this.RSS);
    const url = encodeURIComponent(this.RSS);
    return this.http.get(url, { responseType: 'text' }).pipe(
      map(xml => {
        const doc = new DOMParser().parseFromString(xml, 'text/xml');
        
        return Array.from(doc.querySelectorAll('item'))
          .slice(0, count)
          .map(item => {
            const description = item.querySelector('description')?.textContent ?? '';
            const rawDate = item.querySelector('pubDate')?.textContent ?? '';
            console.log("RawDate :",rawDate);
            const parsedDate = rawDate ? new Date(rawDate) : new Date();
            console.log("ParsedDate :",parsedDate);
            
            // 1. On cherche l'image dans la balise <enclosure> (souvent utilisée par les CMS)
            let foundImg = item.querySelector('enclosure[type^="image"]')?.getAttribute('url');

            // 2. Si non trouvée, on tente d'extraire la source de la 1ère image dans la description HTML
            if (!foundImg) {
              const imgMatch = description.match(/<img[^>]+src=["']([^"']+)["']/i);
              foundImg = imgMatch ? imgMatch[1] : undefined;
            }

            // 3. Correction de la définition (Upscaling manuel)
            if (foundImg && foundImg.includes('_max150x150')) {
              // On remplace le suffixe de petite taille par celui de haute définition
              foundImg = foundImg.replace('_max150x150', '_max0x640');
            }

            return {
              title:       item.querySelector('title')?.textContent       ?? '',
              link:        item.querySelector('link')?.textContent        ?? '#',
              pubDate:     parsedDate.toISOString(),
              description: description,
              imageUrl:    foundImg
            };
          });
      })
    );
  }
}