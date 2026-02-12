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
    this.titleService.setTitle('Sobre o Brasil Transparente: Missão e Valores | Brasil Transparente');

    this.metaService.updateTag({ name: 'description', content: 'Conheça o Brasil Transparente, plataforma dedicada à transparência dos gastos públicos federais. Nossa missão é tornar os dados do orçamento da União acessíveis a todos os cidadãos.' });

    this.metaService.updateTag({ property: 'og:title', content: 'Sobre o Brasil Transparente: Missão e Valores' });
    this.metaService.updateTag({ property: 'og:description', content: 'Conheça o Brasil Transparente, plataforma dedicada à transparência dos gastos públicos federais e acesso democrático aos dados do orçamento.' });
    this.metaService.updateTag({ property: 'og:image', content: 'https://brasiltransparente.digital/images/logo.webp' });
    this.metaService.updateTag({ property: 'og:url', content: 'https://brasiltransparente.digital/sobre' });
    this.metaService.updateTag({ property: 'og:type', content: 'website' });

    this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.metaService.updateTag({ name: 'twitter:title', content: 'Sobre o Brasil Transparente: Missão e Valores' });
    this.metaService.updateTag({ name: 'twitter:description', content: 'Conheça o Brasil Transparente, plataforma dedicada à transparência dos gastos públicos federais.' });
    this.metaService.updateTag({ name: 'twitter:image', content: 'https://brasiltransparente.digital/images/logo.webp' });

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
