import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { ReportType } from '../../models/tipos-relatorios.model';
import { environment } from 'environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private static readonly SHOULD_CACHE = environment.shouldCache;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private static readonly DEFAULT_FEDERAL_ENTITY_IMAGE =
    'images/estados/uniao.svg';

  // TODO alterar para signal
  private federalEntityNameSubject = new BehaviorSubject<string>(
    'União Federal'
  );
  private federalEntityImageSubject = new BehaviorSubject<string>(
    StorageService.DEFAULT_FEDERAL_ENTITY_IMAGE
  );
  private federalEntityIdSubject = new BehaviorSubject<string>('1');

  federalEntityName$ = this.federalEntityNameSubject.asObservable();
  federalEntityImage$ = this.federalEntityImageSubject.asObservable();
  federalEntityId$ = this.federalEntityIdSubject.asObservable();

  activeReport = signal<ReportType>(ReportType.Simplificado);

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage(): void {
    if (!this.isBrowser) return;

    const name = localStorage.getItem('federalEntityName');
    const image = localStorage.getItem('federalEntityImage');
    const id = localStorage.getItem('federalEntityId');

    //TODO simplificar
    if (name) this.federalEntityNameSubject.next(name);
    if (image) this.federalEntityImageSubject.next(image);
    if (id) this.federalEntityIdSubject.next(id);
  }

  setFederalEntity(name: string, image: string, id: string): void {
    if (this.isBrowser) {
      localStorage.setItem('federalEntityName', name);
      localStorage.setItem('federalEntityImage', image);
      localStorage.setItem('federalEntityId', id);
    }

    this.federalEntityNameSubject.next(name);
    this.federalEntityImageSubject.next(image);
    this.federalEntityIdSubject.next(id);
  }

  private cacheKey(url: string): string {
    return `apiCache:${url}`;
  }

  getCached<T>(url: string): T | null {
    if (!StorageService.SHOULD_CACHE || !this.isBrowser) return null;

    const cached = localStorage.getItem(this.cacheKey(url));
    if (!cached) return null;

    try {
      const { data, timestamp } = JSON.parse(cached);
      // 1 hora = 3_600_000 ms
      if (Date.now() - timestamp < 3_600_000) {
        return data as T;
      }
    } catch {
      console.error(`Erro ao parsear cache para a URL: ${url}`);
    }
    localStorage.removeItem(this.cacheKey(url));
    return null;
  }

  setCache<T>(url: string, data: T): void {
    if (!this.isBrowser) return;

    localStorage.setItem(
      this.cacheKey(url),
      JSON.stringify({ data, timestamp: Date.now() })
    );
  }
}
