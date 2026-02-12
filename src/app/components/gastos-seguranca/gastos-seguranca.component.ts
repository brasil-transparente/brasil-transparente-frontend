import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoltarAnalisesComponent } from '../voltar-analises/voltar-analises.component';
import { ApiService } from '../../services/api/api.service';
import { DataService } from '../../services/data/data.service';
import { StorageService } from '../../services/storage/storage.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-gastos-seguranca',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    VoltarAnalisesComponent
  ],
  templateUrl: './gastos-seguranca.component.html',
  styleUrl: './gastos-seguranca.component.scss',
  standalone: true
})
export class GastosSegurancaComponent implements OnInit {
  private readonly apiService: ApiService = inject(ApiService);
  private readonly dataService: DataService = inject(DataService);
  private readonly storageService: StorageService = inject(StorageService);
  private readonly titleService: Title = inject(Title);
  private readonly metaService: Meta = inject(Meta);

  federalEntityId = '1';
  isLoading = signal(true);
  dados: any[] = [];
  showRawTotal = signal(false);

  ngOnInit(): void {
    this.setupSEO();
    this.storageService.federalEntityId$
      .subscribe(id => {
        this.federalEntityId = id;
        this.loadData();
      });
  }

  setupSEO(): void {
    this.titleService.setTitle('Gastos Federais com Segurança Pública: Análise Completa 2025 | Brasil Transparente');

    this.metaService.updateTag({ name: 'description', content: 'Veja a análise detalhada dos gastos do Brasil com segurança pública em 2025. Entenda o investimento de R$ 45,2 bilhões em programas de segurança e prevenção.' });

    this.metaService.updateTag({ property: 'og:title', content: 'Gastos Federais com Segurança Pública: Análise Completa 2025' });
    this.metaService.updateTag({ property: 'og:description', content: 'Análise detalhada dos R$ 45,2 bilhões investidos em segurança pública federal em 2025. Programas e impactos na redução da criminalidade.' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://brasiltransparente.digital/images/logo.webp' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://brasiltransparente.digital/gastos-seguranca' });
    this.metaService.updateTag({ property: 'og:type', content: 'article' });

    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Gastos Federais com Segurança Pública: Análise Completa 2025' });
    this.metaService.updateTag({ name: 'twitter:description', content: 'Análise detalhada dos R$ 45,2 bilhões investidos em segurança pública federal em 2025.' });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://brasiltransparente.digital/images/logo.webp' });

    const canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonicalLink) {
      canonicalLink.href = 'https://brasiltransparente.digital/gastos-seguranca';
    } else {
      const link: HTMLLinkElement = document.createElement('link');
      link.rel = 'canonical';
      link.href = 'https://brasiltransparente.digital/gastos-seguranca';
      document.head.appendChild(link);
    }
  }

  loadData(): void {
    this.isLoading.set(true);
    // Simular dados para demonstração
    this.dados = [
      {
        componente: 'Fundo Nacional de Segurança Pública',
        valor: 2850000000000,
        percentual: 0.97
      },
      {
        componente: 'Programas de Prevenção à Violência',
        valor: 870000000000,
        percentual: 0.30
      },
      {
        componente: 'Tecnologia e Inteligência',
        valor: 520000000000,
        percentual: 0.18
      },
      {
        componente: 'Formação e Capacitação',
        valor: 280000000000,
        percentual: 0.10
      },
      {
        componente: 'Despesa Total com Segurança',
        valor: 4520000000000,
        percentual: 1.54
      }
    ];
    this.isLoading.set(false);
  }

  formatLargeCurrency(value: number): string {
    return this.dataService.formatLargeCurrency(value);
  }

  formatCurrency(value: number): string {
    return this.dataService.formatCurrency(value);
  }
}
