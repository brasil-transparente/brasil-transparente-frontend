import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoltarAnalisesComponent } from '../voltar-analises/voltar-analises.component';
import { ApiService } from '../../services/api/api.service';
import { DataService } from '../../services/data/data.service';
import { StorageService } from '../../services/storage/storage.service';
import { ReactiveFormsModule } from '@angular/forms';
import { SeoService } from '../../services/seo/seo.service';

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
      title: 'Gastos Federais com Segurança Pública: Análise Completa 2025',
      description: 'Veja a análise detalhada dos gastos do Brasil com segurança pública em 2025. Entenda o investimento de R$ 45,2 bilhões em programas de segurança e prevenção.',
      ogDescription: 'Análise detalhada dos R$ 45,2 bilhões investidos em segurança pública federal em 2025. Programas e impactos na redução da criminalidade.',
      ogUrl: 'https://brasiltransparente.digital/gastos-seguranca',
      ogType: 'article',
      twitterDescription: 'Análise detalhada dos R$ 45,2 bilhões investidos em segurança pública federal em 2025.',
      canonicalUrl: 'https://brasiltransparente.digital/gastos-seguranca'
    });
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
