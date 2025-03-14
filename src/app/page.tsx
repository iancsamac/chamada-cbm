'use client';

import { useState, useEffect } from 'react';
import { Aluno, ChamadaData } from '@/types';
import { getAlunos, marcarPresencaa } from '@/service/util';
export default function Home() {
  const [chamadaData, setChamadaData] = useState<ChamadaData>({
    data: new Date().toLocaleDateString('pt-BR'),
    turno: null,
    alunos: []
  });

  const [turmaSelecionada, setTurmaSelecionada] = useState<string>('');
  const [alunoSelecionado, setAlunoSelecionado] = useState<Aluno | null>(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const alunos2 = await getAlunos();
      setChamadaData({
        data: new Date().toLocaleDateString('pt-BR'),
        turno: (new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })).slice(0, 5) > '13:00' ? 'Tarde' : 'Manhã',
        alunos: alunos2
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  
  const turmas = [...new Set(chamadaData.alunos.map(aluno => aluno.turma))].sort();
  const alunosDaTurma = chamadaData.alunos.filter(aluno => aluno.turma === turmaSelecionada);

  const marcarPresenca = async (aluno: Aluno) => {
    if (!aluno.presente && !loading && chamadaData.turno) {
      setLoading(true);
      const alunosAtualizados = chamadaData.alunos.map(a => 
        a.id === aluno.id ? { ...a, presente: true } : a
      );

      try {
        await marcarPresencaa(aluno.id);

        setChamadaData(prev => ({
          ...prev,
          alunos: alunosAtualizados
        }));
        setAlunoSelecionado({ ...aluno, presente: true });
      } catch (error) {
        console.error('Erro ao salvar presença:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (

    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8 gap-2">
        <div>
          <h1 className="military-title  text-4xl mb-2">CORPO DE BOMBEIROS MILITAR</h1>
          <div className="text-gold font-semibold ">
            <span>Data: {chamadaData.data}</span>
            <span className="mx-3">|</span>
            <span>Turno: {chamadaData.turno || 'Não definido'}</span>
          </div>
        </div>

      </div>
      
      {!chamadaData.turno ? (
        <div className="max-w-md  mx-auto card p-6 rounded-lg pulse">
          <p className="text-center text-xl">
            ⚠️ Aguardando o xerife definir o turno da chamada
          </p>
        </div>
      ) : (
        <div className="max-w-md mx-auto space-y-6 ">
          {/* Seleção de Turma */}
          <div className="card p-6 rounded-lg border-2 border-gold bg-gray-200">
            <label className="block text-red-950 font-bold mb-2">
              Selecione a Turma:
            </label>
            <select
              className="select-military w-full p-3 rounded-lg border border-gold"
              value={turmaSelecionada}
              onChange={(e) => {
                setTurmaSelecionada(e.target.value);
                setAlunoSelecionado(null);
              }}
            >
              <option value="">Selecione uma turma</option>
              {turmas.map(turma => (
                <option key={turma} value={turma}>
                  Turma {turma}
                </option>
              ))}
            </select>
          </div>

          {/* Seleção de Aluno */}
          {turmaSelecionada && (
            <div className="card p-6 rounded-lg border-2 border-gold bg-gray-200">
              <label className="block text-red-950 font-bold mb-2">
                Selecione o Militar:
              </label>
              <select
                className="select-military w-full p-3 rounded-lg border border-gold"
                value={alunoSelecionado?.id || ''}
                onChange={(e) => {
                  const aluno = alunosDaTurma.find(a => a.id.toString() === e.target.value);
                  setAlunoSelecionado(aluno || null);
                }}
              >
                <option value="" className="text-gold">Selecione um militar</option>
                {alunosDaTurma.map(aluno => (
                  <option key={aluno.id} value={aluno.id}>
                    {`${aluno.id<=9 ? '0' : ''}${aluno.id <=99 ? '0' : ''}${aluno.id} - ${aluno.nome}`}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Cartão do Aluno Selecionado */}
          {alunoSelecionado && (
            <div className="card p-6 rounded-lg bg-gray-200 border-2 border-gold">
              <h3 className="text-xl font-bold mb-4 text-gold">{alunoSelecionado.nome}</h3>
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <p>Número: <span className="text-gold">{alunoSelecionado.id}</span></p>
                  <p>Turma: <span className="text-gold">{alunoSelecionado.turma}</span></p>
                  <p>
                    Status: {' '}
                    <span className={alunoSelecionado.presente ? 'text-green-400' : 'text-red-400'}>
                      {alunoSelecionado.presente ? 'Presente' : 'Não registrado'}
                    </span>
                  </p>
                </div>
                {!alunoSelecionado.presente && (
                  <button
                    onClick={() => marcarPresenca(alunoSelecionado)}
                    disabled={loading}
                    className={`button-military px-6 py-3 rounded-lg bg-green-500 text-gold ${loading ? 'opacity-50' : 'pulse'}`}
                  >
                    {loading ? 'Salvando...' : 'Marcar Presença'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
