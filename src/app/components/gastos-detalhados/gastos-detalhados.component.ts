import {
  Component,
  inject,
  OnInit,
  signal,
  ViewEncapsulation
} from '@angular/core';
import { ApiService } from '../../services/api/api.service';
import { DataService } from '../../services/data/data.service';
import { CommonModule } from '@angular/common';
import { ToggleBarItemComponent } from '../toggle-bar-item/toggle-bar-item.component';
import { CommomWithChildren } from '../../models/commom.model';
import { ReportType } from '../../models/tipos-relatorios.model';
import { CarregandoDados } from 'app/carregando-dados/carregando-dados';

@Component({
  selector: 'app-gastos-detalhados',
  templateUrl: './gastos-detalhados.component.html',
  styleUrls: ['./gastos-detalhados.component.scss'],
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, ToggleBarItemComponent, CarregandoDados]
})
export class GastosDetalhadosComponent implements OnInit {
  private readonly apiService: ApiService = inject(ApiService);
  private readonly dataService: DataService = inject(DataService);
  totalValue = 0;
  isLoading = signal(true);
  poderes: CommomWithChildren[] = [];
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
        this.loadDetailedReport();
      });
  }

  loadDetailedReport(): void {
    this.isLoading.set(true);
    this.apiService.getPoderes().subscribe(poderes => {
      this.poderes = poderes.map(poder => ({
        ...poder,
        expanded: false,
        children: null
      }));
      this.isLoading.set(false);
    });
  }

  getBarColor(level: number): string {
    if (level === 4) {
      return '#94a3b8';
    }
    return 'var(--amarelo-ouro)';
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
