"use client"
import { useState, useCallback } from "react"
import { toast } from "sonner"
import { obterHistoricoAuditoria } from "../lib/api/auditoria"

export default function useAuditoria() {
  const [historico, setHistorico] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const carregarHistorico = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await obterHistoricoAuditoria()
      setHistorico(data || [])
      return data
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    historico,
    loading,
    error,
    carregarHistorico,
  }
}
