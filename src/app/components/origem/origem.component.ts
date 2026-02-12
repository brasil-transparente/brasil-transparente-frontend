import { Component, OnInit, inject } from '@angular/core';
import { VoltarInicioComponent } from '../voltar-inicio/voltar-inicio.component';
import { environmentData } from '../../../environments/environment.data';
import { SeoService } from '../../services/seo/seo.service';

@Component({
  selector: 'app-origem',
  imports: [VoltarInicioComponent],
  templateUrl: './origem.component.html',
  styleUrl: './origem.component.scss',
  standalone: true
})
export class OrigemComponent implements OnInit {
  private readonly seoService: SeoService = inject(SeoService);
  
  fontesDados = environmentData.fontesDadosOrigem;

  ngOnInit(): void {
    this.setupSEO();
  }

  setupSEO(): void {
    this.seoService.setSeo({
      title: 'Fontes de Dados Oficiais: Origem das Informações',
      description: 'Conheça as fontes oficiais dos dados do Brasil Transparente: SIAFI, SIGPLAN, Portal da Transparência, PLOA 2025 e outros sistemas governamentais oficiais.',
      ogDescription: 'Conheça as fontes oficiais dos dados do Brasil Transparente: SIAFI, SIGPLAN, Portal da Transparência e outros sistemas governamentais.',
      ogUrl: 'https://brasiltransparente.digital/origem',
      twitterDescription: 'Conheça as fontes oficiais dos dados do Brasil Transparente: SIAFI, SIGPLAN, Portal da Transparência.',
      canonicalUrl: 'https://brasiltransparente.digital/origem'
    });
  }
}
