
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Wrench,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  Building2,
  Calendar,
  Trash2
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Tarefa {
  id: string;
  titulo: string;
  descricao?: string;
  apartamento: {
    id: string;
    nome: string;
  };
  data: string;
  status: 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA';
  tipo: 'LIMPEZA' | 'MANUTENCAO' | 'VISTORIA' | 'OUTROS';
  createdAt: string;
}

export function ManutencaoManager() {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTarefas();
  }, []);

  const fetchTarefas = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/tarefas');
      if (response.ok) {
        const data = await response.json();
        setTarefas(data);
      }
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/tarefas/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setTarefas(prevTarefas =>
          prevTarefas.map(tarefa =>
            tarefa.id === taskId ? { ...tarefa, status: newStatus as any } : tarefa
          )
        );
      }
    } catch (error) {
      console.error('Erro ao atualizar status da tarefa:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDENTE':
        return 'status-pendente';
      case 'EM_ANDAMENTO':
        return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'CONCLUIDA':
        return 'status-check-in';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDENTE':
        return 'Pendente';
      case 'EM_ANDAMENTO':
        return 'Em Andamento';
      case 'CONCLUIDA':
        return 'Concluída';
      default:
        return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDENTE':
        return <Clock className="h-4 w-4" />;
      case 'EM_ANDAMENTO':
        return <AlertCircle className="h-4 w-4" />;
      case 'CONCLUIDA':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'LIMPEZA':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'MANUTENCAO':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'VISTORIA':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'OUTROS':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const tarefasPendentes = tarefas.filter(t => t.status === 'PENDENTE');
  const tarefasEmAndamento = tarefas.filter(t => t.status === 'EM_ANDAMENTO');
  const tarefasConcluidas = tarefas.filter(t => t.status === 'CONCLUIDA');

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid gap-6 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-96 bg-muted rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Tarefas</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tarefas.length}</div>
            <p className="text-xs text-muted-foreground">
              Todas as tarefas
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{tarefasPendentes.length}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando execução
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{tarefasEmAndamento.length}</div>
            <p className="text-xs text-muted-foreground">
              Sendo executadas
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{tarefasConcluidas.length}</div>
            <p className="text-xs text-muted-foreground">
              Finalizadas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Controles */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Agenda de Tarefas</CardTitle>
              <CardDescription>
                Organize e acompanhe todas as atividades de manutenção
              </CardDescription>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Tarefa
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Quadro Kanban */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Pendentes */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-yellow-600">
              <Clock className="h-5 w-5" />
              <span>Pendentes ({tarefasPendentes.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
            {tarefasPendentes.map(tarefa => (
              <div key={tarefa.id} className="p-4 bg-muted rounded-lg card-hover">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">{tarefa.titulo}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateTaskStatus(tarefa.id, 'EM_ANDAMENTO')}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    Iniciar
                  </Button>
                </div>
                
                {tarefa.descricao && (
                  <p className="text-xs text-muted-foreground mb-2">{tarefa.descricao}</p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Badge className={getTipoColor(tarefa.tipo)}>
                      {tarefa.tipo}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Building2 className="h-3 w-3" />
                    <span>{tarefa.apartamento.nome}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(tarefa.data), 'dd/MM/yyyy', { locale: ptBR })}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
            
            {tarefasPendentes.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhuma tarefa pendente</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Em Andamento */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-600">
              <AlertCircle className="h-5 w-5" />
              <span>Em Andamento ({tarefasEmAndamento.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
            {tarefasEmAndamento.map(tarefa => (
              <div key={tarefa.id} className="p-4 bg-blue-50 rounded-lg card-hover">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">{tarefa.titulo}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateTaskStatus(tarefa.id, 'CONCLUIDA')}
                    className="text-green-600 hover:text-green-700"
                  >
                    Concluir
                  </Button>
                </div>
                
                {tarefa.descricao && (
                  <p className="text-xs text-muted-foreground mb-2">{tarefa.descricao}</p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Badge className={getTipoColor(tarefa.tipo)}>
                      {tarefa.tipo}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Building2 className="h-3 w-3" />
                    <span>{tarefa.apartamento.nome}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(tarefa.data), 'dd/MM/yyyy', { locale: ptBR })}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
            
            {tarefasEmAndamento.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhuma tarefa em andamento</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Concluídas */}
        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span>Concluídas ({tarefasConcluidas.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
            {tarefasConcluidas.map(tarefa => (
              <div key={tarefa.id} className="p-4 bg-green-50 rounded-lg card-hover">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">{tarefa.titulo}</h4>
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                
                {tarefa.descricao && (
                  <p className="text-xs text-muted-foreground mb-2">{tarefa.descricao}</p>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex space-x-2">
                    <Badge className={getTipoColor(tarefa.tipo)}>
                      {tarefa.tipo}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Building2 className="h-3 w-3" />
                    <span>{tarefa.apartamento.nome}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(tarefa.data), 'dd/MM/yyyy', { locale: ptBR })}</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
            
            {tarefasConcluidas.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Nenhuma tarefa concluída</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
