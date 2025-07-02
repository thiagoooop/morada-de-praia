
export interface Apartamento {
  id: string;
  nome: string;
  descricao?: string;
  endereco?: string;
  capacidade: number;
  ativo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Hospede {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  documento?: string;
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Reserva {
  id: string;
  apartamentoId: string;
  hospedeId: string;
  dataInicio: Date;
  dataFim: Date;
  preco: number;
  status: 'CONFIRMADA' | 'CHECK_IN' | 'CHECK_OUT' | 'CANCELADA';
  observacoes?: string;
  createdAt: Date;
  updatedAt: Date;
  apartamento: Apartamento;
  hospede: Hospede;
}

export interface Despesa {
  id: string;
  descricao: string;
  valor: number;
  data: Date;
  categoria: 'LIMPEZA' | 'MANUTENCAO' | 'UTILIDADES' | 'TAXAS' | 'OUTROS';
  reservaId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tarefa {
  id: string;
  titulo: string;
  descricao?: string;
  apartamentoId: string;
  data: Date;
  status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA';
  tipo: 'LIMPEZA' | 'MANUTENCAO' | 'VISTORIA' | 'OUTROS';
  createdAt: Date;
  updatedAt: Date;
  apartamento: Apartamento;
}

export interface User {
  id: string;
  name?: string;
  email: string;
  password: string;
  emailVerified?: Date;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}
