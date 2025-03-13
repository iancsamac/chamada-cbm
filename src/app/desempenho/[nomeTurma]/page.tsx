
import { getAlunosPorTurma } from '@/service/util';
import { Aluno } from '@/types';
import Image from 'next/image';
import React from 'react';
import gold from '@/assets/medal-gold.svg'
import silver from '@/assets/medal-silver.svg'
import bronze from '@/assets/medal-bronze.svg'
import Link from 'next/link';

interface AlunoDesempenho extends Aluno {
    valor: number;
}


const HankingStatus = ({legenda, alunos, tipo}: {legenda: string, alunos: AlunoDesempenho[], tipo: 'rep' | 'tempo'}) => {
    return (
        <div className="flex items-center justify-between p-4 flex-col w-full">
            <h1 className='text-lg font-bold text-gray-700 w-full text-center bg-gray-200 p-2 rounded-md mb-4'>{legenda}</h1>
            <div className="flex items-center justify-between w-full">
                    <div className="flex items-center justify-between flex-col gap-2 w-full">
                       {alunos.map((aluno, index) => {
                        return (
                                <div key={aluno.id} className={`flex items-center justify-between bg-gray-200 p-2 rounded-md w-full ${index > 2 ? 'bg-gray-200' : 'bg-red-200'}`}>
                                <div className='flex justify-between w-full px-2 gap-4'>
                                    <div className='flex items-center gap-2'>
                                        {index <= 2 ? (
                                            <Image src={index === 0 ? gold : index === 1 ? silver : bronze} alt="medal" width={20} height={20} />
                                        ) : (
                                            <div>{index + 1}.</div>
                                        )}
                                        {aluno.nome}
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            {tipo === 'rep' ? `${aluno.valor} rep's` : `${new Date(aluno.valor * 1000).toISOString().slice(11, 19)}`}
                                        </div>
                                </div>
                                </div>
                            )}
                        )
                       }
                    </div>
            </div>
        </div>
    );
};

const Page = async ({ params }: { params: Promise<{ nomeTurma: string }> }) => {
    const { nomeTurma } = await params;
    const alunos = await getAlunosPorTurma(nomeTurma.toUpperCase());
    return (
        <div className='relative max-w-5xl mx-auto'>
            <div className="flex items-center justify-between p-4 flex-col">
                <h1 className='text-2xl font-bold'>Hanking da Turma {nomeTurma.toUpperCase()}</h1>
                <HankingStatus 
                    legenda="Hanking de Flexão" 
                    alunos={alunos.sort((a, b) => (b.maxFlexao ?? 0) - (a.maxFlexao ?? 0)).slice(0, 10).map((aluno) => ({...aluno, valor: aluno.maxFlexao ?? 0}))} 
                    tipo="rep"
                />
                <HankingStatus 
                    legenda="Hanking de Barra" 
                    alunos={alunos.sort((a, b) => (b.maxBarra ?? 0) - (a.maxBarra ?? 0)).slice(0, 10).map((aluno) => ({...aluno, valor: aluno.maxBarra ?? 0}))} 
                    tipo="rep"
                />
                <HankingStatus 
                    legenda="Hanking de Natação 50m" 
                    alunos={alunos.sort((a, b) => (b.tempoNatacao50m ?? 0) - (a.tempoNatacao50m ?? 0)).slice(0, 10).map((aluno) => ({...aluno, valor: aluno.tempoNatacao50m ?? 0}))} 
                    tipo="tempo"
                />
                <HankingStatus 
                    legenda="Hanking de Corrida 1000m" 
                    alunos={alunos.sort((a, b) => (b.tempoCorrida1000m ?? 0) - (a.tempoCorrida1000m ?? 0)).slice(0, 10).map((aluno) => ({...aluno, valor: aluno.tempoCorrida1000m ?? 0}))} 
                    tipo="tempo"
                />
                <HankingStatus 
                    legenda="Hanking de Corrida 2400m" 
                    alunos={alunos.sort((a, b) => (b.tempoCorrida2400m ?? 0) - (a.tempoCorrida2400m ?? 0)).slice(0, 10).map((aluno) => ({...aluno, valor: aluno.tempoCorrida2400m ?? 0}))} 
                    tipo="tempo"
                />
                <HankingStatus 
                    legenda="Hanking de Abdominal" 
                    alunos={alunos.sort((a, b) => (b.maxAbdominal ?? 0) - (a.maxAbdominal ?? 0)).slice(0, 10).map((aluno) => ({...aluno, valor: aluno.maxAbdominal ?? 0}))} 
                    tipo="rep"
                />
            </div>
            <div className='bottom-10 right-10'>
                <Link href={`/desempenho/${nomeTurma}/atualizar`}>
                    <button className='bg-red-400 p-2 rounded-full w-20 h-20 fixed bottom-10 right-10 cursor-pointer'>
                        Meus dados
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Page;
