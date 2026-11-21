import { Injectable, signal, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ReportType } from '../../models/tipos-relatorios.model';
import { environment } from 'environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private isBrowser: boolean;
  private static readonly SHOULD_CACHE = environment.shouldCache;

  activeReport = signal<ReportType>(ReportType.Simplificado);

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);

  }

  private cacheKey(url: string): string {
    return `apiCache:${url}`;
  }

  getCached<T>(url: string): T | null {
    if (!this.isBrowser || !StorageService.SHOULD_CACHE) return null;

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
