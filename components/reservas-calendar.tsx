
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  Plus,
  Eye,
  Edit,
  Trash2,
  Building2,
  User,
  DollarSign,
  ExternalLink
} from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isSameDay, isSameMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

interface Reserva {
  id: string;
  apartamento: {
    id: string;
    nome: string;
  };
  hospede: {
    id: string;
    nome: string;
    email: string;
    telefone?: string;
  };
  dataInicio: string;
  dataFim: string;
  preco: number;
  status: 'CONFIRMADA' | 'CHECK_IN' | 'CHECK_OUT' | 'CANCELADA';
  observacoes?: string;
  sincronizacao?: {
    id: string;
    idExterno: string;
    integracao: {
      plataforma: 'AIRBNB' | 'BOOKING_COM';
      nomeConexao: string;
    };
  } | null;
}

interface Apartamento {
  id: string;
  nome: string;
}

export function ReservasCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [apartamentos, setApartamentos] = useState<Apartamento[]>([]);
  const [selectedApartment, setSelectedApartment] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [currentDate, selectedApartment]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Buscar apartamentos
      const aptResponse = await fetch('/api/apartamentos');
      if (aptResponse.ok) {
        const aptData = await aptResponse.json();
        setApartamentos(aptData);
      }

      // Buscar reservas do mês
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      
      const params = new URLSearchParams({
        inicio: start.toISOString(),
        fim: end.toISOString(),
      });

      if (selectedApartment !== 'all') {
        params.append('apartamentoId', selectedApartment);
      }

      const reservasResponse = await fetch(`/api/reservas?${params}`);
      if (reservasResponse.ok) {
        const reservasData = await reservasResponse.json();
        setReservas(reservasData);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMADA':
        return 'status-confirmada';
      case 'CHECK_IN':
        return 'status-check-in';
      case 'CHECK_OUT':
        return 'bg-gray-100 text-gray-600 border-gray-200';
      case 'CANCELADA':
        return 'status-cancelada';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CONFIRMADA':
        return 'Confirmada';
      case 'CHECK_IN':
        return 'Check-in';
      case 'CHECK_OUT':
        return 'Check-out';
      case 'CANCELADA':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const getOrigemBadge = (reserva: Reserva) => {
    if (!reserva.sincronizacao) {
      return (
        <Badge variant="outline" className="text-xs">
          <Building2 className="h-3 w-3 mr-1" />
          Direta
        </Badge>
      );
    }

    const plataforma = reserva.sincronizacao.integracao.plataforma;
    
    if (plataforma === 'AIRBNB') {
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">
          <div className="w-3 h-3 bg-red-500 rounded mr-1"></div>
          Airbnb
        </Badge>
      );
    }
    
    if (plataforma === 'BOOKING_COM') {
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
          <div className="w-3 h-3 bg-blue-600 rounded mr-1"></div>
          Booking.com
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="text-xs">
        <ExternalLink className="h-3 w-3 mr-1" />
        Externa
      </Badge>
    );
  };

  // Gerar dias do calendário
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Filtrar reservas por apartamento selecionado
  const filteredReservas = selectedApartment === 'all' 
    ? reservas 
    : reservas.filter(r => r.apartamento.id === selectedApartment);

  const previousMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const nextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 bg-muted rounded w-64"></div>
        <div className="h-96 bg-muted rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controles do Calendário */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={previousMonth}>
                ←
              </Button>
              <h2 className="text-xl font-semibold">
                {format(currentDate, 'MMMM yyyy', { locale: ptBR })}
              </h2>
              <Button variant="outline" onClick={nextMonth}>
                →
              </Button>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedApartment}
                onChange={(e) => setSelectedApartment(e.target.value)}
                className="px-3 py-2 border border-input rounded-md bg-background text-sm"
              >
                <option value="all">Todos os Apartamentos</option>
                {apartamentos.map(apt => (
                  <option key={apt.id} value={apt.id}>{apt.nome}</option>
                ))}
              </select>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nova Reserva
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Calendário */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map(day => {
              const dayReservas = filteredReservas.filter(reserva => {
                const inicio = new Date(reserva.dataInicio);
                const fim = new Date(reserva.dataFim);
                return day >= inicio && day <= fim;
              });

              return (
                <div key={day.toString()} className="min-h-24 border border-border rounded-lg p-2">
                  <div className={`text-sm font-medium mb-2 ${
                    isSameMonth(day, currentDate) ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {format(day, 'd')}
                  </div>
                  
                  <div className="space-y-1">
                    {dayReservas.map(reserva => (
                      <div 
                        key={reserva.id}
                        className={`p-1 rounded text-xs truncate cursor-pointer hover:opacity-80 ${getStatusColor(reserva.status)}`}
                        title={`${reserva.hospede.nome} - ${reserva.apartamento.nome}`}
                      >
                        {reserva.hospede.nome}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Reservas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Reservas do Mês</span>
          </CardTitle>
          <CardDescription>
            {filteredReservas.length} reserva(s) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredReservas.length > 0 ? (
            <div className="space-y-4">
              {filteredReservas.map(reserva => (
                <div key={reserva.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50">
                  <div className="flex items-center space-x-4">
                    <div className="flex flex-col space-y-2">
                      <Badge className={getStatusColor(reserva.status)}>
                        {getStatusText(reserva.status)}
                      </Badge>
                      {getOrigemBadge(reserva)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{reserva.hospede.nome}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Building2 className="h-3 w-3" />
                          <span>{reserva.apartamento.nome}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-3 w-3" />
                          <span>R$ {reserva.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right text-sm">
                      <div className="font-medium">
                        {format(new Date(reserva.dataInicio), 'dd/MM/yyyy', { locale: ptBR })}
                      </div>
                      <div className="text-muted-foreground">
                        até {format(new Date(reserva.dataFim), 'dd/MM/yyyy', { locale: ptBR })}
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma reserva encontrada para este período</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
