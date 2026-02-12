import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoltarAnalisesComponent } from '../voltar-analises/voltar-analises.component';
import { ApiService } from '../../services/api/api.service';
import { DataService } from '../../services/data/data.service';
import { StorageService } from '../../services/storage/storage.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-gastos-educacao',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    VoltarAnalisesComponent
  ],
  templateUrl: './gastos-educacao.component.html',
  styleUrl: './gastos-educacao.component.scss',
  standalone: true
})
export class GastosEducacaoComponent implements OnInit {
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
    this.titleService.setTitle('Gastos da União com Educação: Análise Completa 2025 | Brasil Transparente');

    this.metaService.updateTag({ name: 'description', content: 'Veja a análise detalhada dos gastos do Brasil com educação em 2025. Entenda os R$ 234,73 bilhões distribuídos em 6 blocos institucionais: FNDE, Universidades, Institutos Federais e mais.' });

    this.metaService.updateTag({ property: 'og:title', content: 'Gastos da União com Educação: Análise Completa 2025' });
    this.metaService.updateTag({ property: 'og:description', content: 'Análise detalhada dos R$ 234,73 bilhões gastos com educação federal em 2025. Distribuição por 6 blocos institucionais: FNDE, Universidades, Institutos e mais.' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://brasiltransparente.digital/images/logo.webp' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://brasiltransparente.digital/gastos-educacao' });
    this.metaService.updateTag({ property: 'og:type', content: 'article' });

    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Gastos da União com Educação: Análise Completa 2025' });
    this.metaService.updateTag({ name: 'twitter:description', content: 'Análise detalhada dos R$ 234,73 bilhões gastos com educação federal em 2025.' });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://brasiltransparente.digital/images/logo.webp' });

    const canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonicalLink) {
      canonicalLink.href = 'https://brasiltransparente.digital/gastos-educacao';
    } else {
      const link: HTMLLinkElement = document.createElement('link');
      link.rel = 'canonical';
      link.href = 'https://brasiltransparente.digital/gastos-educacao';
      document.head.appendChild(link);
    }
  }

  loadData(): void {
    this.isLoading.set(true);
    // Simular dados para demonstração
    this.dados = [
      {
        componente: 'FNDE',
        valor: 82780000000000,
        percentual: 0.71
      },
      {
        componente: 'Universidades Federais',
        valor: 94000000000000,
        percentual: 0.80
      },
      {
        componente: 'Institutos Federais + CEFET + UTFPR',
        valor: 32000000000000,
        percentual: 0.27
      },
      {
        componente: 'Hospitais Universitários',
        valor: 16440000000000,
        percentual: 0.14
      },
      {
        componente: 'CAPES',
        valor: 6210000000000,
        percentual: 0.05
      },
      {
        componente: 'Outros Órgãos do MEC',
        valor: 3300000000000,
        percentual: 0.03
      },
      {
        componente: 'Despesa Total com Educação',
        valor: 234730000000000,
        percentual: 2.01
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
