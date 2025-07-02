
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Download,
  Calendar,
  Building2
} from 'lucide-react';
import { FinanceiroCharts } from './financeiro-charts';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface FinancialData {
  resumo: {
    receitaTotal: number;
    despesaTotal: number;
    lucro: number;
    ocupacao: number;
  };
  receitasPorMes: Array<{
    mes: string;
    valor: number;
  }>;
  despesasPorCategoria: Array<{
    categoria: string;
    valor: number;
  }>;
  ocupacaoPorApartamento: Array<{
    apartamento: string;
    ocupacao: number;
  }>;
  transacoes: Array<{
    id: string;
    tipo: 'receita' | 'despesa';
    descricao: string;
    valor: number;
    data: string;
    categoria?: string;
    apartamento?: string;
  }>;
}

export function FinanceiroManager() {
  const [data, setData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('3'); // 3 meses por padrão

  useEffect(() => {
    fetchFinancialData();
  }, [selectedPeriod]);

  const fetchFinancialData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/financeiro?periodo=${selectedPeriod}`);
      if (response.ok) {
        const financialData = await response.json();
        setData(financialData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados financeiros:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid gap-6 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg"></div>
          ))}
        </div>
        <div className="h-96 bg-muted rounded-lg"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Erro ao carregar dados financeiros</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controles */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Período:</span>
              </div>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Último mês</SelectItem>
                  <SelectItem value="3">Últimos 3 meses</SelectItem>
                  <SelectItem value="6">Últimos 6 meses</SelectItem>
                  <SelectItem value="12">Último ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Exportar PDF
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Despesa
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Cards de Resumo */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {data.resumo.receitaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Últimos {selectedPeriod} mese(s)
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas Totais</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {data.resumo.despesaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Últimos {selectedPeriod} mese(s)
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${data.resumo.lucro >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              R$ {data.resumo.lucro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Receita - Despesas
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Ocupação</CardTitle>
            <Building2 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {data.resumo.ocupacao.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Média dos apartamentos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <FinanceiroCharts data={data} />

      {/* Transações Recentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>Transações Recentes</span>
          </CardTitle>
          <CardDescription>
            Últimas receitas e despesas registradas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.transacoes.length > 0 ? (
            <div className="space-y-3">
              {data.transacoes.map(transacao => (
                <div key={transacao.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      transacao.tipo === 'receita' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <p className="font-medium">{transacao.descricao}</p>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        {transacao.categoria && (
                          <span>{transacao.categoria}</span>
                        )}
                        {transacao.apartamento && (
                          <>
                            <span>•</span>
                            <span>{transacao.apartamento}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>{format(new Date(transacao.data), 'dd/MM/yyyy', { locale: ptBR })}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`font-medium ${
                    transacao.tipo === 'receita' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transacao.tipo === 'receita' ? '+' : '-'}R$ {transacao.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma transação encontrada</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
