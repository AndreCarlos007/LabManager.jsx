import { useState, useEffect } from 'react';
import { getUserProfile } from '@/lib/api';
import { getCookie } from '@/lib/cookies';

// Adicione esta função de mapeamento de cursos
const getCursoNome = (cursoId) => {
  const cursos = {
    0: "Ciência da Computação",
    1: "Engenharia de Software",
    2: "Medicina",
    3: "Administração"
  };
  return cursos[cursoId] || "Curso Desconhecido";
};

export function useUserProfile() {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = getCookie('token');
        
        if (!token) {
          throw new Error('Usuário não autenticado');
        }
        
        const profile = await getUserProfile(token);
        
        // Adiciona o nome do curso ao perfil
        const perfilCompleto = {
          ...profile,
          cursoNome: getCursoNome(profile.cursoId)
        };
        
        setUserProfile(perfilCompleto);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return { userProfile, loading, error };
}