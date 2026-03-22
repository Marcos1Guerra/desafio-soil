"use client";

import { useEffect, useState, Suspense } from "react";
import {
  Search,
  Map,
  RotateCw,
  Droplet,
  ChevronLeft,
  Minus,
  Plus,
  Power,
} from "lucide-react";
import BottomNav from "../components/BottomNav";
import { getSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { io } from "socket.io-client";
import WeatherCard from "../components/WeatherCard";

interface Pivot {
  id: string;
  name: string;
  status: any;
  bladeAt100: number;
}

function PivosContent() {
  const [pivos, setPivos] = useState<Pivot[]>([]);
  const [angle, setAngle] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedPivot, setSelectedPivot] = useState<Pivot | null>(null);

  const [isOn, setIsOn] = useState(false);
  const [isIrrigating, setIsIrrigating] = useState(false);
  const [direction, setDirection] = useState("clockwise"); // clockwise ou counter
  const [percentimeter, setPercentimeter] = useState(63);

  const searchParams = useSearchParams();
  const farmId = searchParams.get("farmId");

  const handleConfirm = async () => {
    if (!selectedPivot) return;

    const session = await getSession();
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pivot/${selectedPivot.id}/command`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${(session as any).accessToken}`,
          },
          body: JSON.stringify({
            isOn,
            isIrrigating,
            direction,
            percentimeter,
          }),
        },
      );

      if (res.ok) {
        alert("Comando enviado com sucesso para o banco de dados!");
      } else {
        alert("Erro ao enviar comando.");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  useEffect(() => {
    async function fetchPivos() {
      const session = await getSession();
      if (!session) return;
      try {
        const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/pivot`);
        if (farmId) url.searchParams.append("farmId", farmId);
        const res = await fetch(url.toString(), {
          headers: { Authorization: `Bearer ${(session as any).accessToken}` },
        });
        if (res.ok) setPivos(await res.json());
      } catch (error) {
        console.error("Erro ao buscar pivôs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPivos();
  }, [farmId]);

  useEffect(() => {
    const socket = io("http://localhost:3001");

    if (selectedPivot) {
      const topic = `pivot-update-${selectedPivot.id}`;

      socket.on(topic, (data) => {
        console.log("📡 Telemetria recebida:", data);
        setIsOn(data.isOn);
        setIsIrrigating(data.isIrrigating);
        setDirection(data.direction);
        setPercentimeter(data.percentimeter);
        setAngle(data.angle); // <-- Captura o ângulo aqui
      });
    }

    socket.on("dashboard-update", (data) => {});

    return () => {
      socket.disconnect();
    };
  }, [selectedPivot]);

  // Função para limpar estados
  const handleClear = () => {
    setIsIrrigating(false);
    setDirection("clockwise");
    setPercentimeter(0);
  };

  // View de Listagem
  if (!selectedPivot) {
    return (
      <main className="min-h-screen bg-[#F3F6E6] pb-24">
        <div className="bg-[#E8F0D1] p-6 shadow-sm border-b border-green-200">
          <div className="flex justify-between items-center mb-4 pt-4">
            <h1 className="text-2xl font-bold text-gray-900">Pivôs</h1>
            <Map className="h-6 w-6 text-green-800" />
          </div>
          <div className="relative mt-4">
            <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
            <input
              className="w-full pl-11 pr-4 py-3 bg-white rounded-full outline-none"
              placeholder="Procurar"
            />
          </div>
        </div>

        <div className="px-6 mt-6 flex flex-col gap-4">
          {loading ? (
            <p className="text-center text-green-800">Carregando...</p>
          ) : (
            pivos.map((pivo) => (
              <div
                key={pivo.id}
                onClick={() => setSelectedPivot(pivo)}
                className="bg-[#2B8B4B] text-white rounded-2xl p-4 shadow-md cursor-pointer hover:scale-[1.02] transition-transform"
              >
                <div className="flex justify-between items-center border-b border-green-600/50 pb-2 mb-2">
                  <span className="font-semibold text-xl">{pivo.name}</span>
                  <Power className="h-5 w-5 text-green-300" />
                </div>
                <p className="text-sm opacity-90 text-green-100">
                  Clique para controlar
                </p>
              </div>
            ))
          )}
        </div>
        <BottomNav />
      </main>
    );
  }

  // View de Controle (Detalhes)
  return (
    <main className="min-h-screen bg-[#F3F6E6] pb-24 font-sans text-[#1A4D2E]">
      <div className="relative h-44 w-full bg-gradient-to-b from-black/40 to-transparent flex flex-col p-6 overflow-hidden rounded-b-[40px]">
        <div className="absolute inset-0 -z-10 bg-[url('https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=1000')] bg-cover bg-center opacity-70"></div>

        <div className="flex justify-between items-start mt-4">
          <button
            onClick={() => setSelectedPivot(null)}
            className="p-2 bg-white/30 rounded-full backdrop-blur-md"
          >
            <ChevronLeft className="text-white" />
          </button>
          <div className="text-right">
            <h1 className="text-2xl font-black text-white leading-none">
              Pivôs
            </h1>
            <span className="text-white/90 text-sm font-bold">
              {selectedPivot.name}
            </span>
          </div>
          <Map className="text-white h-6 w-6" />
        </div>
      </div>

      {/* Barra Bege de Status (O que já tínhamos) 
      <div className="px-4 -mt-10">
        <div className="bg-[#E8F0D1]/95 ...">
        </div>
        <WeatherCard
          lat={selectedPivot.latitude}
          lon={selectedPivot.longitude}
        />
      </div>*/}

      {/* Situação Atual do Pivô (Barra Bege) */}
      <div className="px-4 -mt-10">
        <div className="bg-[#E8F0D1]/95 backdrop-blur-md rounded-[30px] p-4 flex justify-between items-center shadow-md border border-white/50">
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold opacity-60">
              Estado:
            </span>
            <div className="bg-blue-400 p-1.5 rounded-full mt-1">
              <Droplet className="h-4 w-4 text-white" />
            </div>
          </div>
          <div className="flex flex-col items-center border-x border-green-200 px-4">
            <span className="text-[10px] uppercase font-bold opacity-60">
              Pressão: 56u
            </span>
            <span className="text-[10px] uppercase font-bold opacity-60 mt-1">
              Percentímetro: 63%
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold opacity-60">
              Sentido:
            </span>
            <RotateCw className="h-5 w-5 mt-1 text-green-800" />
          </div>
        </div>
      </div>

      {/* Seção de Ligar/Desligar do Figma */}
      <div className="flex flex-col items-center mt-6 gap-2">
        <p className="text-xs font-bold uppercase tracking-widest opacity-80">
          Situação atual do pivô
        </p>
        <div className="flex items-center gap-4">
          <span
            className={`text-xs font-bold ${!isOn ? "text-red-600" : "text-gray-400"}`}
          >
            Desligado
          </span>
          <button
            onClick={() => setIsOn(!isOn)}
            className={`w-14 h-7 rounded-full relative p-1 transition-colors ${isOn ? "bg-green-600" : "bg-gray-400"}`}
          >
            <div
              className={`w-5 h-5 bg-white rounded-full transition-all ${isOn ? "translate-x-7" : "translate-x-0"}`}
            />
          </button>
          <span
            className={`text-xs font-bold ${isOn ? "text-green-600" : "text-gray-400"}`}
          >
            Ligado
          </span>
        </div>
      </div>

      {/* Gráfico Circular Central */}
      <div className="flex justify-center my-4">
        <div className="relative w-44 h-44 rounded-full border-[10px] border-[#1A4D2E] bg-[#5DAE41] flex items-center justify-center overflow-hidden shadow-xl">
          {/* Fatias coloridas (Poderíamos usar um SVG aqui para ser mais fiel) */}
          <div
            className="absolute inset-0 bg-blue-400"
            style={{ clipPath: "polygon(50% 50%, 100% 0, 100% 100%)" }}
          ></div>

          <div className="w-2.5 h-2.5 bg-black rounded-full z-10 shadow-sm"></div>

          {/* PONTEIRO DINÂMICO: Ele agora gira conforme o 'angle' */}
          <div
            className="absolute top-1/2 left-1/2 w-1.5 h-16 bg-black origin-top -translate-x-1/2 rounded-full transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-50%) rotate(${angle}deg)` }} // <-- A mágica acontece aqui
          ></div>
        </div>
      </div>

      {/* Painel Modificar o Pivô */}
      <div className="px-6 flex flex-col gap-5">
        <h2 className="text-center font-bold text-sm uppercase tracking-widest border-b border-green-200 pb-2">
          Modificar o pivô
        </h2>

        {/* Toggle Estado: Água */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-bold uppercase opacity-60">
            Estado:
          </span>
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold opacity-70">Sem água</span>
            <button
              onClick={() => setIsIrrigating(!isIrrigating)}
              className={`w-14 h-7 rounded-full relative p-1 transition-colors ${isIrrigating ? "bg-blue-400" : "bg-gray-400"}`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-all ${isIrrigating ? "translate-x-7" : "translate-x-0"}`}
              />
            </button>
            <span className="text-xs font-bold text-blue-600">Com água</span>
          </div>
        </div>

        {/* Toggle Sentido: Reverso / Avanço */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] font-bold uppercase opacity-60">
            Sentido:
          </span>
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold opacity-70">Reverso</span>
            <button
              onClick={() =>
                setDirection(
                  direction === "clockwise" ? "counter" : "clockwise",
                )
              }
              className="w-14 h-7 bg-[#1A4D2E] rounded-full relative p-1"
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-all ${direction === "clockwise" ? "translate-x-7" : "translate-x-0"}`}
              />
            </button>
            <span className="text-xs font-bold text-green-700">Avanço</span>
          </div>
        </div>

        {/* Inputs de Lâmina e Percentímetro com botões +/- */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <span className="text-[10px] font-bold uppercase block mb-1">
              Lâmina:
            </span>
            <input
              type="text"
              value={`${((percentimeter / 100) * selectedPivot.bladeAt100).toFixed(1)}`}
              readOnly
              className="w-full bg-white rounded-md border border-gray-200 py-2 text-center font-bold shadow-sm"
            />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase block mb-1">
              Percentímetro:
            </span>
            <div className="flex items-center bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden">
              <button
                onClick={() => setPercentimeter(Math.max(0, percentimeter - 5))}
                className="px-1.5 py-2 text-green-600 active:bg-green-50"
              >
                <Minus size={14} />
              </button>
              <input
                type="text"
                value={percentimeter}
                readOnly
                className="w-full py-2 text-center font-bold outline-none text-sm"
              />
              <button
                onClick={() =>
                  setPercentimeter(Math.min(100, percentimeter + 5))
                }
                className="px-1.5 py-2 text-green-600 active:bg-green-50"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase block mb-1">
              Tempo:
            </span>
            <input
              type="text"
              value="0"
              readOnly
              className="w-full bg-white rounded-md border border-gray-200 py-2 text-center font-bold shadow-sm"
            />
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-4 mt-2">
          <button
            onClick={handleClear}
            className="flex-1 bg-red-500 text-white font-bold py-3.5 rounded-xl shadow-lg uppercase text-xs active:scale-95 transition-transform"
          >
            Limpar
          </button>
          <button
            className="flex-1 bg-[#2B8B4B] text-white font-bold py-3.5 rounded-xl shadow-lg uppercase text-xs active:scale-95 transition-transform"
            onClick={handleConfirm}
          >
            Confirmar
          </button>
        </div>
      </div>

      <BottomNav />
    </main>
  );
}

export default function PivosPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center text-green-800">
          Carregando interface...
        </div>
      }
    >
      <PivosContent />
    </Suspense>
  );
}
