'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Aluno, ChamadaData } from '@/types';
import { getAlunos, resetarChamadaa, atualizarMotivoo, marcarPresencaa, removerPresencaa } from '@/service/util';

export default function Xerife() {
  const [chamadaData, setChamadaData] = useState<ChamadaData>({
    data: new Date().toLocaleDateString('pt-BR'),
    turno: null,
    alunos: []
  });
  const [loading, setLoading] = useState(false);
  const [turmasExpandidas, setTurmasExpandidas] = useState<{[key: string]: boolean}>({});


  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const alunos2 = await getAlunos();
      setChamadaData({
        data: new Date().toLocaleDateString('pt-BR'),
        turno: "Manhã",
        alunos: alunos2
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const turmas = [...new Set(chamadaData.alunos.map(aluno => aluno.turma))].sort();

  const toggleTurma = (turma: string) => {
    setTurmasExpandidas(prev => ({
      ...prev,
      [turma]: !prev[turma]
    }));
  };

  const update = (numeroAluno: number, motivo: string) => {
    setChamadaData(prev => ({
      ...prev,
      alunos: prev.alunos.map(aluno =>
        aluno.id === numeroAluno ? { ...aluno, motivo: motivo } : aluno
      )
    }));
  }



  const atualizarMotivo = async (numeroAluno: number, motivo: string) => {
    if (loading) return;

    setLoading(true);
    const alunosAtualizados = chamadaData.alunos.map(aluno =>
      aluno.id === numeroAluno ? { ...aluno, motivo: motivo } : aluno
    );

    try {
      const dadosAtualizados = {
        ...chamadaData,
        alunos: alunosAtualizados
      };

      await atualizarMotivoo(numeroAluno, motivo);

      setChamadaData(dadosAtualizados);
    } catch (error) {
      console.error('Erro ao salvar motivo:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetarChamada = async (turma?: string) => {
    if (loading || !chamadaData.turno) return;

    if (!confirm('ATENÇÃO! Tem certeza que deseja resetar a chamada? Isso irá marcar todos os militares como ausentes.')) {
      return;
    }

    setLoading(true);
    try {
      let alunosResetados: Aluno[] = [];
      if (turma) {
        alunosResetados = chamadaData.alunos.filter(aluno => aluno.turma === turma).map(aluno => ({
          ...aluno,
          presente: false,
          motivo: ''
        }));
      } else {
        alunosResetados = chamadaData.alunos.map(aluno => ({
          ...aluno,
          presente: false,
          motivo: ''
        }));
      }

      const dadosAtualizados = {
        ...chamadaData,
        alunos: chamadaData.alunos.map(aluno => {
          const atualizado = alunosResetados.find(a => a.id === aluno.id);
          return atualizado || aluno;
        })
      };

      await resetarChamadaa(turma);

      setChamadaData(dadosAtualizados);
    } catch (error) {
      console.error('Erro ao resetar chamada:', error);
    } finally {
      setLoading(false);
    }
  };

  const atualizarTurno = async (novoTurno: "Manhã" | "Tarde") => {
    if (loading) return;

    setLoading(true);
    try {
      const dadosAtualizados = {
        ...chamadaData,
        turno: novoTurno
      };

      await fetch('/api/presenca', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosAtualizados),
      });

      setChamadaData(dadosAtualizados);
    } catch (error) {
      console.error('Erro ao atualizar turno:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAlunosPorTurma = (turma: string) => {
    return chamadaData.alunos.filter(aluno => aluno.turma === turma);
  };

  const getFaltososPorTurma = (turma: string) => {
    return getAlunosPorTurma(turma).filter(aluno =>  aluno.turma === turma && !aluno.presente);
  };

  const getFaltosos = () => {
    return chamadaData.alunos.filter(aluno => !aluno.presente);
  };

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
      } catch (error) {
        console.error('Erro ao salvar presença:', error);
      } finally {
        setLoading(false);
      }
    }
  }

  const removerPresenca = async (aluno: Aluno) => {
    if (aluno.presente && !loading && chamadaData.turno) {
      setLoading(true);
      const alunosAtualizados = chamadaData.alunos.map(a => 
        a.id === aluno.id ? { ...a, presente: false } : a
      );


      try {
        await removerPresencaa(aluno.id);

        setChamadaData(prev => ({
          ...prev,
          alunos: alunosAtualizados
        }));
      } catch (error) {
        console.error('Erro ao salvar presença:', error);
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="military-title text-4xl mb-2">ÁREA DO XERIFE</h1>
          <p className="text-gold font-semibold">Controle e Gestão da Chamada</p>
        </div>
        <Link 
          href="/" 
          className="button-military px-6 py-3 rounded-lg bg-red-950 text-amber-50"
        >
          Voltar para Chamada
        </Link>
      </div>

      <div className="card p-2 rounded-lg mb-8">
        <div className="flex items-center justify-between flex-col gap-4">
          <div className="flex items-center gap-6">
            <div>
              <span className="text-gold font-bold">Data:</span>
              <span className="ml-2">{chamadaData.data}</span>
            </div>
            <div>
              <span className="text-gold font-bold">Turno:</span>
              <select
                className="select-military ml-2 p-2 rounded-lg"
                value={chamadaData.turno || ''}
                onChange={(e) => atualizarTurno(e.target.value as "Manhã" | "Tarde")}
                disabled={loading}
              >
                <option value="">Selecione</option>
                <option value="Manhã">Manhã</option>
                <option value="Tarde">Tarde</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2">
          <button
            onClick={() => resetarChamada()}
            disabled={loading || !chamadaData.turno}
            className={`button-military px-6 py-3 rounded-lg bg-red-950 text-amber-50 cursor-pointer ${
              loading || !chamadaData.turno ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            ⚠️ Resetar Chamada
          </button>
          <Link href="/relatorio">
          <button 
            disabled={loading || !chamadaData.turno}
            className={`button-military px-6 py-3 rounded-lg bg-red-950 text-amber-50 cursor-pointer ${
              loading || !chamadaData.turno ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Relatório Completo
          </button>
          </Link>
          </div>
        </div>
      </div>

      <div className="space-y-4">
      <div>

      {getFaltosos().length > 0 ? (
                <div>
                  <p>Faltosos: {getFaltosos().length}</p>
                </div>
              ) : (
                <p>Sem alterações</p>
              )}
      </div>

        {turmas.map(turma => {
          const faltosos = getFaltososPorTurma(turma);
          const alunos = getAlunosPorTurma(turma);
          const isExpanded = turmasExpandidas[turma];
          return (

            
              
            <div className="flex items-center relative" key={turma+'-turma'}>
            <div key={turma} className="card rounded-lg overflow-hidden bg-red-950/50 w-full">
              <button
                onClick={() => toggleTurma(turma)}
                className="w-full p-2 text-left flex justify-between items-center hover:bg-black/30 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <h2 className="text-lg font-bold inline-flex items-center">
                    <span className="text-gold">Turma {turma}</span>
                    {faltosos.length > 0 ? (
                      <span className="badge-military ml-3 text-sm bg-red-100 text-red-600 rounded-md px-1">
                        {faltosos.length} {faltosos.length === 1 ? 'faltoso' : 'faltosos'}
                      </span>
                    ) : (
                      <span className="badge-military badge-success ml-3 text-sm bg-green-100 text-green-600 rounded-md px-2">
                        Sem alteração
                      </span>
                    )}
                  </h2>
                </div>
                <svg
                  className={`w-6 h-6 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                
              </button>
              
              {isExpanded && (
                <div className=" bg-white pt-2">
                    <div className="flex flex-col gap-2">
                      {alunos.map(aluno => (
                        !aluno.presente ? (
                        <div key={aluno.id} className=" pb-4 last:border-b-0 border p-4 border-red-950 rounded-lg">
                          <p className="font-bold text-gold">{(aluno.id < 10 ? '0' : '') + (aluno.id < 100 ? '0' : '') + aluno.id} - {aluno.nome}</p>
                          <div className="mt-2">
                            <label className="block text-sm mb-1">
                              Motivo da falta:
                            </label>
                              <form action={() => atualizarMotivo(aluno.id, aluno.motivo || '')}>
                              <textarea
                              className="textarea-military w-full p-2 rounded-lg border border-red-950"
                              rows={2}
                              value={aluno.motivo || '' }
                              onChange={(e) => update(aluno.id, e.target.value)}
                              placeholder="Digite o motivo da falta..."
                              disabled={loading}
                            />
                            <div className='flex justify-between'>
                              <button type="submit" className="button-military px-6 py-3 rounded-lg bg-red-950 text-amber-50">Salvar</button>
                              <button onClick={()=>{marcarPresenca(aluno)}} className="button-military px-6 py-3 rounded-lg bg-green-500 text-amber-50">Marcar Presença</button>
                            </div>

                            <br />
                            </form>
                            
                          </div>
                        </div>
                      ) : (
                        <div key={aluno.id} className=" pb-4 last:border-b-0 border p-4 border-red-950 rounded-lg">
                          <p className="font-bold text-gold">{(aluno.id < 10 ? '0' : '') + (aluno.id < 100 ? '0' : '') + aluno.id} - {aluno.nome}</p>
                          <p className="text-green-400 font-semibold p-4">Presente</p>
                          <button onClick={()=>{removerPresenca(aluno)}} className="button-military px-6 py-3 rounded-lg bg-red-950 text-amber-50">Remover Presença</button>

                        </div>
                      )
                      ))}
                    </div>
                </div>
              )}
            </div>
            <Link href={`/relatorio/${turma}`}>
              <button className="button-military px-3 py-2.5 rounded-lg cursor-pointer bg-red-950 text-amber-50 absolute top-0 right-22">Relatório</button>
            </Link>
              <button onClick={() => resetarChamada(turma)} className="button-military px-3 py-2.5 rounded-lg cursor-pointer bg-red-950 text-amber-50 absolute top-0 right-0">Resetar</button>

            </div>
          );
        })}
      </div>
    </div>
  );
} 