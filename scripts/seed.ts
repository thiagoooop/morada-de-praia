
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar usuário admin
  const hashedPassword = await bcrypt.hash('johndoe123', 12);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      name: 'João Silva',
      password: hashedPassword,
    },
  });

  console.log('✅ Usuário admin criado:', adminUser.email);

  // Criar apartamentos
  const apartamentos = await Promise.all([
    prisma.apartamento.upsert({
      where: { id: 'apt-001' },
      update: {},
      create: {
        id: 'apt-001',
        nome: 'Apartamento Vista Mar - Copacabana',
        descricao: 'Apartamento com vista para o mar em Copacabana, 2 quartos e 1 banheiro.',
        endereco: 'Avenida Atlântica, 1500 - Copacabana, Rio de Janeiro',
        capacidade: 4,
        ativo: true,
      },
    }),
    prisma.apartamento.upsert({
      where: { id: 'apt-002' },
      update: {},
      create: {
        id: 'apt-002',
        nome: 'Loft Moderno - Ipanema',
        descricao: 'Loft moderno e estiloso em Ipanema, próximo à praia.',
        endereco: 'Rua Visconde de Pirajá, 800 - Ipanema, Rio de Janeiro',
        capacidade: 2,
        ativo: true,
      },
    }),
    prisma.apartamento.upsert({
      where: { id: 'apt-003' },
      update: {},
      create: {
        id: 'apt-003',
        nome: 'Cobertura Duplex - Barra da Tijuca',
        descricao: 'Cobertura duplex de luxo na Barra da Tijuca com piscina privativa.',
        endereco: 'Avenida das Américas, 3000 - Barra da Tijuca, Rio de Janeiro',
        capacidade: 6,
        ativo: true,
      },
    }),
    prisma.apartamento.upsert({
      where: { id: 'apt-004' },
      update: {},
      create: {
        id: 'apt-004',
        nome: 'Studio Aconchegante - Leblon',
        descricao: 'Studio aconchegante no coração do Leblon.',
        endereco: 'Rua Dias Ferreira, 200 - Leblon, Rio de Janeiro',
        capacidade: 2,
        ativo: true,
      },
    }),
  ]);

  console.log('✅ Apartamentos criados:', apartamentos.length);

  // Criar integrações mock
  const integracoes = await Promise.all([
    prisma.integracao.upsert({
      where: { id: 'int-airbnb' },
      update: {},
      create: {
        id: 'int-airbnb',
        plataforma: 'AIRBNB',
        nomeConexao: 'Conta Demo Airbnb',
        status: 'CONECTADA',
        configuracao: {
          token: 'demo_token_airbnb',
          conectadoEm: new Date().toISOString(),
        },
        ultimaSync: new Date(),
        ativa: true,
      },
    }),
    prisma.integracao.upsert({
      where: { id: 'int-booking' },
      update: {},
      create: {
        id: 'int-booking',
        plataforma: 'BOOKING_COM',
        nomeConexao: 'Conta Demo Booking.com',
        status: 'CONECTADA',
        configuracao: {
          token: 'demo_token_booking',
          conectadoEm: new Date().toISOString(),
        },
        ultimaSync: new Date(),
        ativa: true,
      },
    }),
  ]);

  console.log('✅ Integrações criadas:', integracoes.length);

  // Criar mapeamentos de apartamentos
  const mapeamentos = await Promise.all([
    prisma.mapeamentoApartamento.upsert({
      where: { id: 'map-001' },
      update: {},
      create: {
        id: 'map-001',
        integracaoId: integracoes[0].id, // Airbnb
        apartamentoId: apartamentos[0].id, // Vista Mar
        idExterno: 'airbnb_001',
        nomeExterno: 'Apartamento Vista Mar - Copacabana',
      },
    }),
    prisma.mapeamentoApartamento.upsert({
      where: { id: 'map-002' },
      update: {},
      create: {
        id: 'map-002',
        integracaoId: integracoes[0].id, // Airbnb
        apartamentoId: apartamentos[1].id, // Loft Ipanema
        idExterno: 'airbnb_002',
        nomeExterno: 'Loft Moderno - Ipanema',
      },
    }),
    prisma.mapeamentoApartamento.upsert({
      where: { id: 'map-003' },
      update: {},
      create: {
        id: 'map-003',
        integracaoId: integracoes[1].id, // Booking.com
        apartamentoId: apartamentos[2].id, // Cobertura Barra
        idExterno: 'booking_001',
        nomeExterno: 'Ocean View Apartment - Copacabana Beach',
      },
    }),
    prisma.mapeamentoApartamento.upsert({
      where: { id: 'map-004' },
      update: {},
      create: {
        id: 'map-004',
        integracaoId: integracoes[1].id, // Booking.com
        apartamentoId: apartamentos[3].id, // Studio Leblon
        idExterno: 'booking_002',
        nomeExterno: 'Modern Loft in Ipanema',
      },
    }),
  ]);

  console.log('✅ Mapeamentos criados:', mapeamentos.length);

  // Criar hóspedes
  const hospedes = await Promise.all([
    prisma.hospede.upsert({
      where: { email: 'carlos.silva@email.com' },
      update: {},
      create: {
        nome: 'Carlos Silva',
        email: 'carlos.silva@email.com',
        telefone: '(11) 99999-1111',
        documento: '123.456.789-01',
        observacoes: 'Hóspede preferencial, sempre muito educado.',
      },
    }),
    prisma.hospede.upsert({
      where: { email: 'maria.santos@email.com' },
      update: {},
      create: {
        nome: 'Maria Santos',
        email: 'maria.santos@email.com',
        telefone: '(21) 99999-2222',
        documento: '987.654.321-02',
        observacoes: 'Primeira estadia.',
      },
    }),
    prisma.hospede.upsert({
      where: { email: 'pedro.oliveira@email.com' },
      update: {},
      create: {
        nome: 'Pedro Oliveira',
        email: 'pedro.oliveira@email.com',
        telefone: '(31) 99999-3333',
        documento: '456.789.123-03',
      },
    }),
    prisma.hospede.upsert({
      where: { email: 'ana.costa@email.com' },
      update: {},
      create: {
        nome: 'Ana Costa',
        email: 'ana.costa@email.com',
        telefone: '(85) 99999-4444',
        documento: '789.123.456-04',
        observacoes: 'Viagem de negócios.',
      },
    }),
    prisma.hospede.upsert({
      where: { email: 'roberto.lima@email.com' },
      update: {},
      create: {
        nome: 'Roberto Lima',
        email: 'roberto.lima@email.com',
        telefone: '(11) 99999-5555',
        documento: '321.654.987-05',
      },
    }),
    prisma.hospede.upsert({
      where: { email: 'lucia.ferreira@email.com' },
      update: {},
      create: {
        nome: 'Lúcia Ferreira',
        email: 'lucia.ferreira@email.com',
        telefone: '(47) 99999-6666',
        documento: '654.987.321-06',
      },
    }),
    // Hóspedes das plataformas externas
    prisma.hospede.upsert({
      where: { email: 'john.smith@airbnb.com' },
      update: {},
      create: {
        nome: 'John Smith',
        email: 'john.smith@airbnb.com',
        telefone: '+1 555-0101',
        documento: 'PASSPORT-USA123',
        observacoes: 'Hóspede internacional via Airbnb',
      },
    }),
    prisma.hospede.upsert({
      where: { email: 'sophie.martin@booking.com' },
      update: {},
      create: {
        nome: 'Sophie Martin',
        email: 'sophie.martin@booking.com',
        telefone: '+33 6 12345678',
        documento: 'ID-FR456789',
        observacoes: 'Hóspede francesa via Booking.com',
      },
    }),
  ]);

  console.log('✅ Hóspedes criados:', hospedes.length);

  // Criar reservas
  const now = new Date();
  const reservas = await Promise.all([
    // Reserva atual - Vista Mar (Direta)
    prisma.reserva.upsert({
      where: { id: 'res-001' },
      update: {},
      create: {
        id: 'res-001',
        apartamentoId: apartamentos[0].id,
        hospedeId: hospedes[0].id,
        dataInicio: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
        dataFim: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000), // 3 dias à frente
        preco: 1500.00,
        status: 'CHECK_IN',
        observacoes: 'Check-in realizado às 15:00',
      },
    }),
    // Reserva futura - Loft Ipanema (Airbnb)
    prisma.reserva.upsert({
      where: { id: 'res-002' },
      update: {},
      create: {
        id: 'res-002',
        apartamentoId: apartamentos[1].id,
        hospedeId: hospedes[6].id, // John Smith
        dataInicio: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 dias à frente
        dataFim: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // 14 dias à frente
        preco: 2100.00,
        status: 'CONFIRMADA',
        observacoes: 'Reserva via Airbnb - pagamento confirmado',
      },
    }),
    // Reserva passada - Cobertura Barra (Booking.com)
    prisma.reserva.upsert({
      where: { id: 'res-003' },
      update: {},
      create: {
        id: 'res-003',
        apartamentoId: apartamentos[2].id,
        hospedeId: hospedes[7].id, // Sophie Martin
        dataInicio: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 dias atrás
        dataFim: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 dias atrás
        preco: 3500.00,
        status: 'CHECK_OUT',
        observacoes: 'Reserva via Booking.com - check-out realizado',
      },
    }),
    // Reserva futura - Studio Leblon (Direta)
    prisma.reserva.upsert({
      where: { id: 'res-004' },
      update: {},
      create: {
        id: 'res-004',
        apartamentoId: apartamentos[3].id,
        hospedeId: hospedes[3].id,
        dataInicio: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000), // 21 dias à frente
        dataFim: new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000), // 28 dias à frente
        preco: 1200.00,
        status: 'CONFIRMADA',
      },
    }),
    // Reserva futura longa - Vista Mar (Airbnb)
    prisma.reserva.upsert({
      where: { id: 'res-005' },
      update: {},
      create: {
        id: 'res-005',
        apartamentoId: apartamentos[0].id,
        hospedeId: hospedes[4].id,
        dataInicio: new Date(now.getTime() + 35 * 24 * 60 * 60 * 1000), // 35 dias à frente
        dataFim: new Date(now.getTime() + 49 * 24 * 60 * 60 * 1000), // 49 dias à frente
        preco: 4200.00,
        status: 'CONFIRMADA',
        observacoes: 'Reserva de 2 semanas via Airbnb - hóspede corporativo',
      },
    }),
    // Reserva cancelada
    prisma.reserva.upsert({
      where: { id: 'res-006' },
      update: {},
      create: {
        id: 'res-006',
        apartamentoId: apartamentos[1].id,
        hospedeId: hospedes[5].id,
        dataInicio: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000), // 15 dias à frente
        dataFim: new Date(now.getTime() + 18 * 24 * 60 * 60 * 1000), // 18 dias à frente
        preco: 900.00,
        status: 'CANCELADA',
        observacoes: 'Cancelada pelo hóspede - reembolso processado',
      },
    }),
  ]);

  console.log('✅ Reservas criadas:', reservas.length);

  // Criar reservas sincronizadas (para reservas que vieram das plataformas)
  const reservasSincronizadas = await Promise.all([
    // Reserva do Airbnb
    prisma.reservaSincronizada.upsert({
      where: { id: 'sync-001' },
      update: {},
      create: {
        id: 'sync-001',
        reservaId: reservas[1].id, // Loft Ipanema - John Smith
        integracaoId: integracoes[0].id, // Airbnb
        idExterno: 'airbnb_res_12345',
        dadosOriginais: {
          plataforma: 'Airbnb',
          reservaOriginal: 'HMCMTP5JQT',
          status: 'confirmed',
          guest: {
            name: 'John Smith',
            email: 'john.smith@airbnb.com'
          }
        },
      },
    }),
    // Reserva do Booking.com
    prisma.reservaSincronizada.upsert({
      where: { id: 'sync-002' },
      update: {},
      create: {
        id: 'sync-002',
        reservaId: reservas[2].id, // Cobertura Barra - Sophie Martin
        integracaoId: integracoes[1].id, // Booking.com
        idExterno: 'booking_res_67890',
        dadosOriginais: {
          plataforma: 'Booking.com',
          reservaOriginal: '3456789012',
          status: 'confirmed',
          guest: {
            name: 'Sophie Martin',
            email: 'sophie.martin@booking.com'
          }
        },
      },
    }),
    // Reserva do Airbnb (futura)
    prisma.reservaSincronizada.upsert({
      where: { id: 'sync-003' },
      update: {},
      create: {
        id: 'sync-003',
        reservaId: reservas[4].id, // Vista Mar - Roberto Lima (futuro)
        integracaoId: integracoes[0].id, // Airbnb
        idExterno: 'airbnb_res_11111',
        dadosOriginais: {
          plataforma: 'Airbnb',
          reservaOriginal: 'HQWR8P2KL9',
          status: 'confirmed',
          guest: {
            name: 'Roberto Lima',
            email: 'roberto.lima@email.com'
          }
        },
      },
    }),
  ]);

  console.log('✅ Reservas sincronizadas criadas:', reservasSincronizadas.length);

  // Criar algumas despesas
  const despesas = await Promise.all([
    prisma.despesa.create({
      data: {
        descricao: 'Limpeza pós check-out - Cobertura Barra',
        valor: 150.00,
        data: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        categoria: 'LIMPEZA',
        reservaId: reservas[2].id,
      },
    }),
    prisma.despesa.create({
      data: {
        descricao: 'Manutenção ar condicionado - Vista Mar',
        valor: 280.00,
        data: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),
        categoria: 'MANUTENCAO',
      },
    }),
    prisma.despesa.create({
      data: {
        descricao: 'Taxa de condomínio - Janeiro',
        valor: 850.00,
        data: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000),
        categoria: 'TAXAS',
      },
    }),
  ]);

  console.log('✅ Despesas criadas:', despesas.length);

  // Criar tarefas de manutenção
  const tarefas = await Promise.all([
    prisma.tarefa.create({
      data: {
        titulo: 'Limpeza profunda - Cobertura Barra',
        descricao: 'Limpeza completa após check-out, incluindo carpetes e estofados.',
        apartamentoId: apartamentos[2].id,
        data: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000), // Amanhã
        status: 'PENDENTE',
        tipo: 'LIMPEZA',
      },
    }),
    prisma.tarefa.create({
      data: {
        titulo: 'Vistoria antes do check-in - Loft Ipanema',
        descricao: 'Verificar todas as instalações antes da chegada do próximo hóspede.',
        apartamentoId: apartamentos[1].id,
        data: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000), // 6 dias
        status: 'PENDENTE',
        tipo: 'VISTORIA',
      },
    }),
    prisma.tarefa.create({
      data: {
        titulo: 'Troca das fechaduras - Studio Leblon',
        descricao: 'Instalação de fechadura eletrônica conforme solicitado.',
        apartamentoId: apartamentos[3].id,
        data: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 dias
        status: 'PENDENTE',
        tipo: 'MANUTENCAO',
      },
    }),
    prisma.tarefa.create({
      data: {
        titulo: 'Limpeza semanal - Vista Mar',
        descricao: 'Limpeza de manutenção durante a estadia longa.',
        apartamentoId: apartamentos[0].id,
        data: new Date(now.getTime() + 42 * 24 * 60 * 60 * 1000), // Durante a reserva longa
        status: 'PENDENTE',
        tipo: 'LIMPEZA',
      },
    }),
  ]);

  console.log('✅ Tarefas criadas:', tarefas.length);

  console.log('🎉 Seed concluído com sucesso!');
  console.log('📝 Dados de integração:');
  console.log('  - 2 integrações criadas (Airbnb e Booking.com)');
  console.log('  - 4 mapeamentos de apartamentos');
  console.log('  - 3 reservas sincronizadas de plataformas externas');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
