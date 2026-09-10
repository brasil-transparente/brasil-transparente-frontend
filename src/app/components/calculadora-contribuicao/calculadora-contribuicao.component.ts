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

export type ProfessionalProfile = 'clt' | 'servidor_publico' | 'pensionista_inss' | 'pj_simples' | 'pj_presumido' | 'autonomo';

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

  // Parâmetros vigentes para o ano-calendário de 2025.
  private readonly MAX_VALOR_ENTRADA = 100000000; // Teto de segurança (R$ 100 milhões)
  private readonly SALARIO_MINIMO_2025 = 1518.00;
  private readonly TETO_INSS_2025 = 8157.41;

  /** Estimativa média de tributos federais indiretos sobre o consumo em 2025. */
  private readonly ALIQUOTA_TRIBUTOS_FEDERAIS_CONSUMO_2025 = 0.095;

  /** Hipótese simplificadora para os perfis PJ: pró-labore de 1 salário mínimo. */
  private readonly PROLABORE_MENSAL_PADRAO_2025 = this.SALARIO_MINIMO_2025;

  /** Limite de faturamento anual do Simples Nacional: R$ 4,8 milhões. */
  private readonly FATURAMENTO_MENSAL_MAXIMO_SIMPLES_2025 = 400000.00;

  /** Renda mínima aceitável por perfil (mensal, em R$). */
  private readonly RENDA_MINIMA_POR_PERFIL: Record<ProfessionalProfile, number> = {
    clt: this.SALARIO_MINIMO_2025,
    servidor_publico: this.SALARIO_MINIMO_2025,
    pensionista_inss: this.SALARIO_MINIMO_2025,
    pj_simples: this.SALARIO_MINIMO_2025,
    pj_presumido: this.SALARIO_MINIMO_2025,
    autonomo: this.SALARIO_MINIMO_2025
  };

  /** Valor mínimo aceitável na aba "Valor Exato" (em R$). */
  private readonly VALOR_EXATO_MINIMO = 1.0;

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
    { id: 'clt', label: 'CLT' },
    { id: 'servidor_publico', label: 'Servidor público concursado' },
    { id: 'pensionista_inss', label: 'Aposentado/Pensionista do INSS' },
    { id: 'pj_simples', label: 'PJ (Simples Nacional)' },
    { id: 'pj_presumido', label: 'PJ (Lucro Presumido)' },
    { id: 'autonomo', label: 'Autônomo / contribuinte individual' }
  ];

  hasCalculated = signal(false);
  isReportLoading = signal(false);
  calculationResult = signal<CalculationResult | null>(null);
  validationError = signal<string | null>(null);
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
    this.validationError.set(null);
  }

  onProfileChange(): void {
    this.validationError.set(null);
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

  private validateInput(): string | null {
    if (this.activeTab === 'exato') {
      if (!this.valorExatoNumerico || this.valorExatoNumerico < this.VALOR_EXATO_MINIMO) {
        return 'Informe um valor superior a R$ 1,00 para continuar.';
      }
      return null;
    }

    const renda = this.rendaMensalNumerica;
    const minimo = this.RENDA_MINIMA_POR_PERFIL[this.selectedProfile];

    if (!renda || renda <= 0) {
      return 'Informe uma renda mensal para realizar o cálculo.';
    }

    if (renda < minimo) {
      const minimoFormatado = this.formatCurrency(minimo);
      const labelPerfil = this.profiles.find(p => p.id === this.selectedProfile)?.label ?? 'este perfil';
      return `A renda informada é inválida para o perfil "${labelPerfil}". O valor mínimo é ${minimoFormatado} (salário mínimo de 2025).`;
    }

    if (this.selectedProfile === 'pj_simples' && renda > this.FATURAMENTO_MENSAL_MAXIMO_SIMPLES_2025) {
      return `Para esta estimativa de Simples Nacional, o faturamento mensal máximo considerado é ${this.formatCurrency(this.FATURAMENTO_MENSAL_MAXIMO_SIMPLES_2025)} (R$ 4,8 milhões em 12 meses).`;
    }

    return null;
  }

  calculateTax(): void {
    const erro = this.validateInput();
    if (erro) {
      this.validationError.set(erro);
      return;
    }

    this.validationError.set(null);

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
          // Hipótese: vínculo durante todo o ano, férias gozadas integralmente e 13º integral.
          // O salário-base dos 12 meses já inclui a remuneração normal do mês de férias;
          // soma-se apenas o adicional constitucional de 1/3.
          const adicionalFerias = rendaMensal / 3;
          rendaAnualBruta = (rendaMensal * 12) + adicionalFerias + rendaMensal;

          const inssMensal = this.calculateINSSProgressivo2025(rendaMensal);
          // O 1/3 de férias gozadas integra a base do empregado para o RGPS, observadas as limitações do teto.
          const inssFerias = this.calculateINSSProgressivo2025(rendaMensal + adicionalFerias);
          const inssRegularAnual = (inssMensal * 11) + inssFerias;
          const inss13 = inssMensal;
          inssAnual = inssRegularAnual + inss13;

          // Férias + 1/3 são tributadas no mês do pagamento; para a estimativa anual,
          // entram no rendimento tributável normal. O 13º permanece tributado separadamente.
          const baseIRPFRegularAnual = Math.max(0, (rendaMensal * 12 + adicionalFerias) - inssRegularAnual);
          const irpfRegularAnual = this.calculateIRPFAnual2025(baseIRPFRegularAnual);
          const baseIRPF13 = Math.max(0, rendaMensal - inss13);
          const irpf13 = this.calculateIRPF13Salario2025(baseIRPF13);
          irpfAnual = irpfRegularAnual + irpf13;

          const rendaLiquidaAnual = Math.max(0, rendaAnualBruta - inssAnual - irpfAnual);
          const consumoAnual = rendaLiquidaAnual * (percentualGastos / 100);
          tributoConsumo = consumoAnual * this.ALIQUOTA_TRIBUTOS_FEDERAIS_CONSUMO_2025;

          totalImpostoFederalAnual = inssAnual + irpfAnual + tributoConsumo;
          break;
        }

        case 'servidor_publico': {
          // Hipótese padronizada: servidor civil da União, vinculado ao RPPS da União.
          // Estados e municípios podem ter alíquotas/regras próprias.
          const adicionalFerias = rendaMensal / 3;
          rendaAnualBruta = (rendaMensal * 12) + adicionalFerias + rendaMensal;

          const contribuicaoMensal = this.calculateRPPSServidorUniao2025(rendaMensal);
          // 13º possui contribuição previdenciária própria. O terço constitucional de férias
          // não integra a base previdenciária do servidor quando não incorporável aos proventos.
          inssAnual = contribuicaoMensal * 13;

          const baseIRPFRegularAnual = Math.max(0, (rendaMensal * 12 + adicionalFerias) - (contribuicaoMensal * 12));
          const irpfRegularAnual = this.calculateIRPFAnual2025(baseIRPFRegularAnual);
          const baseIRPF13 = Math.max(0, rendaMensal - contribuicaoMensal);
          const irpf13 = this.calculateIRPF13Salario2025(baseIRPF13);
          irpfAnual = irpfRegularAnual + irpf13;

          const rendaLiquidaAnual = Math.max(0, rendaAnualBruta - inssAnual - irpfAnual);
          const consumoAnual = rendaLiquidaAnual * (percentualGastos / 100);
          tributoConsumo = consumoAnual * this.ALIQUOTA_TRIBUTOS_FEDERAIS_CONSUMO_2025;

          totalImpostoFederalAnual = inssAnual + irpfAnual + tributoConsumo;
          break;
        }

        case 'pensionista_inss': {
          // Hipótese: benefício do RGPS, sem atividade remunerada concomitante.
          // O benefício não gera contribuição previdenciária do próprio beneficiário.
          rendaAnualBruta = rendaMensal * 13;
          inssAnual = 0;

          const baseIRPFRegularAnual = rendaMensal * 12;
          const irpfRegularAnual = this.calculateIRPFAnual2025(baseIRPFRegularAnual);
          const irpf13 = this.calculateIRPF13Salario2025(rendaMensal);
          irpfAnual = irpfRegularAnual + irpf13;

          const rendaLiquidaAnual = Math.max(0, rendaAnualBruta - irpfAnual);
          const consumoAnual = rendaLiquidaAnual * (percentualGastos / 100);
          tributoConsumo = consumoAnual * this.ALIQUOTA_TRIBUTOS_FEDERAIS_CONSUMO_2025;

          totalImpostoFederalAnual = irpfAnual + tributoConsumo;
          break;
        }

        case 'pj_simples': {
          // Hipótese: serviços no Anexo III, sem despesas empresariais informadas.
          // O valor informado é o faturamento bruto mensal da PJ.
          rendaAnualBruta = rendaMensal * 12;

          const simples = this.calculateSimplesAnexoIII2025(rendaAnualBruta);
          impostoPJ = simples.tributoFederalAnual;

          // Pró-labore padrão = 1 salário mínimo. O INSS do sócio é separado do DAS.
          const proLaboreMensal = Math.min(this.PROLABORE_MENSAL_PADRAO_2025, rendaMensal);
          const inssProLaboreMensal = proLaboreMensal * 0.11;
          inssAnual = inssProLaboreMensal * 12;
          const irpfProLabore = this.calculateIRPFAnual2025(
            Math.max(0, (proLaboreMensal * 12) - inssAnual)
          );
          irpfAnual = irpfProLabore;

          // Em 2025, lucros distribuídos ao sócio não sofrem IRPF adicional, observadas as regras legais de apuração/contabilidade.
          const rendaDisponivel = Math.max(0, rendaAnualBruta - impostoPJ - inssAnual - irpfAnual);
          const consumoAnual = rendaDisponivel * (percentualGastos / 100);
          tributoConsumo = consumoAnual * this.ALIQUOTA_TRIBUTOS_FEDERAIS_CONSUMO_2025;

          totalImpostoFederalAnual = impostoPJ + inssAnual + irpfAnual + tributoConsumo;
          break;
        }

        case 'pj_presumido': {
          // Hipótese: prestação de serviços em geral, base presumida de 32%, sem receitas
          // financeiras, ganhos de capital ou outras receitas e sem despesas empresariais informadas.
          rendaAnualBruta = rendaMensal * 12;

          const baseIRPJ = rendaAnualBruta * 0.32;
          const irpjNormal = baseIRPJ * 0.15;
          const adicionalIRPJ = Math.max(0, baseIRPJ - 240000) * 0.10;
          const csll = baseIRPJ * 0.09;
          const pis = rendaAnualBruta * 0.0065;
          const cofins = rendaAnualBruta * 0.03;
          impostoPJ = irpjNormal + adicionalIRPJ + csll + pis + cofins;

          // Para a PJ fora do Simples, inclui-se a CPP patronal de 20% sobre o pró-labore padrão.
          const proLaboreMensal = Math.min(this.PROLABORE_MENSAL_PADRAO_2025, rendaMensal);
          const inssProLaboreMensal = proLaboreMensal * 0.11;
          const cppPatronalAnual = proLaboreMensal * 0.20 * 12;
          inssAnual = inssProLaboreMensal * 12 + cppPatronalAnual;
          irpfAnual = this.calculateIRPFAnual2025(
            Math.max(0, (proLaboreMensal * 12) - (inssProLaboreMensal * 12))
          );

          // Em 2025, a distribuição de lucros permanece sem IRPF adicional, observadas as regras legais.
          const rendaDisponivel = Math.max(0, rendaAnualBruta - impostoPJ - inssAnual - irpfAnual);
          const consumoAnual = rendaDisponivel * (percentualGastos / 100);
          tributoConsumo = consumoAnual * this.ALIQUOTA_TRIBUTOS_FEDERAIS_CONSUMO_2025;

          totalImpostoFederalAnual = impostoPJ + inssAnual + irpfAnual + tributoConsumo;
          break;
        }

        case 'autonomo': {
          rendaAnualBruta = rendaMensal * 12;

          // Contribuinte individual: 20% entre o salário mínimo e o teto previdenciário.
          const inssMensal = Math.min(rendaMensal * 0.20, this.TETO_INSS_2025 * 0.20);
          inssAnual = inssMensal * 12;

          const baseIRPFAnual = Math.max(0, rendaAnualBruta - inssAnual);
          irpfAnual = this.calculateIRPFAnual2025(baseIRPFAnual);

          const rendaLiquidaAnual = Math.max(0, rendaAnualBruta - inssAnual - irpfAnual);
          const consumoAnual = rendaLiquidaAnual * (percentualGastos / 100);
          tributoConsumo = consumoAnual * this.ALIQUOTA_TRIBUTOS_FEDERAIS_CONSUMO_2025;

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
   * Tabela Progressiva do INSS Oficial para 2025
   * Faixa 1 (7.5%): até R$ 1.518,00
   * Faixa 2 (9.0%): R$ 1.518,01 até R$ 2.793,88
   * Faixa 3 (12.0%): R$ 2.793,89 até R$ 4.190,83
   * Faixa 4 (14.0%): R$ 4.190,84 até R$ 8.157,41
   */
  private calculateINSSProgressivo2025(salarioMensal: number): number {
    const valorTributavel = Math.min(Math.max(0, salarioMensal), this.TETO_INSS_2025);

    const f1Limit = 1518.00;
    const f2Limit = 2793.88;
    const f3Limit = 4190.83;

    if (valorTributavel <= f1Limit) {
      return valorTributavel * 0.075;
    } else if (valorTributavel <= f2Limit) {
      return (f1Limit * 0.075) + 
             ((valorTributavel - f1Limit) * 0.09);
    } else if (valorTributavel <= f3Limit) {
      return (f1Limit * 0.075) + 
             ((f2Limit - f1Limit) * 0.09) + 
             ((valorTributavel - f2Limit) * 0.12);
    } else {
      return (f1Limit * 0.075) + 
             ((f2Limit - f1Limit) * 0.09) + 
             ((f3Limit - f2Limit) * 0.12) + 
             ((valorTributavel - f3Limit) * 0.14);
    }
  }

  /**
   * Tabela progressiva de contribuição do RPPS da União vigente em 2025.
   * Aplicada ao servidor civil da União para a estimativa padronizada deste perfil.
   */
  private calculateRPPSServidorUniao2025(baseMensal: number): number {
    const valor = Math.max(0, baseMensal);
    const faixas = [
      { limite: 1518.00, aliquota: 0.075 },
      { limite: 2793.88, aliquota: 0.09 },
      { limite: 4190.83, aliquota: 0.12 },
      { limite: 8157.41, aliquota: 0.14 },
      { limite: 13969.49, aliquota: 0.145 },
      { limite: 27938.95, aliquota: 0.165 },
      { limite: 54480.97, aliquota: 0.19 },
      { limite: Infinity, aliquota: 0.22 }
    ];

    let restante = valor;
    let anterior = 0;
    let contribuicao = 0;

    for (const faixa of faixas) {
      const baseFaixa = Math.max(0, Math.min(restante, faixa.limite - anterior));
      contribuicao += baseFaixa * faixa.aliquota;
      restante -= baseFaixa;
      anterior = faixa.limite;
      if (restante <= 0) break;
    }

    return contribuicao;
  }

  /**
   * Tabela Anual do IRPF para o ano-calendário de 2025.
   * Usa o desconto simplificado anual máximo de R$ 16.754,34 (20% da base, limitado ao teto).
   * Não considera dependentes, pensão, despesas médicas, educação ou livro-caixa.
   */
  private calculateIRPFAnual2025(rendimentoTributavelAnual: number): number {
    const descontoSimplificado = Math.min(
      Math.max(0, rendimentoTributavelAnual) * 0.20,
      16754.34
    );
    const baseCalculo = Math.max(0, rendimentoTributavelAnual - descontoSimplificado);

    if (baseCalculo <= 28467.20) {
      return 0;
    } else if (baseCalculo <= 33919.80) {
      return Math.max(0, (baseCalculo * 0.075) - 2135.04);
    } else if (baseCalculo <= 45012.60) {
      return Math.max(0, (baseCalculo * 0.15) - 4679.03);
    } else if (baseCalculo <= 55976.16) {
      return Math.max(0, (baseCalculo * 0.225) - 8054.97);
    }

    return Math.max(0, (baseCalculo * 0.275) - 10853.78);
  }

  /** Décimo terceiro: tributação exclusiva na fonte com a tabela mensal vigente em dezembro/2025. */
  private calculateIRPF13Salario2025(base13: number): number {
    const descontoSimplificadoMensal = 607.20;
    const baseCalculo = Math.max(0, base13 - descontoSimplificadoMensal);

    if (baseCalculo <= 2428.80) {
      return 0;
    } else if (baseCalculo <= 2826.65) {
      return Math.max(0, (baseCalculo * 0.075) - 182.16);
    } else if (baseCalculo <= 3751.05) {
      return Math.max(0, (baseCalculo * 0.15) - 394.16);
    } else if (baseCalculo <= 4664.68) {
      return Math.max(0, (baseCalculo * 0.225) - 675.49);
    }

    return Math.max(0, (baseCalculo * 0.275) - 908.73);
  }

  /**
   * Simples Nacional – Anexo III, ano-calendário 2025.
   * Calcula o DAS pela alíquota efetiva e retira do total a parcela correspondente ao ISS,
   * deixando apenas IRPJ, CSLL, PIS/Cofins e CPP como tributos federais.
   */
  private calculateSimplesAnexoIII2025(rendaAnualBruta: number): {
    tributoFederalAnual: number;
    dasAnual: number;
    aliquotaEfetiva: number;
  } {
    /**
     * Anexo III vigente no ano-calendário de 2025: alíquota nominal, parcela a deduzir
     * e composição do DAS. O federal inclui IRPJ, CSLL, PIS/Cofins e CPP; ISS fica fora.
     *
     * 1ª a 4ª e 5ª faixa: o percentual federal é obtido pela repartição do DAS.
     * Na 5ª faixa, o ISS tem teto efetivo de 5%; o excedente é redistribuído aos
     * tributos federais. Na 6ª faixa, não há ISS na partilha.
     */
    const regras = [
      { limite: 180000, aliquota: 0.0600, deducao: 0, federalShare: 0.665 },
      { limite: 360000, aliquota: 0.1120, deducao: 9360, federalShare: 0.680 },
      { limite: 720000, aliquota: 0.1350, deducao: 17640, federalShare: 0.675 },
      { limite: 1800000, aliquota: 0.1600, deducao: 35640, federalShare: 0.675 },
      { limite: 3600000, aliquota: 0.2100, deducao: 125640, federalShare: 0.665 },
      { limite: 4800000, aliquota: 0.3300, deducao: 648000, federalShare: 1.000 }
    ];

    const regra = regras.find(f => rendaAnualBruta <= f.limite);
    if (!regra) {
      throw new Error('Faturamento acima do limite do Simples Nacional.');
    }

    const dasAnual = Math.max(0, (rendaAnualBruta * regra.aliquota) - regra.deducao);
    const aliquotaEfetiva = rendaAnualBruta > 0 ? dasAnual / rendaAnualBruta : 0;

    let aliquotaFederalEfetiva: number;
    if (rendaAnualBruta > 1800000 && rendaAnualBruta <= 3600000 && aliquotaEfetiva > 0.1492537) {
      // Na 5ª faixa, o ISS fica limitado a 5% da receita e o excedente vai para a União.
      aliquotaFederalEfetiva = Math.max(0, aliquotaEfetiva - 0.05);
    } else {
      aliquotaFederalEfetiva = aliquotaEfetiva * regra.federalShare;
    }

    const tributoFederalAnual = rendaAnualBruta * aliquotaFederalEfetiva;

    return { tributoFederalAnual, dasAnual, aliquotaEfetiva };
  }

}