"use client";
import React, { useState } from "react";
import { loginUser } from "../../../lib/api";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [matriculaOuEmail, setMatriculaOuEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await loginUser({ 
        matriculaOuEmail, 
        senha 
      });
      
      // Extrai o token da resposta (diferentes formatos possíveis)
      const token = response.token || response.accessToken || response.access_token;
      
      if (!token) {
        throw new Error("Token não encontrado na resposta da API");
      }

      // Armazena o token em cookie
      document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
      
      router.push("/dashboard");
      
    } catch (err) {
      setError(err.message || "Credenciais inválidas. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-xl shadow-md overflow-hidden">
        {/* Coluna da Imagem */}
        <div className="md:w-1/2 bg-purple-600 flex items-center justify-center p-8">
          <div className="relative w-full h-64 md:h-full">
            <img 
              src="/images.png" 
              alt="Laboratório" 
              className="object-cover w-full h-full rounded-lg"
            />
          </div>
        </div>

        {/* Coluna do Formulário */}
        <div className="md:w-1/2 p-8">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Bem-vindo de volta</h2>
          <p className="text-sm text-gray-500 mb-6">Por favor, insira suas credenciais para acessar</p>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              <strong>Erro:</strong> {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium text-gray-700">Matrícula ou Email</label>
              <input
                type="text"
                placeholder="Sua matrícula ou email institucional"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md text-[#212121] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={matriculaOuEmail}
                onChange={(e) => setMatriculaOuEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Senha</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md text-[#212121] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className={`w-full bg-purple-600 text-white py-2 rounded-md transition focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
                isLoading 
                  ? 'opacity-70 cursor-not-allowed' 
                  : 'hover:bg-purple-700 cursor-pointer'
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Autenticando...
                </span>
              ) : 'Entrar'}
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Não tem uma conta? <a href="/register" className="text-purple-600 hover:underline">Cadastre-se</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}