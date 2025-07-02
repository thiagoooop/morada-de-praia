
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Tooltip, Legend } from 'recharts';

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
}

interface FinanceiroChartsProps {
  data: FinancialData;
}

const COLORS = ['#60B5FF', '#FF9149', '#FF9898', '#FF90BB', '#80D8C3', '#A19AD3'];

export function FinanceiroCharts({ data }: FinanceiroChartsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Receitas por Mês */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle>Receitas por Mês</CardTitle>
          <CardDescription>
            Evolução das receitas ao longo do tempo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.receitasPorMes}>
                <XAxis 
                  dataKey="mes" 
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`}
                  label={{ 
                    value: 'Receita (R$)', 
                    angle: -90, 
                    position: 'insideLeft', 
                    style: { textAnchor: 'middle', fontSize: 11 } 
                  }}
                />
                <Tooltip 
                  formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Receita']}
                  labelStyle={{ fontSize: 11 }}
                  contentStyle={{ fontSize: 11 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="valor" 
                  stroke="#60B5FF" 
                  strokeWidth={3}
                  dot={{ fill: '#60B5FF', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Despesas por Categoria */}
      <Card className="card-hover">
        <CardHeader>
          <CardTitle>Despesas por Categoria</CardTitle>
          <CardDescription>
            Distribuição dos gastos por tipo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.despesasPorCategoria}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="valor"
                  label={({ categoria, percent }: any) => `${categoria} ${((percent || 0) * 100).toFixed(0)}%`}
                >
                  {data.despesasPorCategoria.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Valor']}
                  contentStyle={{ fontSize: 11 }}
                />
                <Legend 
                  verticalAlign="top"
                  wrapperStyle={{ fontSize: 11 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Ocupação por Apartamento */}
      <Card className="card-hover md:col-span-2">
        <CardHeader>
          <CardTitle>Taxa de Ocupação por Apartamento</CardTitle>
          <CardDescription>
            Comparativo de ocupação entre os apartamentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.ocupacaoPorApartamento} margin={{ bottom: 20 }}>
                <XAxis 
                  dataKey="apartamento" 
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                  label={{ 
                    value: 'Apartamento', 
                    position: 'insideBottom', 
                    offset: -15, 
                    style: { textAnchor: 'middle', fontSize: 11 } 
                  }}
                />
                <YAxis 
                  tickLine={false}
                  tick={{ fontSize: 10 }}
                  domain={[0, 100]}
                  tickFormatter={(value) => `${value}%`}
                  label={{ 
                    value: 'Ocupação (%)', 
                    angle: -90, 
                    position: 'insideLeft', 
                    style: { textAnchor: 'middle', fontSize: 11 } 
                  }}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'Ocupação']}
                  labelStyle={{ fontSize: 11 }}
                  contentStyle={{ fontSize: 11 }}
                />
                <Bar 
                  dataKey="ocupacao" 
                  fill="#A19AD3"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
