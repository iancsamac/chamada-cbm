export interface Aluno {
  Numero: number;
  Turma: string;
  "Nome de Guerra": string;
  Presente: boolean;
  Motivo: string;
}

export interface ChamadaData {
  data: string;
  turno: "Manhã" | "Tarde" | null;
  alunos: Aluno[];
} 