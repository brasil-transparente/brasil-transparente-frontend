import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SeoService } from '../../services/seo/seo.service';
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
  private readonly seoService: SeoService = inject(SeoService);

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
    this.seoService.setSeo({
      title: 'Custo com Juros da Dívida Pública Federal: Análise Completa 2025',
      description: 'Entenda o custo dos juros da dívida pública federal em 2025, seu impacto no orçamento da União e como essa despesa afeta prioridades como saúde, educação e investimentos.',
      ogDescription: 'Análise do custo com juros da dívida pública federal em 2025 e seu impacto no orçamento da União.',
      ogUrl: 'https://brasiltransparente.digital/custo-juros-divida',
      ogType: 'article',
      twitterDescription: 'Análise detalhada do custo com juros da dívida pública federal em 2025 e seu impacto no orçamento.',
      canonicalUrl: 'https://brasiltransparente.digital/custo-juros-divida'
    });
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
