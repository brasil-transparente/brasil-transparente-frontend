import { Component, OnInit, inject } from '@angular/core';
import { SeoService } from '../../services/seo/seo.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent implements OnInit {
  private readonly seoService: SeoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.setSeo({
      title: 'Página Não Encontrada',
      description: 'A página que você procura não foi encontrada no Brasil Transparente.',
      ogUrl: 'https://brasiltransparente.digital/',
      canonicalUrl: 'https://brasiltransparente.digital/'
    });
  }
}
