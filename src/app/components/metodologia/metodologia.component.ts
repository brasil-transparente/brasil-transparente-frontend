import { Component, OnInit, inject } from '@angular/core';
import { VoltarInicioComponent } from '../voltar-inicio/voltar-inicio.component';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-metodologia',
  imports: [VoltarInicioComponent],
  templateUrl: './metodologia.component.html',
  styleUrl: './metodologia.component.scss',
  standalone: true
})
export class MetodologiaComponent implements OnInit {
  private readonly titleService: Title = inject(Title);
  private readonly metaService: Meta = inject(Meta);

  ngOnInit(): void {
    this.setupSEO();
  }

  setupSEO(): void {
    this.titleService.setTitle('Metodologia de Análise: Como Processamos os Dados | Brasil Transparente');

    this.metaService.updateTag({ name: 'description', content: 'Entenda a metodologia utilizada pelo Brasil Transparente para processar e analisar dados do orçamento federal. Conheça nossas técnicas de normalização, classificação e visualização.' });

    this.metaService.updateTag({ property: 'og:title', content: 'Metodologia de Análise: Como Processamos os Dados' });
    this.metaService.updateTag({ property: 'og:description', content: 'Entenda a metodologia utilizada pelo Brasil Transparente para processar e analisar dados do orçamento federal com precisão e transparência.' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://brasiltransparente.digital/images/logo.webp' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://brasiltransparente.digital/metodologia' });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });

    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Metodologia de Análise: Como Processamos os Dados' });
    this.metaService.updateTag({ name: 'twitter:description', content: 'Entenda a metodologia utilizada pelo Brasil Transparente para processar e analisar dados do orçamento federal.' });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://brasiltransparente.digital/images/logo.webp' });

    const canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (canonicalLink) {
      canonicalLink.href = 'https://brasiltransparente.digital/metodologia';
    } else {
      const link: HTMLLinkElement = document.createElement('link');
      link.rel = 'canonical';
      link.href = 'https://brasiltransparente.digital/metodologia';
      document.head.appendChild(link);
    }
  }
}
