"use client";
import React, { useState } from "react";
import { registerUser } from "../../../lib/api";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    nome: "",
    emailInstitucional: "",
    senha: "",
    funcao: 0,
    cursoId: 0
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'funcao' || name === 'cursoId' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Prepara os dados no formato exato esperado pela API
      const userData = {
        nome: formData.nome,
        emailInstitucional: formData.emailInstitucional,
        senha: formData.senha,
        funcao: formData.funcao,
        cursoId: formData.cursoId
      };

      // Chama a função de registro com o endpoint corrigido
      await registerUser(userData);

      setSuccess(true);
      
      // Limpa o formulário após sucesso
      setFormData({
        nome: "",
        emailInstitucional: "",
        senha: "",
        funcao: 0,
        cursoId: 0
      });
      
      // Redireciona para login após 3 segundos
      setTimeout(() => {
        router.push("/login");
      }, 3000);
      
    } catch (err) {
      setError(err.message || "Erro durante o registro");
    } finally {
      setIsLoading(false);
    }
  };

  const funcoes = [
    { id: 0, label: "Professor" },
    { id: 1, label: "Coordenador de Curso" },
    { id: 2, label: "Coordenador de Laboratório" },
    { id: 3, label: "Reitoria" },
    { id: 4, label: "Técnico" },
    { id: 5, label: "Auditor" }
  ];

  const cursos = [
    { id: 0, label: "Ciência da Computação" },
    { id: 1, label: "Engenharia de Software" },
    { id: 2, label: "Medicina" },
    { id: 3, label: "Administração" }
  ];

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
          <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Crie sua conta</h2>
          <p className="text-sm text-gray-500 mb-6">Preencha seus dados para registrar</p>

          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
              Registro realizado com sucesso! Redirecionando para login...
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              <strong>Erro:</strong> {error}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Campo Nome Completo */}
            <div>
              <label className="text-sm font-medium text-gray-700">Nome Completo</label>
              <input
                name="nome"
                type="text"
                placeholder="Seu nome completo"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md text-[#212121] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={formData.nome}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            {/* Campo Email Institucional */}
            <div>
              <label className="text-sm font-medium text-gray-700">Email Institucional</label>
              <input
                name="emailInstitucional"
                type="email"
                placeholder="seu.email@instituicao.edu"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md text-[#212121] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={formData.emailInstitucional}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
            </div>

            {/* Campo Senha */}
            <div>
              <label className="text-sm font-medium text-gray-700">Senha</label>
              <input
                name="senha"
                type="password"
                placeholder="••••••••"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md text-[#212121] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={formData.senha}
                onChange={handleChange}
                required
                minLength={6}
                disabled={isLoading}
              />
            </div>

            {/* Campo Função */}
            <div>
              <label className="text-sm font-medium text-gray-700">Função</label>
              <select
                name="funcao"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md text-[#212121] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={formData.funcao}
                onChange={handleChange}
                required
                disabled={isLoading}
              >
                {funcoes.map((funcao) => (
                  <option key={funcao.id} value={funcao.id}>
                    {funcao.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Campo Curso */}
            <div>
              <label className="text-sm font-medium text-gray-700">Curso</label>
              <select
                name="cursoId"
                className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md text-[#212121] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={formData.cursoId}
                onChange={handleChange}
                required
                disabled={isLoading}
              >
                {cursos.map((curso) => (
                  <option key={curso.id} value={curso.id}>
                    {curso.label}
                  </option>
                ))}
              </select>
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
                  Registrando...
                </span>
              ) : 'Registrar'}
            </button>

            <p className="text-center text-sm text-gray-500 mt-4">
              Já tem uma conta? <a href="/login" className="text-purple-600 hover:underline">Entrar</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}