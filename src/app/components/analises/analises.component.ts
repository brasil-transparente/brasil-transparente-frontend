import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VoltarInicioComponent } from '../voltar-inicio/voltar-inicio.component';
import { SeoService } from '../../services/seo/seo.service';

@Component({
  selector: 'app-analises',
  imports: [
    CommonModule,
    RouterLink,
    VoltarInicioComponent
  ],
  templateUrl: './analises.component.html',
  styleUrl: './analises.component.scss',
  standalone: true
})
export class AnalisesComponent implements OnInit {
  private readonly seoService: SeoService = inject(SeoService);

  ngOnInit(): void {
    this.setupSEO();
  }

  setupSEO(): void {
    this.seoService.setSeo({
      title: 'Análises dos Gastos Públicos Federais 2025',
      description: 'Explore análises detalhadas dos gastos públicos federais do Brasil em 2025: aposentadorias, educação, segurança, Bolsa Família e mais.',
      ogUrl: 'https://brasiltransparente.digital/analises',
      canonicalUrl: 'https://brasiltransparente.digital/analises'
    });
  }

  analyses = [
    {
      id: 'aposentadorias-pensoes',
      title: 'Aposentadorias e Pensões',
      description: 'Análise dos gastos da União com aposentadorias e pensões, incluindo RGPS, BPC, militares e servidores civis públicos.',
      route: '/aposentadorias-pensoes'
    },
    {
      id: 'custo-juros-divida',
      title: 'Juros da Dívida Pública Federal',
      description: 'Análise do volume dos gastos com juros da dívida pública federal e sua relação com a dívida pública federal.',
      route: '/custo-juros-divida'
    },
    {
      id: 'gastos-defesa-aposentadoria',
      title: 'Aposentadorias Militares',
      description: 'Análise do volume e proporção de gastos do Ministério da Defesa em relação a militares ativos e inativos.',
      route: '/gastos-defesa-aposentadoria'
    },
    {
      id: 'gastos-bolsa-familia',
      title: 'Bolsa Família',
      description: 'Análise dos gastos com o programa Bolsa Família e seu impacto fiscal.',
      route: '/gastos-bolsa-familia'
    },
    {
      id: 'gastos-seguranca',
      title: 'Segurança',
      description: 'Análise dos gastos federais com seguranca.',
      route: '/gastos-seguranca'
    },
    {
      id: 'gastos-educacao',
      title: 'Educação',
      description: 'Análise dos investimentos federais em educação e seus programas prioritários.',
      route: '/gastos-educacao'
    }
  ];

  navigateToAnalysis(analysisId: string): void {
    // Navigation will be handled by Angular Router in the template
  }
}
