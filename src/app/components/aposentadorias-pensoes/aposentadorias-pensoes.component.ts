import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoltarAnalisesComponent } from '../voltar-analises/voltar-analises.component';
import { ApiService } from '../../services/api/api.service';
import { DataService } from '../../services/data/data.service';
import { StorageService } from '../../services/storage/storage.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-aposentadorias-pensoes',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    VoltarAnalisesComponent
  ],
  templateUrl: './aposentadorias-pensoes.component.html',
  styleUrl: './aposentadorias-pensoes.component.scss',
  standalone: true
})
export class AposentadoriasPensoesComponent implements OnInit {
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
    this.titleService.setTitle('Gastos da União com Aposentadorias e Pensões: Análise Completa 2025 | Brasil Transparente');

    this.metaService.updateTag({ name: 'description', content: 'Veja a análise detalhada dos gastos do Brasil com aposentadorias e pensões em 2025. Entenda o impacto do RGPS, BPC e gastos militares no PIB.' });

    this.metaService.updateTag({ property: 'og:title', content: 'Gastos da União com Aposentadorias e Pensões: Análise Completa 2025' });
    this.metaService.updateTag({ property: 'og:description', content: 'Análise detalhada dos R$ 1,28 trilhão gastos com aposentadorias e pensões em 2025. Impacto de 43,98% no orçamento federal.' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://brasiltransparente.digital/images/logo-white-bg.png' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://brasiltransparente.digital/aposentadorias-pensoes' });
    this.metaService.updateTag({ property: 'og:type', content: 'article' });

    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Gastos da União com Aposentadorias e Pensões: Análise Completa 2025' });
    this.metaService.updateTag({ name: 'twitter:description', content: 'Análise detalhada dos R$ 1,28 trilhão gastos com aposentadorias e pensões em 2025.' });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://brasiltransparente.digital/images/logo-white-bg.png' });

    const canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonicalLink) {
      canonicalLink.href = 'https://brasiltransparente.digital/aposentadorias-pensoes';
    } else {
      const link: HTMLLinkElement = document.createElement('link');
      link.rel = 'canonical';
      link.href = 'https://brasiltransparente.digital/aposentadorias-pensoes';
      document.head.appendChild(link);
    }
  }

  loadData(): void {
    this.isLoading.set(true);
    // Simular dados para demonstração
    this.dados = [
      {
        componente: 'Regime Geral (RGPS)',
        valor: 98927450837165,
        percentual: 33.79
      },
      {
        componente: 'Servidores Públicos Civis',
        valor: 11229621883481,
        percentual: 3.83
      },
      {
        componente: 'Militares das Forças Armadas',
        valor: 6399498224150,
        percentual: 2.18
      },
      {
        componente: 'Benefício de Prestação Continuada',
        valor: 12206332820732,
        percentual: 4.17
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
