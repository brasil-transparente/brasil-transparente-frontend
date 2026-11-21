import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoltarAnalisesComponent } from '../voltar-analises/voltar-analises.component';
import { DataService } from '../../services/data/data.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';

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
    this.titleService.setTitle('Gastos no Ministério da Defesa - Aposentadorias Militares - Análise das Despesas 2025 | Brasil Transparente');
    
    this.metaService.updateTag({ 
      name: 'description', 
      content: 'Veja a análise detalhada dos gastos do Brasil com aposentadorias e pensões militares em 2025. Entenda o impacto de R$ 63,994 bilhões no orçamento federal e PIB.' 
    });
    
    this.metaService.updateTag({ 
      name: 'keywords', 
      content: 'gastos defesa aposentadorias 2025, aposentadorias militares, orçamento ministério da defesa 2025, gastos militares PIB, reforma previdência militar, pensões militares forças armadas, defesa nacional, orçamento militar' 
    });
    
    // Open Graph - Social Media
    this.metaService.updateTag({ 
      property: 'og:title', 
      content: 'Gastos no Ministério da Defesa - Aposentadorias Militares - Análise das Despesas 2025' 
    });
    
    this.metaService.updateTag({ 
      property: 'og:description', 
      content: 'Análise detalhada dos R$ 63,994 bilhões gastos com aposentadorias e pensões militares em 2025. Impacto de 2,18% no orçamento federal.' 
    });
    
    this.metaService.updateTag({ 
      property: 'og:type', 
      content: 'article' 
    });
    
    this.metaService.updateTag({ 
      property: 'og:url', 
      content: 'https://brasiltransparente.digital/gastos-defesa-aposentadoria' 
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
      content: 'Gastos no Ministério da Defesa - Aposentadorias Militares - Análise das Despesas 2025' 
    });
    
    this.metaService.updateTag({ 
      name: 'twitter:description', 
      content: 'Análise detalhada dos R$ 63,994 bilhões gastos com aposentadorias militares em 2025.' 
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
      content: '2026-02-11T10:00:00-03:00' 
    });
    
    this.metaService.updateTag({ 
      property: 'article:published_time', 
      content: '2026-02-11T10:00:00-03:00' 
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
      content: 'Aposentadorias Militares, Ministério da Defesa, Orçamento Militar 2025, Forças Armadas' 
    });
    
    this.metaService.updateTag({ 
      name: 'category', 
      content: 'Defesa Nacional, Forças Armadas, Previdência Militar' 
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
      content: 'https://brasiltransparente.digital/gastos-defesa-aposentadoria' 
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
