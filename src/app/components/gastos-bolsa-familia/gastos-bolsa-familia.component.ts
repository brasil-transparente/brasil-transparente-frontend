import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoltarAnalisesComponent } from '../voltar-analises/voltar-analises.component';
import { ApiService } from '../../services/api/api.service';
import { DataService } from '../../services/data/data.service';
import { StorageService } from '../../services/storage/storage.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-gastos-bolsa-familia',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    VoltarAnalisesComponent
  ],
  templateUrl: './gastos-bolsa-familia.component.html',
  styleUrl: './gastos-bolsa-familia.component.scss',
  standalone: true
})
export class GastosBolsaFamiliaComponent implements OnInit {
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
    this.titleService.setTitle('Gasto com Bolsa Família: Análise Completa 2025 | Brasil Transparente');

    this.metaService.updateTag({ name: 'description', content: 'Veja a análise detalhada dos gastos do Brasil com o programa Bolsa Família em 2025. Entenda o impacto de R$ 162 bilhões e os benefícios para a população em vulnerabilidade socioeconômica.' });

    this.metaService.updateTag({ property: 'og:title', content: 'Gasto com Bolsa Família: Análise Completa 2025' });
    this.metaService.updateTag({ property: 'og:description', content: 'Análise detalhada dos R$ 162 bilhões gastos com o Bolsa Família em 2025. Impacto social e orçamentário do programa.' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://brasiltransparente.digital/images/logo-white-bg.png' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://brasiltransparente.digital/gastos-bolsa-familia' });
    this.metaService.updateTag({ property: 'og:type', content: 'article' });

    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Gasto com Bolsa Família: Análise Completa 2025' });
    this.metaService.updateTag({ name: 'twitter:description', content: 'Análise detalhada dos R$ 162 bilhões gastos com o Bolsa Família em 2025.' });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://brasiltransparente.digital/images/logo-white-bg.png' });

    const canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonicalLink) {
      canonicalLink.href = 'https://brasiltransparente.digital/gastos-bolsa-familia';
    } else {
      const link: HTMLLinkElement = document.createElement('link');
      link.rel = 'canonical';
      link.href = 'https://brasiltransparente.digital/gastos-bolsa-familia';
      document.head.appendChild(link);
    }
  }

  loadData(): void {
    this.isLoading.set(true);
    // Simular dados para demonstração
    this.dados = [
      {
        componente: 'Benefícios Financeiros Diretos',
        valor: 8230000000000,
        percentual: 2.81
      },
      {
        componente: 'Custos Operacionais',
        valor: 270000000000,
        percentual: 0.09
      },
      {
        componente: 'Despesa Total do Programa',
        valor: 8500000000000,
        percentual: 2.90
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
