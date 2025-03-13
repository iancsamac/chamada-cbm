'use server'
import { prisma } from "@/lib/prisma";
import { Aluno, Desempenho } from "@/types";

export async function marcarPresencaa(id: number) {
  const aluno = await prisma.aluno.findUnique({
    where: { id },
  });

  if (!aluno) {
    throw new Error("Aluno não encontrado");
  }

await prisma.aluno.update({
    where: { id },
    data: { presente: true },
  }); 
  return aluno;
}

export async function resetarChamadaa(turma?: string) {
  if (!turma) {
    await prisma.aluno.updateMany({
      data: { presente: false },
    });
  } else {
    await prisma.aluno.updateMany({
      where: { turma: turma },
      data: { presente: false },
    });
  }
}

export async function atualizarMotivoo(id: number, motivo: string) {
  await prisma.aluno.update({
    where: { id },
    data: { motivo },
  });
}   

export async function getAlunos(): Promise<Aluno[]> {
  const alunos = await prisma.aluno.findMany({
    orderBy: {
      id: 'asc',
    },
  });
  return alunos;
}

export async function getAlunosPorTurma(turma: string) {
  const alunos = await prisma.aluno.findMany({
    where: { turma },
    orderBy: {
      id: 'asc',
    },
  });
  return alunos;
}

export async function atualizarDesempenho(id: number, desempenho: Desempenho) {
  await prisma.aluno.update({
    where: { id },
    data: {
      maxFlexao: desempenho.flexao,
      maxBarra: desempenho.barra,
      tempoNatacao50m: desempenho.natação,
      tempoCorrida1000m: desempenho.corrida1000m,
      tempoCorrida2400m: desempenho.corrida2400m,
      maxAbdominal: desempenho.abdominal,
    },
  });
}

export async function addAluno(nome: string, turma: string) {
  await prisma.aluno.create({
    data: { nome, turma },
  });
}

export async function getFaltosos() {
  const alunos = await prisma.aluno.findMany({
    where: { presente: false },
  });
  return alunos;
}

export async function getFaltososPorTurma(turma: string) {
  const alunos = await prisma.aluno.findMany({
    where: { turma, presente: false },
  });
  return alunos;
}
