import { getAlunos } from "@/service/util";
import ButtonP from "./buttonP";
export default async function Relatorio() {
    const alunos = await getAlunos();
    const turmas = alunos.map((aluno) => aluno.turma);
    const turmasUnicas = [...new Set(turmas)];
  return (
    <div className="flex flex-col items-center justify-center mx-auto  p-4">
        <ButtonP />
      <h1 className="text-2xl font-bold">Relatório de Presença</h1>
      <div className="flex flex-row gap-10 w-max-2xl w-min-[300px] b">
        <h1>Data: {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}</h1>
        <h1>Turno: {(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })).slice(0, 5) > '13:00' ? 'Tarde' : 'Manhã'}</h1>
      </div>
      <div className="flex flex-col items-center justify-center w-max-2xl w-min-[300px] b">
        <div className="flex flex-col justify-center w-full  gap-4">
          {turmasUnicas.map((turma) => (
            <div key={turma}>
              <h2 className="text-2xl font-bold">Turma {turma}</h2>
              <div className="flex flex-col justify-center w-full  ">
                <table className="min-w-full border  border-gray-300 rounded-lg overflow-hidden shadow-md p-2" key={turma+'-table'}>
                  <thead className="bg-gray-800 text-white p-2">
                    <tr className="bg-gray-800 text-white p-2">
                      <th className="px-2">Numero</th>
                      <th className="px-2">Nome</th>
                      <th className="px-2">Presença</th>
                      <th className="px-2">Motivo</th>
                    </tr>
                  </thead>
                  <tbody>
                  {alunos.filter((aluno) => aluno.turma === turma).map((aluno) => (
                    <tr key={aluno.id} className={`${aluno.id % 2 === 0 ? 'bg-gray-100' : 'bg-gray-300'}`}>
                      <td className="px-2">{`${(aluno.id < 100) ? '0':''}${aluno.id < 10 ? '0':''}${aluno.id}`}</td>
                      <td className="px-2">{aluno.nome}</td>
                      <td className="px-2">{aluno.presente ? "Sim" : "Não"}</td>
                      <td className="px-2">{!aluno.presente ? aluno.motivo || 'Motivo não informado' : 'Não se aplica'}</td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}