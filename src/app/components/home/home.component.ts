import { Component, inject, OnInit, signal } from '@angular/core';
import { ApiService } from '../../services/api/api.service';
import { DataService } from '../../services/data/data.service';
import { CommonModule } from '@angular/common';
import { ToggleBarItemComponent } from '../toggle-bar-item/toggle-bar-item.component';
import { ReportType } from '../../models/tipos-relatorios.model';
import { DespesaSimplificada } from '../../models/despesa-simplificada.model';
import { CarregandoDados } from 'app/carregando-dados/carregando-dados';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ToggleBarItemComponent,
    CarregandoDados
  ]
})
export class HomeComponent implements OnInit {
  private readonly apiService: ApiService = inject(ApiService);
  private readonly dataService: DataService = inject(DataService);
  totalValue = 0;
  isLoading = signal(true);
  simplifiedData: DespesaSimplificada[] = [];
  showRawTotal = signal(false);
  reportType = ReportType;
  ReportType = ReportType;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);
    this.apiService
      .getTotalValueSpent()
      .subscribe(total => {
        this.totalValue = total;
        this.loadSimplifiedReport();
      });
  }

  loadSimplifiedReport(): void {
    this.isLoading.set(true);

    this.apiService
      .getDespesaSimplificada()
      .subscribe(data => {
        this.simplifiedData = this.sortDespesaSimplificada(data);
        this.isLoading.set(false);
      });
  }

  /**
   * Sort list from highest to lowest percentageOfTotal,
   * but force category with name "Outros" (case-insensitive) to be the last element.
   */
  sortDespesaSimplificada(data: DespesaSimplificada[]): DespesaSimplificada[] {
    if (!data) return [];
    const outrosItems = data.filter(
      item => item.name?.trim().toLowerCase() === 'outros'
    );
    const normalItems = data.filter(
      item => item.name?.trim().toLowerCase() !== 'outros'
    );

    normalItems.sort((a, b) => b.percentageOfTotal - a.percentageOfTotal);

    return [...normalItems, ...outrosItems];
  }

  getBarColor(): string {
    return 'var(--amarelo-ouro)';
  }

  formatLargeCurrency(value: number): string {
    return this.dataService.formatLargeCurrency(value);
  }

  formatCurrency(value: number): string {
    return this.dataService.formatCurrency(value);
  }
}
