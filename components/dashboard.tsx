
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  Calendar, 
  DollarSign, 
  CheckCircle,
  Clock,
  Users,
  TrendingUp,
  Plus
} from 'lucide-react';
import Link from 'next/link';

interface DashboardData {
  apartamentos: Array<{
    id: string;
    nome: string;
    status: 'ocupado' | 'vago';
    hospedeAtual?: string;
    proximoCheckOut?: string;
    proximoCheckIn?: string;
  }>;
  proximosEventos: Array<{
    id: string;
    tipo: 'check-in' | 'check-out';
    apartamento: string;
    hospede: string;
    data: string;
  }>;
  resumoFinanceiro: {
    receitaMes: number;
    despesasMes: number;
    lucroMes: number;
    ocupacaoMes: number;
  };
  tarefasPendentes: Array<{
    id: string;
    titulo: string;
    apartamento: string;
    data: string;
    tipo: string;
  }>;
}

export function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard');
        if (response.ok) {
          const dashboardData = await response.json();
          setData(dashboardData);
        }
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-muted rounded w-64"></div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Erro ao carregar dados do dashboard</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral da gestão dos seus apartamentos
          </p>
        </div>
        <Link href="/reservas">
          <Button className="space-x-2">
            <Plus className="h-4 w-4" />
            <span>Nova Reserva</span>
          </Button>
        </Link>
      </div>

      {/* Cards dos Apartamentos */}
      <div className="grid gap-6 md:grid-cols-2">
        {data.apartamentos?.map((apartamento) => (
          <Card key={apartamento.id} className="card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium flex items-center space-x-2">
                <Building2 className="h-4 w-4" />
                <span>{apartamento.nome}</span>
              </CardTitle>
              <Badge 
                variant={apartamento.status === 'ocupado' ? 'default' : 'secondary'}
                className={apartamento.status === 'ocupado' ? 'status-ocupado' : 'status-vago'}
              >
                {apartamento.status === 'ocupado' ? 'Ocupado' : 'Vago'}
              </Badge>
            </CardHeader>
            <CardContent>
              {apartamento.status === 'ocupado' ? (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Hóspede atual: <span className="font-medium text-foreground">{apartamento.hospedeAtual}</span>
                  </p>
                  {apartamento.proximoCheckOut && (
                    <p className="text-sm text-muted-foreground">
                      Check-out: <span className="font-medium text-foreground">{apartamento.proximoCheckOut}</span>
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Disponível para reserva</p>
                  {apartamento.proximoCheckIn && (
                    <p className="text-sm text-muted-foreground">
                      Próximo check-in: <span className="font-medium text-foreground">{apartamento.proximoCheckIn}</span>
                    </p>
                  )}
                </div>
              )}
              <div className="mt-4">
                <Link href="/reservas">
                  <Button variant="outline" size="sm" className="w-full">
                    Ver Calendário
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Cards de Métricas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Receita do Mês</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              R$ {data.resumoFinanceiro?.receitaMes?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
            </div>
            <p className="text-xs text-muted-foreground">
              Baseado nas reservas confirmadas
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas do Mês</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              R$ {data.resumoFinanceiro?.despesasMes?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de gastos registrados
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lucro do Mês</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              R$ {data.resumoFinanceiro?.lucroMes?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
            </div>
            <p className="text-xs text-muted-foreground">
              Receita - Despesas
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Ocupação</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {data.resumoFinanceiro?.ocupacaoMes?.toFixed(1) || '0'}%
            </div>
            <p className="text-xs text-muted-foreground">
              Média dos apartamentos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Próximos Eventos e Tarefas */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Próximos Eventos</span>
            </CardTitle>
            <CardDescription>
              Check-ins e check-outs dos próximos dias
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.proximosEventos?.length > 0 ? (
              data.proximosEventos.slice(0, 5).map((evento) => (
                <div key={evento.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center space-x-3">
                    {evento.tipo === 'check-in' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-orange-600" />
                    )}
                    <div>
                      <p className="text-sm font-medium">
                        {evento.tipo === 'check-in' ? 'Check-in' : 'Check-out'} - {evento.apartamento}
                      </p>
                      <p className="text-xs text-muted-foreground">{evento.hospede}</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{evento.data}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhum evento próximo
              </p>
            )}
            <div className="pt-2">
              <Link href="/reservas">
                <Button variant="outline" size="sm" className="w-full">
                  Ver Todas as Reservas
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span>Tarefas Pendentes</span>
            </CardTitle>
            <CardDescription>
              Limpeza e manutenção agendadas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.tarefasPendentes?.length > 0 ? (
              data.tarefasPendentes.slice(0, 5).map((tarefa) => (
                <div key={tarefa.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{tarefa.titulo}</p>
                    <p className="text-xs text-muted-foreground">
                      {tarefa.apartamento} • {tarefa.tipo}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">{tarefa.data}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                Nenhuma tarefa pendente
              </p>
            )}
            <div className="pt-2">
              <Link href="/manutencao">
                <Button variant="outline" size="sm" className="w-full">
                  Ver Agenda Completa
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
