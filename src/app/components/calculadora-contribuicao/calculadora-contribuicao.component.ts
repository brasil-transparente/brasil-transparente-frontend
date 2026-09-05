import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiService } from '../../services/api/api.service';
import { DataService } from '../../services/data/data.service';
import { StorageService } from '../../services/storage/storage.service';
import { DespesaSimplificada } from '../../models/despesa-simplificada.model';
import { ToggleBarItemComponent } from '../toggle-bar-item/toggle-bar-item.component';
import { CarregandoDados } from 'app/carregando-dados/carregando-dados';
import { ReportType } from '../../models/tipos-relatorios.model';

export type ProfessionalProfile = 'clt' | 'pj_simples' | 'pj_presumido' | 'autonomo';

export interface CalculationResult {
  totalImpostoFederalAnual: number;
  mode: 'estimativa' | 'exato';
  details?: {
    rendaMensal: number;
    rendaAnualBruta: number;
    percentualGastos: number;
    inssAnual: number;
    irpfAnual: number;
    impostoPJ: number;
    tributosDiretos: number;
    tributoConsumo: number;
  };
}

@Component({
  selector: 'app-calculadora-contribuicao',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    ToggleBarItemComponent,
    CarregandoDados
  ],
  templateUrl: './calculadora-contribuicao.component.html',
  styleUrls: ['./calculadora-contribuicao.component.scss']
})
export class CalculadoraContribuicaoComponent implements OnInit, OnDestroy {
  private readonly apiService: ApiService = inject(ApiService);
  private readonly dataService: DataService = inject(DataService);
  private readonly storageService: StorageService = inject(StorageService);
  private destroy$ = new Subject<void>();

  // Limites e Parâmetros Vigentes em 2025
  private readonly MAX_VALOR_ENTRADA = 100000000; // Teto de segurança (R$ 100 MILHÕES)
  private readonly SALARIO_MINIMO_2025 = 1412.0;
  private readonly TETO_INSS_2025 = 7786.02;

  federalEntityId = '1';
  reportType = ReportType;

  activeTab: 'estimativa' | 'exato' = 'estimativa';

  // Estimativa Rápida state
  selectedProfile: ProfessionalProfile = 'clt';
  rendaMensalInput = 'R$ 5.000,00';
  rendaMensalNumerica = 5000;
  percentualGastos = 80;

  // Valor Exato state
  valorExatoInput = '';
  valorExatoNumerico = 0;

  profiles: { id: ProfessionalProfile; label: string }[] = [
    { id: 'clt', label: 'CLT / Servidor Público / Pensionista' },
    { id: 'pj_simples', label: 'PJ (Simples Nacional)' },
    { id: 'pj_presumido', label: 'PJ (Lucro Presumido)' },
    { id: 'autonomo', label: 'Autônomo / Carnê-Leão' }
  ];

  hasCalculated = signal(false);
  isReportLoading = signal(false);
  calculationResult = signal<CalculationResult | null>(null);
  simplifiedData: DespesaSimplificada[] = [];

