import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';

export interface SeoConfig {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly titleService: Title = inject(Title);
  private readonly metaService: Meta = inject(Meta);
  private readonly document: Document = inject(DOCUMENT);

  private readonly defaultImage = 'https://brasiltransparente.digital/images/logo.webp';
  private readonly siteName = 'Brasil Transparente';

  setSeo(config: SeoConfig): void {
    this.titleService.setTitle(`${config.title} | ${this.siteName}`);

    this.metaService.updateTag({ name: 'description', content: config.description });

    this.metaService.updateTag({ property: 'og:title', content: config.ogTitle ?? config.title });
    this.metaService.updateTag({ property: 'og:description', content: config.ogDescription ?? config.description });
    this.metaService.updateTag({ property: 'og:image', content: config.ogImage ?? this.defaultImage });
    this.metaService.updateTag({ property: 'og:url', content: config.ogUrl });
    this.metaService.updateTag({ property: 'og:type', content: config.ogType ?? 'website' });

    this.metaService.updateTag({ name: 'twitter:card', content: config.twitterCard ?? 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: config.twitterTitle ?? config.ogTitle ?? config.title });
    this.metaService.updateTag({ name: 'twitter:description', content: config.twitterDescription ?? config.ogDescription ?? config.description });
    this.metaService.updateTag({ name: 'twitter:image', content: config.twitterImage ?? config.ogImage ?? this.defaultImage });

    this.updateCanonicalUrl(config.canonicalUrl);
  }

  private updateCanonicalUrl(url: string): void {
    const head = this.document.head;
    let canonicalLink = head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (canonicalLink) {
      canonicalLink.href = url;
    } else {
      canonicalLink = this.document.createElement('link');
      canonicalLink.rel = 'canonical';
      canonicalLink.href = url;
      head.appendChild(canonicalLink);
    }
  }
}
