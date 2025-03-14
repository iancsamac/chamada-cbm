'use client'
export default function ButtonP() {
    return (
        <button className="bg-red-500 text-white p-2 rounded-md print:hidden" onClick={() => window.print()}>Imprimir</button>
    )
}