import { Component, OnInit, inject } from '@angular/core';
import { VoltarInicioComponent } from '../voltar-inicio/voltar-inicio.component';
import { environmentData } from '../../../environments/environment.data';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-origem',
  imports: [VoltarInicioComponent],
  templateUrl: './origem.component.html',
  styleUrl: './origem.component.scss',
  standalone: true
})
export class OrigemComponent implements OnInit {
  private readonly titleService: Title = inject(Title);
  private readonly metaService: Meta = inject(Meta);
  
  fontesDados = environmentData.fontesDadosOrigem;

  ngOnInit(): void {
    this.setupSEO();
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
    this.titleService.setTitle('Fontes de Dados Oficiais: Origem das Informações | Brasil Transparente');
    
    this.metaService.addTag({ 
      name: 'description', 
      content: 'Conheça as fontes oficiais dos dados do Brasil Transparente: SIAFI, SIGPLAN, Portal da Transparência, PLOA 2025 e outros sistemas governamentais oficiais.' 
    });
    
    this.metaService.addTag({ 
      name: 'keywords', 
      content: 'fontes dados Brasil Transparente, SIAFI, SIGPLAN, Portal Transparência, PLOA 2025, dados governamentais oficiais, sistemas governo federal, orçamento união fontes' 
    });
    
    // Open Graph - Social Media
    this.metaService.addTag({ 
      property: 'og:title', 
      content: 'Fontes de Dados Oficiais: Origem das Informações' 
    });
    
    this.metaService.addTag({ 
      property: 'og:description', 
      content: 'Conheça as fontes oficiais dos dados do Brasil Transparente: SIAFI, SIGPLAN, Portal da Transparência e outros sistemas governamentais.' 
    });
    
    this.metaService.addTag({ 
      property: 'og:type', 
      content: 'website' 
    });
    
    this.metaService.addTag({ 
      property: 'og:url', 
      content: 'https://brasiltransparente.digital/origem' 
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
      content: 'Fontes de Dados Oficiais: Origem das Informações' 
    });
    
    this.metaService.addTag({ 
      name: 'twitter:description', 
      content: 'Conheça as fontes oficiais dos dados do Brasil Transparente: SIAFI, SIGPLAN, Portal da Transparência.' 
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
      content: 'Fontes de Dados Governamentais, SIAFI, SIGPLAN, Portal da Transparência, Dados Oficiais' 
    });
    
    this.metaService.updateTag({ 
      name: 'category', 
      content: 'Dados Governamentais, Transparência, Fontes Oficiais, Sistemas Federais' 
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
      canonicalLink.href = 'https://brasiltransparente.digital/origem';
    } else {
      const link: HTMLLinkElement = document.createElement('link');
      link.rel = 'canonical';
      link.href = 'https://brasiltransparente.digital/origem';
      document.head.appendChild(link);
    }
  }
}
