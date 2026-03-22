"use client";

import { useState } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation"; 

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter(); 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      alert("Credenciais inválidas!"); 
    } else {
      router.push("/fazendas");
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-[#F3F6E6] font-sans">
      {/* Cabeçalho com imagem de fundo (Placeholder) e Logo */}
      <div className="relative h-48 w-full bg-gradient-to-r from-green-800 to-green-600 rounded-b-[40px] flex items-end p-8 shadow-md">
        {/* Aqui você pode colocar a imagem da fazenda usando a tag <img /> ou background-image */}
        <div className="w-full flex justify-between items-center text-white">
          <h1 className="text-3xl font-semibold">Login</h1>
          <div className="text-2xl font-bold tracking-widest">SOIL</div>
        </div>
      </div>

      {/* Formulário */}
      <div className="flex-1 flex flex-col px-8 pt-12 pb-8">
        <form onSubmit={handleLogin} className="flex-1 flex flex-col space-y-6">
          
          {/* Input Usuário/Email */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-11 pr-4 py-4 bg-white border-none rounded-full shadow-sm focus:ring-2 focus:ring-green-500 outline-none text-gray-700 placeholder-gray-400"
              placeholder="Usuário ou Email"
              required
            />
          </div>

          {/* Input Senha */}
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-11 pr-12 py-4 bg-white border-none rounded-full shadow-sm focus:ring-2 focus:ring-green-500 outline-none text-gray-700 placeholder-gray-400"
                placeholder="Senha"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-green-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            
            {/* Esqueceu a senha */}
            <div className="flex justify-end mt-2 pr-2">
              <a href="#" className="text-sm text-green-700 hover:underline">
                Esqueceu a senha?
              </a>
            </div>
          </div>

          <div className="flex-1"></div> {/* Espaçador para jogar o botão pro fundo */}

          {/* Botão Entrar */}
          <button
            type="submit"
            disabled={!email || !password}
            className="w-full py-4 px-4 rounded-full text-white font-medium text-lg bg-[#228B22] hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 transition-colors shadow-md"
          >
            Entrar
          </button>

          {/* Configurações */}
          <div className="flex justify-center mt-4">
            <a href="#" className="text-green-700 font-medium hover:underline">
              Configurações
            </a>
          </div>

        </form>
      </div>
    </main>
  );
}