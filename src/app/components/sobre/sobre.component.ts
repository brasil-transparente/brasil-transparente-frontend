import { Component, OnInit, inject } from '@angular/core';
import { VoltarInicioComponent } from '../voltar-inicio/voltar-inicio.component';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-sobre',
  imports: [VoltarInicioComponent],
  templateUrl: './sobre.component.html',
  styleUrl: './sobre.component.scss',
  standalone: true
})
export class SobreComponent implements OnInit {
  private readonly titleService: Title = inject(Title);
  private readonly metaService: Meta = inject(Meta);

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
    this.titleService.setTitle('Sobre o Brasil Transparente: Missão e Valores | Brasil Transparente');
    
    this.metaService.addTag({ 
      name: 'description', 
      content: 'Conheça o Brasil Transparente, plataforma dedicada à transparência dos gastos públicos federais. Nossa missão é tornar os dados do orçamento da União acessíveis a todos os cidadãos.' 
    });
    
    this.metaService.addTag({ 
      name: 'keywords', 
      content: 'Brasil Transparente sobre, transparência pública, gastos públicos, orçamento federal, dados governamentais, cidadania fiscal, responsabilidade fiscal, portal transparência' 
    });
    
    // Open Graph - Social Media
    this.metaService.addTag({ 
      property: 'og:title', 
      content: 'Sobre o Brasil Transparente: Missão e Valores' 
    });
    
    this.metaService.addTag({ 
      property: 'og:description', 
      content: 'Conheça o Brasil Transparente, plataforma dedicada à transparência dos gastos públicos federais e acesso democrático aos dados do orçamento.' 
    });
    
    this.metaService.addTag({ 
      property: 'og:type', 
      content: 'website' 
    });
    
    this.metaService.addTag({ 
      property: 'og:url', 
      content: 'https://brasiltransparente.digital/sobre' 
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
      content: 'Sobre o Brasil Transparente: Missão e Valores' 
    });
    
    this.metaService.addTag({ 
      name: 'twitter:description', 
      content: 'Conheça o Brasil Transparente, plataforma dedicada à transparência dos gastos públicos federais.' 
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
      content: 'Transparência Pública, Gastos Governamentais, Cidadania Fiscal, Orçamento Federal' 
    });
    
    this.metaService.updateTag({ 
      name: 'category', 
      content: 'Governo, Transparência, Educação Fiscal, Cidadania' 
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
      canonicalLink.href = 'https://brasiltransparente.digital/sobre';
    } else {
      const link: HTMLLinkElement = document.createElement('link');
      link.rel = 'canonical';
      link.href = 'https://brasiltransparente.digital/sobre';
      document.head.appendChild(link);
    }
  }
}
