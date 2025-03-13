'use client'
import { Aluno, Desempenho } from "@/types";
import React,{ useState } from "react";
import { atualizarDesempenho } from "@/service/util";

export const DesempenhoForm = ({alunos, nomeTurma}: {alunos: Aluno[], nomeTurma: string}) => {
    const [aluno, setAluno] = useState<Aluno | null>(null);
    const [flexao, setFlexao] = useState(aluno?.maxFlexao || 0);
    const [barra, setBarra] = useState(aluno?.maxBarra || 0);
    const [natação, setNatação] = useState(aluno?.tempoNatacao50m || 0);
    const [corrida1000m, setCorrida1000m] = useState(aluno?.tempoCorrida1000m || 0);
    const [corrida2400m, setCorrida2400m] = useState(aluno?.tempoCorrida2400m || 0);
    const [abdominal, setAbdominal] = useState(aluno?.maxAbdominal || 0);


    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const alunoId = parseInt(e.target.value);
        const alunoSelecionado = alunos.find(a => a.id === alunoId);
        setAluno(alunoSelecionado || null);
        setFlexao(alunoSelecionado?.maxFlexao || 0);
        setBarra(alunoSelecionado?.maxBarra || 0);
        setNatação(alunoSelecionado?.tempoNatacao50m || 0);
        setCorrida1000m(alunoSelecionado?.tempoCorrida1000m || 0);
        setCorrida2400m(alunoSelecionado?.tempoCorrida2400m || 0);
        setAbdominal(alunoSelecionado?.maxAbdominal || 0);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        if (!aluno) {
            alert('Selecione um militar');
            return;
        }
        e.preventDefault();
        const desempenho: Desempenho = {
            flexao,
            barra,
            natação,
            corrida1000m,
            corrida2400m,
            abdominal,
        };

        await atualizarDesempenho(aluno?.id || 0, desempenho);
        window.location.href = `/desempenho/${nomeTurma}`;
    };

    return (
        <div>
            <div className="flex items-center justify-between p-4 flex-col">
                <h1>Atualizar dados do aluno da turma {nomeTurma.toUpperCase()}</h1>
            </div>
            <div className="card p-6 rounded-lg border-2 border-gold bg-gray-200">
              <label className="block text-red-950 font-ld mb-2">
                Selecione o Militar:
              </label>
              <select
                className="select-military w-full p-3 rounded-lg border border-gold"
                onChange={handleChange}
              >
                <option key={0} value="" className="text-gold" >Selecione um militar</option>
                {alunos.map(aluno => (
                        <option key={aluno.id} value={aluno.id}>
                            {`${aluno.id<=9 ? '0' : ''}${aluno.id <=99 ? '0' : ''}${aluno.id} - ${aluno.nome}`}
                        </option>
                ))}
              </select>
            </div>
            <form className="card flex flex-col gap-4 py-4 font-bold" onSubmit={handleSubmit}>
                <label className="flex bg-gray-200 px-2 py-4 rounded-lg gap-2 border-2 border-gold items-center justify-between">
                    <div>
                    Flexão 
                    </div>
                        <div className="flex items-center gap-2">
                        <button className="bg-red-950 text-white rounded-full h-8 w-8 font-extrabold border-2 border-gold" onClick={(e) => {
                            e.preventDefault();
                            setFlexao((flexao - 1) < 0 ? 0 : flexao - 1);
                        }}>-</button>
                        {flexao}
                        <button className="bg-red-950 text-white rounded-full h-8 w-8 font-extrabold border-2 border-gold" onClick={(e) => {
                            e.preventDefault();
                            setFlexao(flexao + 1);
                        }}>+</button>
                        rep`s 
                    </div>
                </label>
                <label className="flex bg-gray-200 px-2 py-4 rounded-lg gap-2 border-2 border-gold items-center justify-between">
                    <div>
                        Barra
                    </div>
                        <div className="flex items-center gap-2">
                        <button className="bg-red-950 text-white rounded-full h-8 w-8 font-extrabold border-2 border-gold" onClick={(e) => {
                            e.preventDefault();
                            setBarra((barra - 1) < 0 ? 0 : barra - 1);
                        }}>-</button>
                        {barra}
                        <button className="bg-red-950 text-white rounded-full h-8 w-8 font-extrabold border-2 border-gold" onClick={(e) => {
                            e.preventDefault();
                            setBarra(barra + 1);
                        }}>+</button>
                        rep`s 
                    </div>
                </label><label className="flex bg-gray-200 p-4 rounded-lg gap-2 border-2 border-gold items-center justify-between">
                    <div className="w-full">
                        Natação 50m
                    </div>
                    <div className="flex items-center gap-1">
                        <button className="bg-red-950 text-white rounded-full h-8 w-8 font-extrabold border-2 border-gold" onClick={(e) => {
                            e.preventDefault();
                            setNatação((natação - 60) < 0 ? 0 : natação - 60);
                        }}>-</button>
                        {Math.floor(natação/60)}
                        <button className="bg-red-950 text-white rounded-full h-8 w-8 font-extrabold border-2 border-gold" onClick={(e) => {
                            e.preventDefault();
                            setNatação(natação + 60);
                        }}>+</button>
                        min 
                    </div>
                    <div className="flex items-center gap-1">
                        <button className="bg-red-950 text-white rounded-full h-8 w-8 font-extrabold border-2 border-gold" onClick={(e) => {
                            e.preventDefault();
                            setNatação((natação - 1) < 0 ? 0 : natação - 1);
                        }}>-</button>
                        {natação%60}
                        <button className="bg-red-950 text-white rounded-full h-8 w-8 font-extrabold border-2 border-gold" onClick={(e) => {
                            e.preventDefault();
                            setNatação(natação + 1);
                        }}>+</button>
                        sec 
                    </div>
                </label>
                <label className="flex bg-gray-200 px-2 py-4 rounded-lg gap-2 border-2 border-gold items-center justify-between">
                    <div className="w-full">
                        Corrida 1km
                    </div>
                    <div className="flex items-center gap-1">
                        <button className="bg-red-950 text-white rounded-full h-8 w-8 font-extrabold border-2 border-gold" onClick={(e) => {
                            e.preventDefault();
                            setCorrida1000m((corrida1000m - 60) < 0 ? 0 : corrida1000m - 60);
                        }}>-</button>
                        {Math.floor(corrida1000m/60)}
                        <button className="bg-red-950 text-white rounded-full h-8 w-8 font-extrabold border-2 border-gold" onClick={(e) => {
                            e.preventDefault();
                            setCorrida1000m(corrida1000m + 60);
                        }}>+</button>
                        min 
                    </div>
                    <div className="flex items-center gap-1">
                        <button className="bg-red-950 text-white rounded-full h-8 w-8 font-extrabold border-2 border-gold" onClick={(e) => {
                            e.preventDefault();
                            setCorrida1000m((corrida1000m - 1) < 0 ? 0 : corrida1000m - 1);
                        }}>-</button>
                        {corrida1000m%60}
                        <button className="bg-red-950 text-white rounded-full h-8 w-8 font-extrabold border-2 border-gold" onClick={(e) => {
                            e.preventDefault();
                            setCorrida1000m(corrida1000m + 1);
                        }}>+</button>
                        sec 
                    </div>
                </label>
                <label className="flex bg-gray-200 px-2 py-4 rounded-lg gap-2 border-2 border-gold items-center justify-between">
                    <div className="w-full">
                        Corrida 2.4km
                    </div>
                    <div className="flex items-center gap-1">
                        <button className="bg-red-950 text-white rounded-full h-8 w-8 font-extrabold border-2 border-gold" onClick={(e) => {
                            e.preventDefault();
                            setCorrida2400m((corrida2400m - 60) < 0 ? 0 : corrida2400m - 60);
                        }}>-</button>
                        {Math.floor(corrida2400m/60)}
                        <button className="bg-red-950 text-white rounded-full h-8 w-8 font-extrabold border-2 border-gold" onClick={(e) => {
                            e.preventDefault();
                            setCorrida2400m(corrida2400m + 60);
                        }}>+</button>
                        min 
                    </div>
                    <div className="flex items-center gap-1">
                        <button className="bg-red-950 text-white rounded-full h-8 w-8 font-extrabold border-2 border-gold" onClick={(e) => {
                            e.preventDefault();
                            setCorrida2400m((corrida2400m - 1) < 0 ? 0 : corrida2400m - 1);
                        }}>-</button>
                        {corrida2400m%60}
                        <button className="bg-red-950 text-white rounded-full h-8 w-8 font-extrabold border-2 border-gold" onClick={(e) => {
                            e.preventDefault();
                            setCorrida2400m(corrida2400m + 1);
                        }}>+</button>
                        sec 
                    </div>
                </label>
                <label className="flex bg-gray-200 px-2 py-4 rounded-lg gap-2 border-2 border-gold items-center justify-between">
                    <div>
                        Abdominal
                    </div>
                        <div className="flex items-center gap-2">
                        <button className="bg-red-950 text-white rounded-full h-8 w-8 font-extrabold border-2 border-gold" onClick={(e) => {
                            e.preventDefault();
                            setAbdominal((abdominal - 1) < 0 ? 0 : abdominal - 1);
                        }}>-</button>
                        {abdominal}
                        <button className="bg-red-950 text-white rounded-full h-8 w-8 font-extrabold border-2 border-gold" onClick={(e) => {
                            e.preventDefault();
                            setAbdominal(abdominal + 1);
                        }}>+</button>
                        rep`s 
                    </div>
                </label>
                <button type="submit" className="bg-red-950 text-white font-bold p-4 rounded-lg border-2 border-gold">Atualizar</button>
            </form>
        </div>
    )
}