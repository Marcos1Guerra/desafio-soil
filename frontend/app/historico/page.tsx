"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  ChevronRight,
  Droplet,
  RotateCw,
  Map,
  ChevronLeft
} from "lucide-react";
import BottomNav from "../components/BottomNav";
import { getSession } from "next-auth/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DetailsViewProps {
  state: any;
  onBack: () => void;
}

export default function HistoricoPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedState, setSelectedState] = useState<any | null>(null);

  // ESTADOS PARA O FILTRO
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  async function fetchHistory(isFilter = false) {
    const session = await getSession();
    if (!session) return;
    
    setLoading(true);
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/pivot/5d62287c-2bc7-483f-83ed-638d7eb904a3/history`;
      
      // Adiciona query params se houver filtro
      if (isFilter && startDate) {
        url += `?start=${startDate}${endDate ? `&end=${endDate}` : ''}`;
      }

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${(session as any).accessToken}`,
        },
      });
      if (res.ok) setHistory(await res.json());
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSearch = () => {
    console.log("Botão Pesquisar clicado!", { startDate, endDate }); 
    fetchHistory(true);
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    fetchHistory(false);
  };

  if (selectedState) {
    return <DetailsView state={selectedState} onBack={() => setSelectedState(null)} />;
  }

  return (
    <main className="min-h-screen bg-[#F3F6E6] pb-24 font-sans text-[#1A4D2E]">
      <div className="relative h-25 w-full bg-[#E8F0D1] flex flex-col p-6 shadow-sm">
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-black text-[#1A4D2E]">Histórico</h1>
          <Map className="h-6 w-6" />
        </div>
        <span className="text-sm font-bold opacity-70">Pivô 1</span>
      </div>

      <div className="px-6">
        <div className="bg-white rounded-[30px] p-8 shadow-md flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <h3 className="text-center text-sm font-bold text-green-700 uppercase tracking-widest mb-1">Início:</h3>
            <div className="flex items-center gap-2 border-b border-gray-200 pb-1">
              <Calendar size={18} className="text-gray-800" />
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-xs w-full outline-none text-gray-700 bg-transparent"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-center text-sm font-bold text-green-700 uppercase tracking-widest mb-1">Término:</h3>
            <div className="flex items-center gap-2 border-b border-gray-200 pb-1">
              <Calendar size={18} className="text-gray-800" />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-xs w-full outline-none text-gray-700 bg-transparent"
              />
            </div>
          </div>

          <div className="flex gap-4 mt-2">
            <button 
              onClick={handleClear}
              className="flex-1 bg-red-500 text-white py-3 rounded-full font-bold text-sm shadow-md active:scale-95 transition-transform"
            >
              Limpar
            </button>
            <button 
              onClick={handleSearch}
              className="flex-1 bg-[#2B8B4B] text-white py-3 rounded-full font-bold text-sm shadow-md active:scale-95 transition-transform"
            >
              {loading ? "Buscando..." : "Pesquisar"}
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 mt-6 flex flex-col gap-4">
        {history.length === 0 && !loading && (
          <p className="text-center opacity-50 text-sm mt-4">Nenhum registro encontrado.</p>
        )}
        {history.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedState(item)}
            className="bg-[#2B8B4B] text-white rounded-2xl p-4 shadow-sm cursor-pointer"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold">Pivô 1</span>
              <button className="text-[10px] flex items-center gap-1 opacity-80 uppercase">
                Mais detalhes <ChevronRight size={12} />
              </button>
            </div>
            <div className="grid grid-cols-2 text-[11px]">
              <div>
                <p className="opacity-70">Ligado:</p>
                <p className="font-bold">{new Date(item.timestamp).toLocaleDateString()} - {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-4">
                   <div className="flex flex-col items-center">
                    <span className="opacity-70">Estado:</span>
                    <div className={`${item.isIrrigating ? 'bg-blue-400' : 'bg-gray-400'} p-1 rounded-full`}>
                      <Droplet size={12} />
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="opacity-70">Sentido:</span>
                    <RotateCw size={14} className={item.direction === 'CCW' ? 'scale-x-[-1]' : ''} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <BottomNav />
    </main>
  );
}

function DetailsView({ state, onBack }: DetailsViewProps) {
  const timelineEvents = [
    { 
      time: new Date(state.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
      desc: 'Ligado ' + (state.isIrrigating ? 'com água' : 'sem água'), 
      color: state.isIrrigating ? 'bg-blue-400' : 'bg-[#98B649]' 
    },
    { time: '---', desc: 'Desligado', color: 'bg-gray-500' },
  ];

  const chartData = state.cycle?.map((c: any) => ({
    time: new Date(c.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    value: c.percentimeter || 0,
  })) || [];

  return (
    <main className="min-h-screen bg-[#F3F6E6] pb-24 font-sans text-[#1A4D2E]">
      <div className="relative h-44 w-full bg-gradient-to-b from-black/40 to-transparent flex flex-col p-6 overflow-hidden rounded-b-[40px]">
        <div className="absolute inset-0 -z-10 bg-[url('https://images.unsplash.com/photo-1592982537447-7440770cbfc9?q=80&w=1000')] bg-cover bg-center opacity-70"></div>
        <div className="flex justify-between items-start mt-4">
          <button onClick={onBack} className="p-2 bg-white/30 rounded-full backdrop-blur-md">
            <ChevronLeft className="text-white" />
          </button>
          <div className="text-right">
            <h1 className="text-2xl font-black text-white leading-none">Histórico</h1>
            <span className="text-white/90 text-sm font-bold">Pivô 1</span>
          </div>
          <Map className="text-white h-6 w-6" />
        </div>
      </div>

      <div className="px-6 flex flex-col gap-6 mt-6">
        <h2 className="text-xl font-black text-center text-green-800 uppercase tracking-widest">Histórico específico</h2>
        <div className="bg-[#E8F0D1] p-5 rounded-3xl shadow-sm grid grid-cols-2 gap-x-4 border border-green-200">
            <div className="border-r border-green-200 pr-4">
              <span className="text-[10px] font-bold text-green-700 uppercase">Ligado</span>
              <p className="text-xs font-bold">{new Date(state.timestamp).toLocaleString()}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-green-700 uppercase">Desligado</span>
              <p className="text-xs font-bold">---</p>
            </div>
            <div className="flex items-center gap-4 mt-4 col-span-2 justify-center border-t border-green-200 pt-4">
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold opacity-60 uppercase">Estado</span>
                <div className={`p-1.5 rounded-full ${state.isIrrigating ? 'bg-blue-400' : 'bg-red-500'}`}>
                  <Droplet size={14} className="text-white" />
                </div>
              </div>
              <div className="flex flex-col items-center border-x border-green-200 px-6">
                <span className="text-[10px] font-bold opacity-60 uppercase">Percentímetro</span>
                <span className="text-2xl font-black text-green-700">{state.percentimeter || 0}%</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] font-bold opacity-60 uppercase">Sentido</span>
                <RotateCw size={20} className={state.direction === 'CCW' ? 'scale-x-[-1]' : ''} />
              </div>
            </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute left-[33px] top-8 bottom-8 w-0.5 bg-gray-200"></div>
          {timelineEvents.map((ev, idx) => (
            <div key={idx} className="flex items-center gap-4 z-10">
              <span className="text-[10px] font-bold text-gray-700 w-12 text-right">{ev.time}</span>
              <div className={`w-4 h-4 rounded-full ${ev.color} border-4 border-white shadow-sm`}></div>
              <p className="text-xs font-bold text-gray-900">{ev.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-4">
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: -30, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F0F0F0" />
                <XAxis dataKey="time" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#00C4FF" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#00C4FF', strokeWidth: 2, stroke: '#FFF' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <BottomNav />
    </main>
  );
}