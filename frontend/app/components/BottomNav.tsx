"use client";

import { Home, Zap, Calendar, Clock } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Fazendas", href: "/fazendas", icon: Home },
    { name: "Pivôs", href: "/pivos", icon: Zap }, // Usando Zap como ícone do pivô por enquanto
    { name: "Agenda", href: "/agenda", icon: Calendar },
    { name: "Histórico", href: "/historico", icon: Clock },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#E8F0D1] border-t border-green-200 flex justify-around items-center py-3 pb-6 px-2 shadow-lg z-50">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link 
            key={item.name} 
            href={item.href} 
            className={`flex flex-col items-center gap-1 ${isActive ? "text-green-800" : "text-green-900/50 hover:text-green-700"}`}
          >
            <Icon className="h-6 w-6" />
            <span className="text-xs font-medium">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}