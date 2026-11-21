import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoltarAnalisesComponent } from '../voltar-analises/voltar-analises.component';
import { DataService } from '../../services/data/data.service';
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
  private readonly dataService: DataService = inject(DataService);
  private readonly titleService: Title = inject(Title);
  private readonly metaService: Meta = inject(Meta);

  isLoading = signal(true);
  dados: any[] = [];
  showRawTotal = signal(false);

  ngOnInit(): void {
    this.setupSEO();
    this.loadData();
  }

  setupSEO(): void {
    // Configuração de SEO para a página
    this.titleService.setTitle('Gasto com Bolsa Família - Análise das Despesas 2025 | Brasil Transparente');
    
    this.metaService.updateTag({ 
      name: 'description', 
      content: 'Veja a análise detalhada dos gastos do Brasil com o programa Bolsa Família em 2025. Entenda o impacto de R$ 162 bilhões e os benefícios para a população em vulnerabilidade socioeconômica.' 
    });
    
    this.metaService.updateTag({ 
      name: 'keywords', 
      content: 'gasto bolsa família 2025, programa bolsa família orçamento, transferência de renda Brasil, gastos sociais federais, auxílio Brasil 2025, programas sociais governo, políticas sociais, combate pobreza' 
    });
    
    // Open Graph - Social Media
    this.metaService.updateTag({ 
      property: 'og:title', 
      content: 'Gasto com Bolsa Família - Análise das Despesas 2025' 
    });
    
    this.metaService.updateTag({ 
      property: 'og:description', 
      content: 'Análise detalhada dos R$ 162 bilhões gastos com o Bolsa Família em 2025. Impacto social e orçamentário do programa.' 
    });
    
    this.metaService.updateTag({ 
      property: 'og:type', 
      content: 'article' 
    });
    
    this.metaService.updateTag({ 
      property: 'og:url', 
      content: 'https://brasiltransparente.digital/gastos-bolsa-familia' 
    });
    
    this.metaService.updateTag({ 
      property: 'og:site_name', 
      content: 'Brasil Transparente' 
    });
    
    this.metaService.updateTag({ 
      property: 'og:locale', 
      content: 'pt_BR' 
    });
    
    // Twitter Card
    this.metaService.updateTag({ 
      name: 'twitter:card', 
      content: 'summary_large_image' 
    });
    
    this.metaService.updateTag({ 
      name: 'twitter:title', 
      content: 'Gasto com Bolsa Família - Análise das Despesas 2025' 
    });
    
    this.metaService.updateTag({ 
      name: 'twitter:description', 
      content: 'Análise detalhada dos R$ 162 bilhões gastos com o Bolsa Família em 2025.' 
    });
    
    // Robots e Indexação
    this.metaService.updateTag({ 
      name: 'robots', 
      content: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' 
    });
    
    // Autor e Publicação
    this.metaService.updateTag({ 
      name: 'author', 
      content: 'Brasil Transparente' 
    });
    
    this.metaService.updateTag({ 
      name: 'publisher', 
      content: 'Brasil Transparente' 
    });
    
    this.metaService.updateTag({ 
      name: 'article:published_time', 
      content: '2026-02-10T10:00:00-03:00' 
    });
    
    this.metaService.updateTag({ 
      property: 'article:published_time', 
      content: '2026-02-10T10:00:00-03:00' 
    });
    
    // Informações Adicionais
    this.metaService.updateTag({ 
      name: 'language', 
      content: 'pt-BR' 
    });
    
    this.metaService.updateTag({ 
      name: 'geo.country', 
      content: 'BR' 
    });
    
    this.metaService.updateTag({ 
      name: 'coverage', 
      content: 'Worldwide' 
    });
    
    this.metaService.updateTag({ 
      name: 'distribution', 
      content: 'Global' 
    });
    
    this.metaService.updateTag({ 
      name: 'rating', 
      content: 'General' 
    });
    
    // Tema e Categoria
    this.metaService.updateTag({ 
      name: 'topic', 
      content: 'Programa Bolsa Família, Transferência de Renda, Políticas Sociais 2025, Combate à Pobreza' 
    });
    
    this.metaService.updateTag({ 
      name: 'category', 
      content: 'Políticas Sociais, Assistência Social, Desenvolvimento Social' 
    });
    
    // Data de Publicação (atual)
    const currentDate = new Date().toISOString().split('T')[0];
    this.metaService.updateTag({ 
      name: 'article:published_time', 
      content: currentDate 
    });
    
    this.metaService.updateTag({ 
      name: 'article:modified_time', 
      content: currentDate 
    });
    
    // Canonical URL
    this.metaService.updateTag({ 
      property: 'canonical', 
      content: 'https://brasiltransparente.digital/gastos-bolsa-familia' 
    });
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
