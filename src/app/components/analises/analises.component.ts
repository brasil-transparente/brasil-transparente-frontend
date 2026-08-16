import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VoltarInicioComponent } from '../voltar-inicio/voltar-inicio.component';

export interface AnalysisItem {
  id: string;
  title: string;
  category: string;
  icon: string;
  description: string;
  route: string;
  tagColor?: string;
}

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
export class AnalisesComponent {
  analyses: AnalysisItem[] = [
    {
      id: 'aposentadorias-pensoes',
      title: 'Aposentadorias e Pensões',
      category: 'Previdência Social',
      icon: 'fa-user-clock',
      description: 'Análise dos gastos da União com aposentadorias e pensões, detalhando RGPS, BPC, militares e servidores públicos civis.',
      route: '/aposentadorias-pensoes'
    },
    {
      id: 'custo-juros-divida',
      title: 'Juros da Dívida Pública',
      category: 'Finanças Públicas',
      icon: 'fa-chart-line',
      description: 'Análise do impacto dos encargos financeiros, volume dos juros e relação com a dívida consolidada da União.',
      route: '/custo-juros-divida'
    },
    {
      id: 'gastos-defesa-aposentadoria',
      title: 'Aposentadorias Militares',
      category: 'Defesa Nacional',
      icon: 'fa-shield-alt',
      description: 'Análise do volume e proporção dos gastos do Ministério da Defesa entre efetivo militar ativo e inativos/pensionistas.',
      route: '/gastos-defesa-aposentadoria'
    },
    {
      id: 'gastos-bolsa-familia',
      title: 'Bolsa Família & Transferência de Renda',
      category: 'Assistência Social',
      icon: 'fa-hands-helping',
      description: 'Análise dos dispêndios federais com o programa Bolsa Família, evolução do benefício e impacto orçamentário.',
      route: '/gastos-bolsa-familia'
    },
    {
      id: 'gastos-seguranca',
      title: 'Segurança Pública',
      category: 'Segurança & Justiça',
      icon: 'fa-shield-halved',
      description: 'Análise dos gastos e investimentos federais em policiamento, infraestrutura penitenciária e segurança pública.',
      route: '/gastos-seguranca'
    },
    {
      id: 'gastos-educacao',
      title: 'Educação & Ensino Superior',
      category: 'Educação',
      icon: 'fa-graduation-cap',
      description: 'Análise detalhada dos investimentos do Ministério da Educação, universidades federais e programas prioritários.',
      route: '/gastos-educacao'
    }
  ];
}
