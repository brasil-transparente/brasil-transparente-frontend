import { Component, OnInit, inject } from '@angular/core';
import { VoltarInicioComponent } from '../voltar-inicio/voltar-inicio.component';
import { SeoService } from '../../services/seo/seo.service';

@Component({
  selector: 'app-metodologia',
  imports: [VoltarInicioComponent],
  templateUrl: './metodologia.component.html',
  styleUrl: './metodologia.component.scss',
  standalone: true
})
export class MetodologiaComponent implements OnInit {
  private readonly seoService: SeoService = inject(SeoService);

  ngOnInit(): void {
    this.setupSEO();
  }

  setupSEO(): void {
    this.seoService.setSeo({
      title: 'Metodologia de Análise: Como Processamos os Dados',
      description: 'Entenda a metodologia utilizada pelo Brasil Transparente para processar e analisar dados do orçamento federal. Conheça nossas técnicas de normalização, classificação e visualização.',
      ogTitle: 'Metodologia de Análise',
      ogDescription: 'Entenda a metodologia utilizada pelo Brasil Transparente para processar e analisar dados do orçamento federal com precisão e transparência.',
      ogImage: 'https://brasiltransparente.digital/images/logo-complete-white.png',
      ogUrl: 'https://brasiltransparente.digital/metodologia',
      twitterTitle: 'Metodologia de Análise',
      twitterDescription: 'Entenda a metodologia utilizada pelo Brasil Transparente para processar e analisar dados do orçamento federal.',
      twitterImage: 'https://brasiltransparente.digital/images/logo-complete-white.png',
      canonicalUrl: 'https://brasiltransparente.digital/metodologia'
    });
  }
}
