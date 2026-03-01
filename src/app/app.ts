import { Component, inject, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { HeaderComponent } from "./core/header/header.component";
import { FooterComponent } from "./core/footer/footer.component";
import { PageSkeletonComponent } from "./core/page-skeleton/page-skeleton.component";
import { SeoService } from './services/seo/seo.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, PageSkeletonComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true
})
export class App implements OnInit {
  protected readonly title = signal('brasil-transparente');
  isLoading = signal(true);

  private readonly router = inject(Router);
  private readonly seoService = inject(SeoService);

  constructor() {
    // Esconde skeleton após load inicial.
    setTimeout(() => {
      this.isLoading.set(false);
    }, 500);
  }

  ngOnInit(): void {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(event => {
      this.seoService.updateCanonical(event.urlAfterRedirects);
    });
  }
}
