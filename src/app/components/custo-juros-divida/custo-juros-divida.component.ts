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
    this.titleService.setTitle('Custo com Juros da Dívida Pública Federal: Análise Completa 2025 | Brasil Transparente');
    
    this.metaService.addTag({ 
      name: 'description', 
      content: 'Entenda o custo dos juros da dívida pública federal em 2025, seu impacto no orçamento da União e como essa despesa afeta prioridades como saúde, educação e investimentos.' 
    });
    
    this.metaService.addTag({ 
      name: 'keywords', 
      content: 'juros da dívida 2025, dívida pública federal, custo da dívida, orçamento federal 2025, serviço da dívida, juros e encargos, finanças públicas, política fiscal, dívida interna, dívida externa' 
    });
    
    // Open Graph - Social Media
    this.metaService.addTag({ 
      property: 'og:title', 
      content: 'Custo com Juros da Dívida Pública Federal: Análise Completa 2025' 
    });
    
    this.metaService.addTag({ 
      property: 'og:description', 
      content: 'Análise do custo com juros da dívida pública federal em 2025 e seu impacto no orçamento da União.' 
    });
    
    this.metaService.addTag({ 
      property: 'og:type', 
      content: 'article' 
    });
    
    this.metaService.addTag({ 
      property: 'og:url', 
      content: 'https://brasiltransparente.digital/custo-juros-divida' 
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
      content: 'Custo com Juros da Dívida Pública Federal: Análise Completa 2025' 
    });
    
    this.metaService.addTag({ 
      name: 'twitter:description', 
      content: 'Análise detalhada do custo com juros da dívida pública federal em 2025 e seu impacto no orçamento.' 
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
      content: 'Dívida Pública Federal, Finanças Públicas, Orçamento Federal 2025, Política Fiscal' 
    });
    
    this.metaService.updateTag({ 
      name: 'category', 
      content: 'Economia, Finanças, Orçamento Federal' 
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
