import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  signal
} from '@angular/core';
import { ApiService } from '../../services/api/api.service';
import { DataService } from '../../services/data/data.service';
import { StorageService } from '../../services/storage/storage.service';
import { CommonModule } from '@angular/common';
import { ToggleBarItemComponent } from '../toggle-bar-item/toggle-bar-item.component';
import { ReportType } from '../../models/tipos-relatorios.model';
import { Subject, takeUntil } from 'rxjs';
import { DespesaSimplificada } from '../../models/despesa-simplificada.model';
import { CarregandoDados } from 'app/carregando-dados/carregando-dados';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterLink, ToggleBarItemComponent, CarregandoDados]
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly apiService: ApiService = inject(ApiService);
  private readonly dataService: DataService = inject(DataService);
  private readonly storageService: StorageService = inject(StorageService);
  private destroy$ = new Subject<void>();

  federalEntityId = '1';
  totalValue = 0;
  isLoading = signal(true);
  simplifiedData: DespesaSimplificada[] = [];
  showRawTotal = signal(false);
  reportType = ReportType;
  ReportType = ReportType;

  ngOnInit(): void {
    this.storageService.federalEntityId$
      .pipe(takeUntil(this.destroy$))
      .subscribe(id => {
        this.federalEntityId = id;
        this.loadData();
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
        this.loadSimplifiedReport();
      });
  }

  loadSimplifiedReport(): void {
    this.isLoading.set(true);

    this.apiService
      .getDespesaSimplificada(this.federalEntityId)
      .subscribe(data => {
        this.simplifiedData = data;
        this.isLoading.set(false);
      });
  }

  getBarColor(level: number): string {
    return 'var(--amarelo-ouro)';
  }

  formatLargeCurrency(value: number): string {
    return this.dataService.formatLargeCurrency(value);
  }

  formatCurrency(value: number): string {
    return this.dataService.formatCurrency(value);
  }
}
