import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoltarAnalisesComponent } from '../voltar-analises/voltar-analises.component';
import { DataService } from '../../services/data/data.service';
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
    this.titleService.setTitle('Gastos da União com Educação - Análise das Despesas 2025 | Brasil Transparente');
    
    this.metaService.updateTag({ 
      name: 'description', 
      content: 'Veja a análise detalhada dos gastos do Brasil com educação em 2025. Entenda os R$ 234,73 bilhões distribuídos em 6 blocos institucionais: FNDE, Universidades, Institutos Federais e mais.' 
    });
    
    this.metaService.updateTag({ 
      name: 'keywords', 
      content: 'gastos educação 2025, orçamento educação federal, despesas MEC 2025, FNDE, universidades federais, institutos federais, CAPES, hospitais universitários, blocos institucionais educação' 
    });
    
    // Open Graph - Social Media
    this.metaService.updateTag({ 
      property: 'og:title', 
      content: 'Gastos da União com Educação - Análise das Despesas 2025' 
    });
    
    this.metaService.updateTag({ 
      property: 'og:description', 
      content: 'Análise detalhada dos R$ 234,73 bilhões gastos com educação federal em 2025. Distribuição por 6 blocos institucionais: FNDE, Universidades, Institutos e mais.' 
    });
    
    this.metaService.updateTag({ 
      property: 'og:type', 
      content: 'article' 
    });
    
    this.metaService.updateTag({ 
      property: 'og:url', 
      content: 'https://brasiltransparente.digital/gastos-educacao' 
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
      content: 'Gastos da União com Educação - Análise das Despesas 2025' 
    });
    
    this.metaService.updateTag({ 
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
    
    // Canonical URL
    this.metaService.updateTag({ 
      property: 'canonical', 
      content: 'https://brasiltransparente.digital/gastos-educacao' 
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
