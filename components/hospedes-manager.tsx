
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users,
  Search,
  Plus,
  Eye,
  Edit,
  Mail,
  Phone,
  User,
  Calendar,
  MapPin
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Hospede {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  documento?: string;
  observacoes?: string;
  createdAt: string;
  _count: {
    reservas: number;
  };
  ultimaEstadia?: string;
}

export function HospedesManager() {
  const [hospedes, setHospedes] = useState<Hospede[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredHospedes, setFilteredHospedes] = useState<Hospede[]>([]);

  useEffect(() => {
    fetchHospedes();
  }, []);

  useEffect(() => {
    const filtered = hospedes.filter(hospede =>
      hospede.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospede.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hospede.telefone?.includes(searchTerm) || ''
    );
    setFilteredHospedes(filtered);
  }, [hospedes, searchTerm]);

  const fetchHospedes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/hospedes');
      if (response.ok) {
        const data = await response.json();
        setHospedes(data);
      }
    } catch (error) {
      console.error('Erro ao carregar hóspedes:', error);
    } finally {
      setLoading(false);
    }
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
      {/* Controles */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar hóspedes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Hóspede
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Estatísticas */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Hóspedes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hospedes.length}</div>
            <p className="text-xs text-muted-foreground">
              Cadastrados no sistema
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hóspedes Frequentes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hospedes.filter(h => h._count.reservas > 1).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Com mais de 1 estadia
            </p>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos Este Mês</CardTitle>
            <Plus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hospedes.filter(h => {
                const created = new Date(h.createdAt);
                const now = new Date();
                return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Cadastrados recentemente
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Hóspedes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Lista de Hóspedes</span>
          </CardTitle>
          <CardDescription>
            {filteredHospedes.length} hóspede(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredHospedes.length > 0 ? (
            <div className="space-y-4">
              {filteredHospedes.map(hospede => (
                <div key={hospede.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 card-hover">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-lg">{hospede.nome}</h3>
                        {hospede._count.reservas > 1 && (
                          <Badge variant="secondary" className="text-xs">
                            Frequente
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-3 w-3" />
                          <span>{hospede.email}</span>
                        </div>
                        {hospede.telefone && (
                          <div className="flex items-center space-x-1">
                            <Phone className="h-3 w-3" />
                            <span>{hospede.telefone}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>{hospede._count.reservas} estadia(s)</span>
                        {hospede.ultimaEstadia && (
                          <span>
                            Última visita: {format(new Date(hospede.ultimaEstadia), 'dd/MM/yyyy', { locale: ptBR })}
                          </span>
                        )}
                        <span>
                          Cadastrado em {format(new Date(hospede.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum hóspede encontrado</p>
              {searchTerm && (
                <p className="text-sm mt-2">
                  Tente ajustar sua busca ou cadastre um novo hóspede
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
