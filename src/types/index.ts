import { Prisma } from "@prisma/client";

export interface Aluno extends Prisma.AlunoCreateInput {
  id: number;
}

export interface ChamadaData {
  data: string;
  turno: "Manhã" | "Tarde" | null;
  alunos: Aluno[];
} 

export interface Desempenho {
  flexao: number;
  barra: number;
  natação: number;
  corrida1000m: number;
  corrida2400m: number;
  abdominal: number;
}