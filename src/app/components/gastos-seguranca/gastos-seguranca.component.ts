import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VoltarAnalisesComponent } from '../voltar-analises/voltar-analises.component';
import { DataService } from '../../services/data/data.service';
import { ReactiveFormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';

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
    this.titleService.setTitle('Gastos Federais com Segurança Pública - Análise das Despesas 2025 | Brasil Transparente');
    
    this.metaService.updateTag({ 
      name: 'description', 
      content: 'Veja a análise detalhada dos gastos do Brasil com segurança pública em 2025. Entenda o investimento de R$ 45,2 bilhões em programas de segurança e prevenção.' 
    });
    
    this.metaService.updateTag({ 
      name: 'keywords', 
      content: 'gastos segurança pública 2025, orçamento segurança federal, investimentos segurança Brasil, programas segurança governo, Fundo Nacional de Segurança, prevenção violência, segurança cidadã, polícias' 
    });
    
    // Open Graph - Social Media
    this.metaService.updateTag({ 
      property: 'og:title', 
      content: 'Gastos Federais com Segurança Pública - Análise das Despesas 2025' 
    });
    
    this.metaService.updateTag({ 
      property: 'og:description', 
      content: 'Análise detalhada dos R$ 45,2 bilhões investidos em segurança pública federal em 2025. Programas e impactos na redução da criminalidade.' 
    });
    
    this.metaService.updateTag({ 
      property: 'og:type', 
      content: 'article' 
    });
    
    this.metaService.updateTag({ 
      property: 'og:url', 
      content: 'https://brasiltransparente.digital/gastos-seguranca' 
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
      content: 'Gastos Federais com Segurança Pública - Análise das Despesas 2025' 
    });
    
    this.metaService.updateTag({ 
      name: 'twitter:description', 
      content: 'Análise detalhada dos R$ 45,2 bilhões investidos em segurança pública federal em 2025.' 
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
      content: 'Segurança Pública, Fundo Nacional de Segurança, Prevenção à Violência 2025, Polícias Federais' 
    });
    
    this.metaService.updateTag({ 
      name: 'category', 
      content: 'Segurança Pública, Justiça e Segurança, Prevenção Criminal' 
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
      content: 'https://brasiltransparente.digital/gastos-seguranca' 
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
