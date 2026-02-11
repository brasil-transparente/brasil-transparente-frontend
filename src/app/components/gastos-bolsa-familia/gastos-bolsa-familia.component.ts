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
    // Remove existing meta tags to ensure clean override
    this.metaService.removeTag('property="og:title"');
    this.metaService.removeTag('property="og:description"');
    this.metaService.removeTag('property="og:url"');
    this.metaService.removeTag('property="og:type"');
    this.metaService.removeTag('property="og:site_name"');
    this.metaService.removeTag('property="og:locale"');
    this.metaService.removeTag('property="og:image"');
    this.metaService.removeTag('property="og:image:width"');
    this.metaService.removeTag('property="og:image:height"');
    this.metaService.removeTag('property="og:image:alt"');
    this.metaService.removeTag('name="twitter:card"');
    this.metaService.removeTag('name="twitter:title"');
    this.metaService.removeTag('name="twitter:description"');
    
    // Configuração de SEO para a página
    this.titleService.setTitle('Gasto com Bolsa Família: Análise Completa 2025 | Brasil Transparente');
    
    this.metaService.addTag({ 
      name: 'description', 
      content: 'Veja a análise detalhada dos gastos do Brasil com o programa Bolsa Família em 2025. Entenda o impacto de R$ 162 bilhões e os benefícios para a população em vulnerabilidade socioeconômica.' 
    });
    
    this.metaService.addTag({ 
      name: 'keywords', 
      content: 'gasto bolsa família 2025, programa bolsa família orçamento, transferência de renda Brasil, gastos sociais federais, auxílio Brasil 2025, programas sociais governo, políticas sociais, combate pobreza' 
    });
    
    // Open Graph - Social Media
    this.metaService.addTag({ 
      property: 'og:title', 
      content: 'Gasto com Bolsa Família: Análise Completa 2025' 
    });
    
    this.metaService.addTag({ 
      property: 'og:description', 
      content: 'Análise detalhada dos R$ 162 bilhões gastos com o Bolsa Família em 2025. Impacto social e orçamentário do programa.' 
    });
    
    this.metaService.addTag({ 
      property: 'og:type', 
      content: 'article' 
    });
    
    this.metaService.addTag({ 
      property: 'og:url', 
      content: 'https://brasiltransparente.digital/gastos-bolsa-familia' 
    });
    
    this.metaService.addTag({ 
      property: 'og:site_name', 
      content: 'Brasil Transparente' 
    });
    
    this.metaService.addTag({ 
      property: 'og:locale', 
      content: 'pt_BR' 
    });
    
    this.metaService.addTag({ 
      property: 'og:image', 
      content: 'https://brasiltransparente.digital/images/logo-white-bg.png' 
    });
    
    this.metaService.addTag({ 
      property: 'og:image:width', 
      content: '1200' 
    });
    
    this.metaService.addTag({ 
      property: 'og:image:height', 
      content: '630' 
    });
    
    this.metaService.addTag({ 
      property: 'og:image:alt', 
      content: 'Brasil Transparente - Logo' 
    });
    
    // Twitter Card
    this.metaService.addTag({ 
      name: 'twitter:card', 
      content: 'summary_large_image' 
    });
    
    this.metaService.addTag({ 
      name: 'twitter:title', 
      content: 'Gasto com Bolsa Família: Análise Completa 2025' 
    });
    
    this.metaService.addTag({ 
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
    
    // Canonical URL - manipula o link tag diretamente
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
