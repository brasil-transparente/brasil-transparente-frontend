import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { DataService } from '../../services/data/data.service';
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
  private readonly dataService: DataService = inject(DataService);
  private readonly titleService: Title = inject(Title);
  private readonly metaService: Meta = inject(Meta);

  isLoading = signal(true);
  dados: any[] = [];

  ngOnInit(): void {
    this.setupSEO();
    this.loadData();
  }

  setupSEO(): void {
    // Configuração de SEO para a página
    this.titleService.setTitle('Custo com Juros da Dívida Pública Federal - Análise das Despesas 2025 | Brasil Transparente');
    
    this.metaService.updateTag({ 
      name: 'description', 
      content: 'Entenda o custo dos juros da dívida pública federal em 2025, seu impacto no orçamento da União e como essa despesa afeta prioridades como saúde, educação e investimentos.' 
    });
    
    this.metaService.updateTag({ 
      name: 'keywords', 
      content: 'juros da dívida 2025, dívida pública federal, custo da dívida, orçamento federal 2025, serviço da dívida, juros e encargos, finanças públicas, política fiscal, dívida interna, dívida externa' 
    });
    
    // Open Graph - Social Media
    this.metaService.updateTag({ 
      property: 'og:title', 
      content: 'Custo com Juros da Dívida Pública Federal - Análise das Despesas 2025' 
    });
    
    this.metaService.updateTag({ 
      property: 'og:description', 
      content: 'Análise do custo com juros da dívida pública federal em 2025 e seu impacto no orçamento da União.' 
    });
    
    this.metaService.updateTag({ 
      property: 'og:type', 
      content: 'article' 
    });
    
    this.metaService.updateTag({ 
      property: 'og:url', 
      content: 'https://brasiltransparente.digital/custo-juros-divida' 
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
      content: 'Custo com Juros da Dívida Pública Federal - Análise das Despesas 2025' 
    });
    
    this.metaService.updateTag({ 
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
    
    // Canonical URL
    this.metaService.updateTag({ 
      property: 'canonical', 
      content: 'https://brasiltransparente.digital/custo-juros-divida' 
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
