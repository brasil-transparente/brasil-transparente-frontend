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
    this.titleService.setTitle('Gastos da União com Educação: Análise Completa 2025 | Brasil Transparente');
    
    this.metaService.addTag({ 
      name: 'description', 
      content: 'Veja a análise detalhada dos gastos do Brasil com educação em 2025. Entenda os R$ 234,73 bilhões distribuídos em 6 blocos institucionais: FNDE, Universidades, Institutos Federais e mais.' 
    });
    
    this.metaService.addTag({ 
      name: 'keywords', 
      content: 'gastos educação 2025, orçamento educação federal, despesas MEC 2025, FNDE, universidades federais, institutos federais, CAPES, hospitais universitários, blocos institucionais educação' 
    });
    
    // Open Graph - Social Media
    this.metaService.addTag({ 
      property: 'og:title', 
      content: 'Gastos da União com Educação: Análise Completa 2025' 
    });
    
    this.metaService.addTag({ 
      property: 'og:description', 
      content: 'Análise detalhada dos R$ 234,73 bilhões gastos com educação federal em 2025. Distribuição por 6 blocos institucionais: FNDE, Universidades, Institutos e mais.' 
    });
    
    this.metaService.addTag({ 
      property: 'og:type', 
      content: 'article' 
    });
    
    this.metaService.addTag({ 
      property: 'og:url', 
      content: 'https://brasiltransparente.digital/gastos-educacao' 
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
      content: 'https://brasiltransparente.digital/images/logo.webp' 
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
      content: 'Gastos da União com Educação: Análise Completa 2025' 
    });
    
    this.metaService.addTag({ 
      name: 'twitter:description', 
      content: 'Análise detalhada dos R$ 234,73 bilhões gastos com educação federal em 2025.' 
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
      content: 'Gastos com Educação, Orçamento MEC 2025, FNDE, Universidades Federais, Institutos Federais, CAPES, Hospitais Universitários' 
    });
    
    this.metaService.updateTag({ 
      name: 'category', 
      content: 'Educação, Ensino, Desenvolvimento Educacional, Políticas Educacionais, Finanças Públicas' 
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
