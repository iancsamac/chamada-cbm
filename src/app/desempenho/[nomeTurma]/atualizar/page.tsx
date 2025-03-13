import { getAlunosPorTurma } from '@/service/util';
import { Aluno } from '@/types';
import React from 'react';
import { DesempenhoForm } from './form';

const Page = async ({ params }: { params: Promise<{ nomeTurma: string }> }) => {
    const { nomeTurma } = await params;
    const alunos: Aluno[] = await getAlunosPorTurma(nomeTurma.toUpperCase());

    return (
        <div className='relative max-w-5xl mx-auto p-4'>
            <DesempenhoForm alunos={alunos} nomeTurma={nomeTurma} />
        </div>
    );
};

export default Page;
