import { Component, OnInit, inject } from '@angular/core';
import { VoltarInicioComponent } from '../voltar-inicio/voltar-inicio.component';
import { SeoService } from '../../services/seo/seo.service';

@Component({
  selector: 'app-sobre',
  imports: [VoltarInicioComponent],
  templateUrl: './sobre.component.html',
  styleUrl: './sobre.component.scss',
  standalone: true
})
export class SobreComponent implements OnInit {
  private readonly seoService: SeoService = inject(SeoService);

  ngOnInit(): void {
    this.setupSEO();
  }

  setupSEO(): void {
    this.seoService.setSeo({
      title: 'Sobre o Brasil Transparente: Missão e Valores',
      description: 'Conheça o Brasil Transparente, plataforma dedicada à transparência dos gastos públicos federais. Nossa missão é tornar os dados do orçamento da União acessíveis a todos os cidadãos.',
      ogTitle: 'Brasil Transparente - Sobre',
      ogDescription: 'Conheça o Brasil Transparente, plataforma dedicada à transparência dos gastos públicos federais e acesso democrático aos dados do orçamento.',
      ogImage: 'https://brasiltransparente.digital/images/logo-complete-white.png',
      ogUrl: 'https://brasiltransparente.digital/sobre',
      twitterTitle: 'Brasil Transparente - Sobre',
      twitterDescription: 'Conheça o Brasil Transparente, plataforma dedicada à transparência dos gastos públicos federais.',
      twitterImage: 'https://brasiltransparente.digital/images/logo-complete-white.png',
      canonicalUrl: 'https://brasiltransparente.digital/sobre'
    });
  }
}
