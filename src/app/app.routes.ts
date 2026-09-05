import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'gastos-detalhados',
    loadComponent: () =>
      import('./components/gastos-detalhados/gastos-detalhados.component').then(
        m => m.GastosDetalhadosComponent
      )
  },
  {
    path: 'calculadora',
    loadComponent: () =>
      import(
        './components/calculadora-contribuicao/calculadora-contribuicao.component'
      ).then(m => m.CalculadoraContribuicaoComponent)
  },
  {
    path: 'sobre',
    loadComponent: () =>
      import('./components/sobre/sobre.component').then(m => m.SobreComponent)
  },
  {
    path: 'metodologia',
    loadComponent: () =>
      import('./components/metodologia/metodologia.component').then(
        m => m.MetodologiaComponent
      )
  },
  {
    path: 'origem',
    loadComponent: () =>
      import('./components/origem/origem.component').then(
        m => m.OrigemComponent
      )
  },
  {
    path: 'analises',
    loadComponent: () =>
      import('./components/analises/analises.component').then(
        m => m.AnalisesComponent
      ),
    children: [
      {
        path: 'aposentadorias-pensoes',
        loadComponent: () =>
          import('./components/aposentadorias-pensoes/aposentadorias-pensoes.component').then(
            m => m.AposentadoriasPensoesComponent
          )
      },
      {
        path: 'custo-juros-divida',
        loadComponent: () =>
          import('./components/custo-juros-divida/custo-juros-divida.component').then(
            m => m.CustoJurosDividaComponent
          )
      },
      {
        path: 'gastos-defesa-aposentadoria',
        loadComponent: () =>
          import('./components/gastos-defesa-aposentadoria/gastos-defesa-aposentadoria.component').then(
            m => m.GastosDefesaAposentadoriaComponent
          )
      },
      {
        path: 'gastos-bolsa-familia',
        loadComponent: () =>
          import('./components/gastos-bolsa-familia/gastos-bolsa-familia.component').then(
            m => m.GastosBolsaFamiliaComponent
          )
      },
      {
        path: 'gastos-seguranca',
        loadComponent: () =>
          import('./components/gastos-seguranca/gastos-seguranca.component').then(
            m => m.GastosSegurancaComponent
          )
      },
      {
        path: 'gastos-educacao',
        loadComponent: () =>
          import('./components/gastos-educacao/gastos-educacao.component').then(
            m => m.GastosEducacaoComponent
          )
      }
    ]
  },
  // Rotas standalone das análises
  {
    path: 'aposentadorias-pensoes',
    loadComponent: () =>
      import('./components/aposentadorias-pensoes/aposentadorias-pensoes.component').then(
        m => m.AposentadoriasPensoesComponent
      )
  },
  {
    path: 'custo-juros-divida',
    loadComponent: () =>
      import('./components/custo-juros-divida/custo-juros-divida.component').then(
        m => m.CustoJurosDividaComponent
      )
  },
  {
    path: 'gastos-defesa-aposentadoria',
    loadComponent: () =>
      import('./components/gastos-defesa-aposentadoria/gastos-defesa-aposentadoria.component').then(
        m => m.GastosDefesaAposentadoriaComponent
      )
  },
  {
    path: 'gastos-bolsa-familia',
    loadComponent: () =>
      import('./components/gastos-bolsa-familia/gastos-bolsa-familia.component').then(
        m => m.GastosBolsaFamiliaComponent
      )
  },
  {
    path: 'gastos-seguranca',
    loadComponent: () =>
      import('./components/gastos-seguranca/gastos-seguranca.component').then(
        m => m.GastosSegurancaComponent
      )
  },
  {
    path: 'gastos-educacao',
    loadComponent: () =>
      import('./components/gastos-educacao/gastos-educacao.component').then(
        m => m.GastosEducacaoComponent
      )
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}

