import { CommomInterface } from './commom.model';

export interface DespesaSimplificada extends Omit<CommomInterface, 'id'> {
  despesaSimplificadaId: number;
  totalValue: number;
}