  ngOnInit(): void {
    this.storageService.federalEntityId$
      .pipe(takeUntil(this.destroy$))
      .subscribe(id => {
        this.federalEntityId = id;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setTab(tab: 'estimativa' | 'exato'): void {
    this.activeTab = tab;
  }

  onlyNumbersKey(event: KeyboardEvent): void {
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
      'ArrowLeft', 'ArrowRight', 'Home', 'End'
    ];

    if (allowedKeys.includes(event.key) || event.ctrlKey || event.metaKey) {
      return;
    }

    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  onPasteOnlyNumbers(event: ClipboardEvent, type: 'renda' | 'exato'): void {
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text') || '';
    const rawDigits = pastedText.replace(/\D/g, '');

    if (type === 'renda') {
      this.onRendaMensalChange(rawDigits);
    } else {
      this.onValorExatoChange(rawDigits);
    }
  }

  onRendaMensalChange(value: string): void {
    const parsed = this.parseAndSanitizeInput(value);
    this.rendaMensalNumerica = parsed;
    this.rendaMensalInput = parsed > 0 ? this.formatCurrencyInput(parsed) : '';
  }

  onValorExatoChange(value: string): void {
    const parsed = this.parseAndSanitizeInput(value);
    this.valorExatoNumerico = parsed;
    this.valorExatoInput = parsed > 0 ? this.formatCurrencyInput(parsed) : '';
  }

  private parseAndSanitizeInput(value: string): number {
    if (!value) return 0;
    const rawDigits = value.replace(/\D/g, '');
    if (!rawDigits) return 0;

    let numericValue = parseFloat(rawDigits) / 100;
    if (isNaN(numericValue) || numericValue < 0) {
      numericValue = 0;
    }

    return Math.min(numericValue, this.MAX_VALOR_ENTRADA);
  }

  formatCurrencyInput(val: number): string {
    if (!val && val !== 0) return '';
    return val.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  calculateTax(): void {
    let result: CalculationResult;

    if (this.activeTab === 'exato') {
      const valorSanitizado = Math.min(Math.max(0, this.valorExatoNumerico), this.MAX_VALOR_ENTRADA);
      result = {
        totalImpostoFederalAnual: valorSanitizado,
        mode: 'exato'
      };
    } else {
      const rendaMensal = Math.min(Math.max(0, this.rendaMensalNumerica), this.MAX_VALOR_ENTRADA);
      const percentualGastos = Math.min(Math.max(0, this.percentualGastos), 100);

      let inssAnual = 0;
      let irpfAnual = 0;
      let impostoPJ = 0;
      let tributoConsumo = 0;
      let totalImpostoFederalAnual = 0;
      let rendaAnualBruta = 0;

      switch (this.selectedProfile) {
        case 'clt': {
          rendaAnualBruta = rendaMensal * 13.33;

          const inssMensal = this.calculateINSSProgressivo2025(rendaMensal);
          inssAnual = inssMensal * 13.33;

          const baseIRPFAnual = Math.max(0, rendaAnualBruta - inssAnual);
          irpfAnual = this.calculateIRPFAnual2025(baseIRPFAnual);

          const rendaLiquidaAnual = Math.max(0, rendaAnualBruta - (inssAnual + irpfAnual));
          const consumoAnual = rendaLiquidaAnual * (percentualGastos / 100);
          tributoConsumo = consumoAnual * 0.12;

          totalImpostoFederalAnual = inssAnual + irpfAnual + tributoConsumo;
          break;
        }

        case 'pj_simples': {
          rendaAnualBruta = rendaMensal * 12;

          impostoPJ = rendaAnualBruta * 0.0402;
          inssAnual = (this.SALARIO_MINIMO_2025 * 0.11) * 12;

          const rendaDisponivel = Math.max(0, rendaAnualBruta - impostoPJ - inssAnual);
          const consumoAnual = rendaDisponivel * (percentualGastos / 100);
          tributoConsumo = consumoAnual * 0.12;

          totalImpostoFederalAnual = impostoPJ + inssAnual + tributoConsumo;
          break;
        }

        case 'pj_presumido': {
          rendaAnualBruta = rendaMensal * 12;

          const aliquotaPJ = 0.1133;
          if (rendaMensal > 20000) {
            const excedenteMensal = rendaMensal - 20000;
            const adicionalIRPJAnual = (excedenteMensal * 0.16) * 0.10 * 12;
            impostoPJ = (rendaAnualBruta * aliquotaPJ) + adicionalIRPJAnual;
          } else {
            impostoPJ = rendaAnualBruta * aliquotaPJ;
          }

          inssAnual = (this.SALARIO_MINIMO_2025 * 0.11) * 12;

          const rendaDisponivel = Math.max(0, rendaAnualBruta - impostoPJ - inssAnual);
          const consumoAnual = rendaDisponivel * (percentualGastos / 100);
          tributoConsumo = consumoAnual * 0.12;

          totalImpostoFederalAnual = impostoPJ + inssAnual + tributoConsumo;
          break;
        }

        case 'autonomo': {
          rendaAnualBruta = rendaMensal * 12;

          const inssMensal = Math.min(rendaMensal * 0.20, this.TETO_INSS_2025 * 0.20);
          inssAnual = inssMensal * 12;

          const baseIRPFAnual = Math.max(0, rendaAnualBruta - inssAnual);
          irpfAnual = this.calculateIRPFAnual2025(baseIRPFAnual);

          const rendaLiquidaAnual = Math.max(0, rendaAnualBruta - (inssAnual + irpfAnual));
          const consumoAnual = rendaLiquidaAnual * (percentualGastos / 100);
          tributoConsumo = consumoAnual * 0.12;

          totalImpostoFederalAnual = inssAnual + irpfAnual + tributoConsumo;
          break;
        }
      }

      result = {
        totalImpostoFederalAnual: Math.max(0, totalImpostoFederalAnual),
        mode: 'estimativa',
        details: {
          rendaMensal,
          rendaAnualBruta,
          percentualGastos,
          inssAnual,
          irpfAnual,
          impostoPJ,
          tributosDiretos: inssAnual + irpfAnual + impostoPJ,
          tributoConsumo
        }
      };
    }

    this.calculationResult.set(result);
    this.hasCalculated.set(true);
    this.loadUserReport();
  }

  loadUserReport(): void {
    this.isReportLoading.set(true);
    this.apiService
      .getDespesaSimplificada(this.federalEntityId)
      .subscribe({
        next: (data) => {
          this.simplifiedData = this.sortDespesaSimplificada(data);
          this.isReportLoading.set(false);
        },
        error: () => {
          this.simplifiedData = [];
          this.isReportLoading.set(false);
        }
      });
  }

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

  getUserContribution(item: DespesaSimplificada): number {
    const calc = this.calculationResult();
    if (!calc || !calc.totalImpostoFederalAnual || isNaN(calc.totalImpostoFederalAnual)) {
      return 0;
    }
    const percentual = item?.percentageOfTotal ?? 0;
    return (calc.totalImpostoFederalAnual * percentual) / 100;
  }

  getBarColor(): string {
    return 'var(--amarelo-ouro)';
  }

  formatCurrency(value: number): string {
    if (isNaN(value) || value === null || value === undefined) return 'R$ 0,00';
    return this.dataService.formatCurrency(value);
  }

  /**
   * Tabela Progressiva de INSS em Vigor em 2025
   */
  private calculateINSSProgressivo2025(salarioMensal: number): number {
    const valorTributavel = Math.min(Math.max(0, salarioMensal), this.TETO_INSS_2025);

    if (valorTributavel <= 1412.0) {
      return valorTributavel * 0.075;
    } else if (valorTributavel <= 2666.68) {
      return 1412.0 * 0.075 + (valorTributavel - 1412.0) * 0.09;
    } else if (valorTributavel <= 4000.03) {
      return (
        1412.0 * 0.075 +
        (2666.68 - 1412.0) * 0.09 +
        (valorTributavel - 2666.68) * 0.12
      );
    } else {
      return (
        1412.0 * 0.075 +
        (2666.68 - 1412.0) * 0.09 +
        (4000.03 - 2666.68) * 0.12 +
        (valorTributavel - 4000.03) * 0.14
      );
    }
  }

  /**
   * Tabela Anual Oficial do IRPF para 2025
   * (Considerando Isenção Anual de R$ 27.110,40 (~R$ 2.259,20/mês)
   * e o desconto simplificado opcional de R$ 564,80/mês).
   */
  private calculateIRPFAnual2025(baseCalculoAnual: number): number {
    // Rendimentos tributáveis até ~R$ 33.888,00 por ano (ou até R$ 2.824/mês com desconto simplificado) não pagam IRPF
    if (baseCalculoAnual <= 33888.0) {
      return 0;
    } else if (baseCalculoAnual <= 40000.0) {
      return Math.max(0, baseCalculoAnual * 0.075 - 2541.6);
    } else if (baseCalculoAnual <= 53000.0) {
      return Math.max(0, baseCalculoAnual * 0.15 - 5541.6);
    } else if (baseCalculoAnual <= 66000.0) {
      return Math.max(0, baseCalculoAnual * 0.225 - 9516.6);
    } else {
      return Math.max(0, baseCalculoAnual * 0.275 - 12816.6);
    }
  }
}