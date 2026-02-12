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
      ogDescription: 'Conheça o Brasil Transparente, plataforma dedicada à transparência dos gastos públicos federais e acesso democrático aos dados do orçamento.',
      ogUrl: 'https://brasiltransparente.digital/sobre',
      twitterDescription: 'Conheça o Brasil Transparente, plataforma dedicada à transparência dos gastos públicos federais.',
      canonicalUrl: 'https://brasiltransparente.digital/sobre'
    });
  }
}
