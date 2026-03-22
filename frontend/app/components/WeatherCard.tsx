"use client";

import { useEffect, useState } from "react";
import { Cloud, Sun, CloudRain, Thermometer, Droplets } from "lucide-react";

export default function WeatherCard({ lat, lon }: { lat: number, lon: number }) {
  const [weather, setWeather] = useState<any>(null);

  useEffect(() => {
    async function fetchWeather() {
      const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_KEY;
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=pt_br&appid=${API_KEY}`
        );
        const data = await res.json();
        if (res.ok) setWeather(data);
      } catch (error) {
        console.error("Erro ao buscar clima:", error);
      }
    }
    fetchWeather();
  }, [lat, lon]);

  if (!weather) return <div className="text-xs opacity-50">Carregando clima...</div>;

  return (
    <div className="bg-white/40 backdrop-blur-md rounded-3xl p-4 flex justify-between items-center shadow-sm border border-white/50 mt-4">
      <div className="flex items-center gap-3">
        {weather.weather[0].main === "Clear" ? <Sun className="text-yellow-500" /> : <Cloud className="text-gray-500" />}
        <div>
          <span className="text-2xl font-black">{Math.round(weather.main.temp)}°C</span>
          <p className="text-[10px] uppercase font-bold opacity-60">{weather.weather[0].description}</p>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="flex flex-col items-center">
          <Droplets size={14} className="text-blue-500" />
          <span className="text-[10px] font-bold">{weather.main.humidity}%</span>
        </div>
        <div className="flex flex-col items-center">
          <Thermometer size={14} className="text-red-400" />
          <span className="text-[10px] font-bold">{Math.round(weather.main.feels_like)}°</span>
        </div>
      </div>
    </div>
  );
}