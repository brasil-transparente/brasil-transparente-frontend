import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoltarAnalisesComponent } from '../voltar-analises/voltar-analises.component';
import { ApiService } from '../../services/api/api.service';
import { DataService } from '../../services/data/data.service';
import { StorageService } from '../../services/storage/storage.service';
import { ReactiveFormsModule } from '@angular/forms';
import { SeoService } from '../../services/seo/seo.service';

@Component({
  selector: 'app-gastos-defesa-aposentadoria',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    VoltarAnalisesComponent
  ],
  templateUrl: './gastos-defesa-aposentadoria.component.html',
  styleUrl: './gastos-defesa-aposentadoria.component.scss',
  standalone: true
})
export class GastosDefesaAposentadoriaComponent implements OnInit {
  private readonly apiService: ApiService = inject(ApiService);
  private readonly dataService: DataService = inject(DataService);
  private readonly storageService: StorageService = inject(StorageService);
  private readonly seoService: SeoService = inject(SeoService);

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
    this.seoService.setSeo({
      title: 'Gastos no Ministério da Defesa - Aposentadorias Militares: Análise Completa 2025',
      description: 'Veja a análise detalhada dos gastos do Brasil com aposentadorias e pensões militares em 2025. Entenda o impacto de R$ 63,994 bilhões no orçamento federal e PIB.',
      ogTitle: 'Aposentadorias Militares - Análise 2025',
      ogDescription: 'Análise detalhada dos R$ 63,994 bilhões gastos com aposentadorias e pensões militares em 2025. Impacto de 2,18% no orçamento federal.',
      ogImage: 'https://brasiltransparente.digital/images/logo-complete-white.png',
      ogUrl: 'https://brasiltransparente.digital/gastos-defesa-aposentadoria',
      ogType: 'article',
      twitterTitle: 'Aposentadorias Militares - Análise 2025',
      twitterDescription: 'Análise detalhada dos R$ 63,994 bilhões gastos com aposentadorias militares em 2025.',
      twitterImage: 'https://brasiltransparente.digital/images/logo-complete-white.png',
      canonicalUrl: 'https://brasiltransparente.digital/gastos-defesa-aposentadoria'
    });
  }

  loadData(): void {
    this.isLoading.set(true);
    // Simular dados para demonstração
    this.dados = [
      {
        componente: 'Orçamento Total Ministério da Defesa',
        valor: 13157730187303,
        percentual: 4.49
      },
      {
        componente: 'Despesas Operacionais',
        valor: 6758231963153,
        percentual: 2.31
      },
      {
        componente: 'Aposentadorias e Pensões Militares',
        valor: 6399498224150,
        percentual: 2.18
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
