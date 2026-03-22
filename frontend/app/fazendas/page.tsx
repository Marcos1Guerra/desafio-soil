"use client";

import { useEffect, useState } from "react";
import { Search, MapPin } from "lucide-react";
import BottomNav from "../components/BottomNav";
import { getSession } from "next-auth/react";
import Link from "next/link";

// Definindo o formato do dado que vem do banco
interface Farm {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
}

export default function FazendasPage() {
  const [fazendas, setFazendas] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFazendas() {
      // Pega a sessão atual (onde está o nosso Token JWT)
      const session = await getSession();
      if (!session) return;

      try {
        // Faz a requisição para o backend enviando o Token de autorização
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/farm`, {
          headers: {
            Authorization: `Bearer ${(session as any).accessToken}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          console.log("Dados que chegaram do backend:", data);
          setFazendas(data);
        }
      } catch (error) {
        console.error("Erro ao buscar fazendas:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFazendas();
  }, []);

  return (
    <main className="min-h-screen flex flex-col bg-[#F3F6E6] font-sans pb-24">
      {/* Cabeçalho */}
      <div className="relative h-48 w-full bg-gradient-to-r from-green-300 to-green-500 rounded-b-[40px] flex items-end p-6 shadow-sm overflow-hidden">
        <div className="absolute inset-0 bg-green-900/10"></div>
        <div className="relative w-full flex justify-between items-end text-black z-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Fazendas</h1>
            <p className="text-sm font-medium text-gray-800">
              selecione a fazenda desejada
            </p>
          </div>
          <div className="text-2xl font-bold tracking-widest text-gray-900">
            SOIL
          </div>
        </div>
      </div>

      {/* Barra de Busca */}
      <div className="px-6 mt-8">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-4 bg-white border-none rounded-full shadow-sm focus:ring-2 focus:ring-green-500 outline-none text-gray-700 placeholder-gray-400"
            placeholder="Procurar"
          />
        </div>
      </div>

      {/* Lista de Fazendas Dinâmica */}
      <div className="px-6 mt-8 flex flex-col gap-4">
        {loading ? (
          <p className="text-center text-green-700 font-medium mt-4">
            Carregando fazendas...
          </p>
        ) : fazendas.length === 0 ? (
          <p className="text-center text-green-700 font-medium mt-4">
            Nenhuma fazenda encontrada.
          </p>
        ) : (
          fazendas.map((fazenda) => (
            // Trocamos a <div> por um <Link> e passamos o ID da fazenda na URL
            <Link
              key={fazenda.id}
              href={`/pivos?farmId=${fazenda.id}`}
              className="bg-[#2B8B4B] text-white rounded-2xl p-5 shadow-md flex flex-col gap-1 cursor-pointer hover:bg-green-700 transition-colors"
            >
              <span className="font-semibold text-lg">
                Fazenda: {fazenda.name}
              </span>
              <div className="flex items-center gap-1 text-sm text-green-100 mt-1">
                <MapPin className="h-4 w-4" />
                <span>
                  Lat: {fazenda.latitude} | Lng: {fazenda.longitude}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>

      <BottomNav />
    </main>
  );
}
