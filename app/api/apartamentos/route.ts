
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const apartamentos = await prisma.apartamento.findMany({
      where: {
        ativo: true,
      },
      select: {
        id: true,
        nome: true,
        descricao: true,
        capacidade: true,
      },
      orderBy: {
        nome: 'asc',
      },
    });

    return NextResponse.json(apartamentos);
  } catch (error) {
    console.error('Erro ao buscar apartamentos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
