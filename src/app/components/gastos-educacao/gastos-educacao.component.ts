import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoltarAnalisesComponent } from '../voltar-analises/voltar-analises.component';
import { ApiService } from '../../services/api/api.service';
import { DataService } from '../../services/data/data.service';
import { StorageService } from '../../services/storage/storage.service';
import { ReactiveFormsModule } from '@angular/forms';
import { SeoService } from '../../services/seo/seo.service';

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
      title: 'Gastos da União com Educação: Análise Completa 2025',
      description: 'Veja a análise detalhada dos gastos do Brasil com educação em 2025. Entenda os R$ 234,73 bilhões distribuídos em 6 blocos institucionais: FNDE, Universidades, Institutos Federais e mais.',
      ogDescription: 'Análise detalhada dos R$ 234,73 bilhões gastos com educação federal em 2025. Distribuição por 6 blocos institucionais: FNDE, Universidades, Institutos e mais.',
      ogUrl: 'https://brasiltransparente.digital/gastos-educacao',
      ogType: 'article',
      twitterDescription: 'Análise detalhada dos R$ 234,73 bilhões gastos com educação federal em 2025.',
      canonicalUrl: 'https://brasiltransparente.digital/gastos-educacao'
    });
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
