import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { ChamadaData } from '@/types';

const getDataAtual = () => {
  const data = new Date();
  return data.toLocaleDateString('pt-BR');
};

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'public/data/alunos.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const alunosData = JSON.parse(fileContents);

    const chamadaPath = path.join(process.cwd(), 'public/data/chamada.json');
    let chamadaData: ChamadaData;

    try {
      const chamadaContents = await fs.readFile(chamadaPath, 'utf8');
      chamadaData = JSON.parse(chamadaContents);
    } catch {
      chamadaData = {
        data: getDataAtual(),
        turno: null,
        alunos: alunosData
      };
      await fs.writeFile(chamadaPath, JSON.stringify(chamadaData, null, 2));
    }
    
    return NextResponse.json(chamadaData);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao ler dados' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const chamadaData: ChamadaData = await request.json();
    const chamadaPath = path.join(process.cwd(), 'public/data/chamada.json');
    await fs.writeFile(chamadaPath, JSON.stringify(chamadaData, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao salvar dados' }, { status: 500 });
  }
} 