"use client"

import { useState, useEffect } from "react"
import { getUserProfile } from "@/lib/api"
import { getCookie } from "@/lib/cookies"
import { getCursoLabel } from "@/lib/constants"

export function useUserProfile() {
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true)
        const token = getCookie("token")

        if (!token) {
          throw new Error("Usuário não autenticado")
        }

        const profile = await getUserProfile(token)

        // Adiciona o nome do curso ao perfil usando o constants.js
        const perfilCompleto = {
          ...profile,
          cursoNome: getCursoLabel(profile.cursoId),
        }

        setUserProfile(perfilCompleto)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  return { userProfile, loading, error }
}
