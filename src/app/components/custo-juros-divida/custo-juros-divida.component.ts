import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { DataService } from '../../services/data/data.service';
import { StorageService } from '../../services/storage/storage.service';
import { VoltarAnalisesComponent } from '../voltar-analises/voltar-analises.component';

@Component({
  selector: 'app-custo-juros-divida',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    VoltarAnalisesComponent
  ],
  templateUrl: './custo-juros-divida.component.html',
  styleUrl: './custo-juros-divida.component.scss',
  standalone: true
})
export class CustoJurosDividaComponent implements OnInit {
  private readonly storageService: StorageService = inject(StorageService);
  private readonly dataService: DataService = inject(DataService);
  private readonly titleService: Title = inject(Title);
  private readonly metaService: Meta = inject(Meta);

  federalEntityId = '1';
  isLoading = signal(true);
  dados: any[] = [];

  ngOnInit(): void {
    this.setupSEO();
    this.storageService.federalEntityId$
      .subscribe(id => {
        this.federalEntityId = id;
        this.loadData();
      });
  }

  setupSEO(): void {
    this.titleService.setTitle('Custo com Juros da Dívida Pública Federal: Análise Completa 2025 | Brasil Transparente');

    this.metaService.updateTag({ name: 'description', content: 'Entenda o custo dos juros da dívida pública federal em 2025, seu impacto no orçamento da União e como essa despesa afeta prioridades como saúde, educação e investimentos.' });

    this.metaService.updateTag({ property: 'og:title', content: 'Custo com Juros da Dívida Pública Federal: Análise Completa 2025' });
    this.metaService.updateTag({ property: 'og:description', content: 'Análise do custo com juros da dívida pública federal em 2025 e seu impacto no orçamento da União.' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://brasiltransparente.digital/images/logo.webp' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://brasiltransparente.digital/custo-juros-divida' });
    this.metaService.updateTag({ property: 'og:type', content: 'article' });

    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Custo com Juros da Dívida Pública Federal: Análise Completa 2025' });
    this.metaService.updateTag({ name: 'twitter:description', content: 'Análise detalhada do custo com juros da dívida pública federal em 2025 e seu impacto no orçamento.' });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://brasiltransparente.digital/images/logo.webp' });

    const canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonicalLink) {
      canonicalLink.href = 'https://brasiltransparente.digital/custo-juros-divida';
    } else {
      const link: HTMLLinkElement = document.createElement('link');
      link.rel = 'canonical';
      link.href = 'https://brasiltransparente.digital/custo-juros-divida';
      document.head.appendChild(link);
    }
  }

  loadData(): void {
    this.isLoading.set(true);

    this.dados = [
      {
        componente: 'Juros e Encargos da Dívida (Total)',
        valor: 0,
        percentual: 0,
        percentualPib: 0
      },
      {
        componente: 'Juros da Dívida Interna',
        valor: 0,
        percentual: 0,
        percentualPib: 0
      },
      {
        componente: 'Juros da Dívida Externa',
        valor: 0,
        percentual: 0,
        percentualPib: 0
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
