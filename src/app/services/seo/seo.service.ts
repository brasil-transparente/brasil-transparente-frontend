import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { environment } from '../../../environments/environment.development';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);
  private readonly baseUrl = environment.siteUrl;

  updateCanonical(path: string): void {
    const canonicalUrl = path === '/' || path === ''
      ? `${this.baseUrl}/`
      : `${this.baseUrl}${path}`;

    let link: HTMLLinkElement | null = this.document.querySelector("link[rel='canonical']");
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', canonicalUrl);
  }
}
