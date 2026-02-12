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
    this.titleService.setTitle('Fontes de Dados Oficiais: Origem das Informações | Brasil Transparente');

    this.metaService.updateTag({ name: 'description', content: 'Conheça as fontes oficiais dos dados do Brasil Transparente: SIAFI, SIGPLAN, Portal da Transparência, PLOA 2025 e outros sistemas governamentais oficiais.' });

    this.metaService.updateTag({ property: 'og:title', content: 'Fontes de Dados Oficiais: Origem das Informações' });
    this.metaService.updateTag({ property: 'og:description', content: 'Conheça as fontes oficiais dos dados do Brasil Transparente: SIAFI, SIGPLAN, Portal da Transparência e outros sistemas governamentais.' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://brasiltransparente.digital/images/logo.webp' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://brasiltransparente.digital/origem' });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });

    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Fontes de Dados Oficiais: Origem das Informações' });
    this.metaService.updateTag({ name: 'twitter:description', content: 'Conheça as fontes oficiais dos dados do Brasil Transparente: SIAFI, SIGPLAN, Portal da Transparência.' });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://brasiltransparente.digital/images/logo.webp' });

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
