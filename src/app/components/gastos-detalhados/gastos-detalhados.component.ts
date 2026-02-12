import {
  Component,
  effect,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewEncapsulation
} from '@angular/core';
import { ApiService } from '../../services/api/api.service';
import { DataService } from '../../services/data/data.service';
import { StorageService } from '../../services/storage/storage.service';
import { CommonModule } from '@angular/common';
import { ToggleBarItemComponent } from '../toggle-bar-item/toggle-bar-item.component';
import { Subject, takeUntil } from 'rxjs';
import { Poder } from '../../models/poder.model';
import { CommomWithChildren } from '../../models/commom.model';
import { ReportType } from '../../models/tipos-relatorios.model';
import { CarregandoDados } from 'app/carregando-dados/carregando-dados';
import { SeoService } from '../../services/seo/seo.service';

@Component({
  selector: 'app-gastos-detalhados',
  templateUrl: './gastos-detalhados.component.html',
  styleUrls: ['./gastos-detalhados.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, ToggleBarItemComponent, CarregandoDados]
})
export class GastosDetalhadosComponent implements OnInit, OnDestroy {
  private readonly apiService: ApiService = inject(ApiService);
  private readonly dataService: DataService = inject(DataService);
  private readonly storageService: StorageService = inject(StorageService);
  private readonly seoService: SeoService = inject(SeoService);
  private destroy$ = new Subject<void>();

  federalEntityId = '1';
  totalValue = 0;
  isLoading = signal(true);
  poderes: CommomWithChildren[] = [];
  showRawTotal = signal(false);
  reportType = ReportType;
  ReportType = ReportType;

  ngOnInit(): void {
    this.setupSEO();
    this.storageService.federalEntityId$
      .pipe(takeUntil(this.destroy$))
      .subscribe(id => {
        this.federalEntityId = id;
        this.loadData();
      });
  }

  setupSEO(): void {
    this.seoService.setSeo({
      title: 'Gastos Detalhados do Orçamento Federal 2025',
      description: 'Explore todos os gastos detalhados do orçamento federal brasileiro em 2025, organizados por poderes, ministérios, órgãos e unidades gestoras.',
      ogUrl: 'https://brasiltransparente.digital/gastos-detalhados',
      canonicalUrl: 'https://brasiltransparente.digital/gastos-detalhados'
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData(): void {
    this.isLoading.set(true);
    this.apiService
      .getTotalValueSpent(this.federalEntityId)
      .subscribe(total => {
        this.totalValue = total;
        this.loadDetailedReport();
      });
  }

  loadDetailedReport(): void {
    this.isLoading.set(true);
    this.apiService.getPoderes(this.federalEntityId).subscribe(poderes => {
      this.poderes = poderes.map(poder => ({
        ...poder,
        expanded: false,
        children: null
      }));
      this.isLoading.set(false);
    });
  }

  getBarColor(level: number): string {
    const colors = [
      'var(--chart-1)',
      'var(--chart-2)',
      'var(--chart-3)',
      'var(--chart-4)',
      'var(--chart-5)'
    ];
    return colors[level] ?? 'var(--chart-1)';
  }

  formatLargeCurrency(value: number): string {
    return this.dataService.formatLargeCurrency(value);
  }

  formatCurrency(value: number): string {
    return this.dataService.formatCurrency(value);
  }

  onTogglePoder(item: CommomWithChildren): void {
    item.expanded = !item.expanded;
    if (item.expanded && !item.children) {
      let observable;

      switch (item.level) {
        case 0:
          observable = this.apiService.getMinisterios(item.id);
          break;
        case 1:
          observable = this.apiService.getOrgaos(item.id);
          break;
        case 2:
          observable = this.apiService.getUnidadesGestoras(item.id);
          break;
        case 3:
          observable = this.apiService.getElementoDespesa(item.id);
          break;
        default:
          observable = null;
      }

      if (observable) {
        observable.subscribe(children => {
          item.children = children.map(child => ({
            ...child,
            expanded: false,
            children: null
          }));
        });
      }
    }
  }
}
