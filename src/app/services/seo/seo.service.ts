import { Injectable, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Title } from '@angular/platform-browser';

export interface SeoConfig {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogImageWidth?: string;
  ogImageHeight?: string;
  ogImageAlt?: string;
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
  private readonly document: Document = inject(DOCUMENT);

  private readonly defaultImage = 'https://brasiltransparente.digital/images/logo-complete-white.png';
  private readonly defaultImageWidth = '1200';
  private readonly defaultImageHeight = '630';
  private readonly defaultImageAlt = 'Brasil Transparente - Logo';
  private readonly siteName = 'Brasil Transparente';

  setSeo(config: SeoConfig): void {
    this.titleService.setTitle(`${config.title} | ${this.siteName}`);

    this.updateMetaByName('description', config.description);

    this.updateMetaByProperty('og:title', config.ogTitle ?? config.title);
    this.updateMetaByProperty('og:description', config.ogDescription ?? config.description);
    this.updateMetaByProperty('og:image', config.ogImage ?? this.defaultImage);
    this.updateMetaByProperty('og:image:width', config.ogImageWidth ?? this.defaultImageWidth);
    this.updateMetaByProperty('og:image:height', config.ogImageHeight ?? this.defaultImageHeight);
    this.updateMetaByProperty('og:image:alt', config.ogImageAlt ?? this.defaultImageAlt);
    this.updateMetaByProperty('og:url', config.ogUrl);
    this.updateMetaByProperty('og:type', config.ogType ?? 'website');

    this.updateMetaByName('twitter:card', config.twitterCard ?? 'summary_large_image');
    this.updateMetaByName('twitter:title', config.twitterTitle ?? config.ogTitle ?? config.title);
    this.updateMetaByName('twitter:description', config.twitterDescription ?? config.ogDescription ?? config.description);
    this.updateMetaByName('twitter:image', config.twitterImage ?? config.ogImage ?? this.defaultImage);

    this.updateCanonicalUrl(config.canonicalUrl);
  }

  private updateMetaByName(name: string, content: string): void {
    const head = this.document.head;
    let element = head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
    if (element) {
      element.setAttribute('content', content);
    } else {
      element = this.document.createElement('meta');
      element.setAttribute('name', name);
      element.setAttribute('content', content);
      head.appendChild(element);
    }
  }

  private updateMetaByProperty(property: string, content: string): void {
    const head = this.document.head;
    let element = head.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
    if (element) {
      element.setAttribute('content', content);
    } else {
      element = this.document.createElement('meta');
      element.setAttribute('property', property);
      element.setAttribute('content', content);
      head.appendChild(element);
    }
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
