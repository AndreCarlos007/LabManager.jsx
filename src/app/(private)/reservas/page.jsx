"use client"
import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Badge } from "../../../components/ui/badge"
import { Plus, Search, Clock, CheckCircle, XCircle } from "lucide-react"
import ReservaLista from "../../../components/reservas/ReservaLista"
import ReservaForm from "../../../components/reservas/ReservaForm"
import ReservaDetalhes from "../../../components/reservas/ReservaDetalhes"
import useReserva from "../../../hooks/useReserva"
import useLaboratorio from "../../../hooks/useLaboratorio"
import useTurma from "../../../hooks/useTurmas"
import { toast } from "sonner"
import Cookies from "js-cookie"
import { getUserProfile } from "../../../lib/api"

export default function ReservasPage() {
  const [view, setView] = useState("list")
  const [selectedReservaId, setSelectedReservaId] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [userProfile, setUserProfile] = useState(null)
  const [userLoading, setUserLoading] = useState(true)

  const {
    reservas,
    reserva,
    loading,
    error,
    listarReservas,
    obterReservaPorId,
    criarReserva,
    aprovarReserva,
    rejeitarReserva,
  } = useReserva()

  const { laboratorios, carregarLaboratorios } = useLaboratorio()
  const { turmas, listarTurmas } = useTurma()

  // Função para verificar se o usuário tem permissões administrativas
  const temPermissaoAdministrativa = (funcao) => {
    return funcao === 1 || funcao === 2 || funcao === 3 // Coordenador Curso, Coordenador Lab, Reitoria
  }

  useEffect(() => {
    const fetchInitialData = async () => {
      const token = Cookies.get("token")
      if (!token) {
        toast.error("Usuário não autenticado")
        setUserLoading(false)
        return
      }

      try {
        const profile = await getUserProfile(token)
        setUserProfile(profile)

        await Promise.all([listarReservas(), carregarLaboratorios(), listarTurmas()])
      } catch (error) {
        toast.error("Erro ao carregar dados iniciais")
        console.error(error)
      } finally {
        setUserLoading(false)
      }
    }

    fetchInitialData()
  }, [])

  useEffect(() => {
    if (selectedReservaId && view === "detail") {
      obterReservaPorId(selectedReservaId)
    }
  }, [selectedReservaId, view])

  const handleCreate = async (data) => {
    try {
      const reservaData = {
        ...data,
        professorId: userProfile.id,
      }
      await criarReserva(reservaData)
      toast.success("Reserva criada com sucesso!")
      setView("list")
      listarReservas()
    } catch (error) {
      toast.error(error.message || "Falha ao criar reserva")
    }
  }

  const handleApprove = async (id, userFuncao) => {
    const success = await aprovarReserva(id, userFuncao)
    if (success) {
      view === "detail" ? obterReservaPorId(id) : listarReservas()
    }
  }

  const handleReject = async (id) => {
    const success = await rejeitarReserva(id)
    if (success) {
      view === "detail" ? obterReservaPorId(id) : listarReservas()
    }
  }

  // Filtrar reservas por termo de busca
  const filteredReservas = reservas.filter((res) => {
    const search = searchTerm.toLowerCase()
    return (
      res.laboratorioNome?.toLowerCase().includes(search) ||
      res.turmaCodigo?.toLowerCase().includes(search) ||
      res.professorNome?.toLowerCase().includes(search)
    )
  })

  // Separar reservas por status
  const reservasPendentes = filteredReservas.filter((r) => r.status < 3) // Status 0, 1, 2
  const reservasAprovadas = filteredReservas.filter((r) => r.status === 3)
  const reservasRejeitadas = filteredReservas.filter((r) => r.status === 4)

  // Se não estiver na view de lista, renderiza as outras views
  if (view !== "list") {
    return (
      <div className="container mx-auto py-8 ml-2 w-[70rem]">
        <Card className="border-gray-200 bg-gray-50 shadow-sm">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <CardTitle className="text-gray-900">
                {view === "create" && "Nova Reserva"}
                {view === "detail" && "Detalhes da Reserva"}
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent>
            {view === "create" && (
              <ReservaForm
                onSubmit={handleCreate}
                onCancel={() => setView("list")}
                loading={loading || userLoading}
                laboratorios={laboratorios}
                turmas={turmas}
              />
            )}

            {view === "detail" && reserva && (
              <ReservaDetalhes
                reserva={reserva}
                onApprove={(funcao) => handleApprove(reserva.id, funcao)}
                onReject={() => handleReject(reserva.id)}
                onBack={() => {
                  setView("list")
                  setSelectedReservaId(null)
                }}
                userProfile={userProfile}
                temPermissaoAdministrativa={temPermissaoAdministrativa}
              />
            )}
          </CardContent>

          {view === "create" && (
            <CardFooter className="flex justify-end">
              <Button
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
                onClick={() => {
                  setView("list")
                  setSelectedReservaId(null)
                }}
              >
                Voltar para lista
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    )
  }

  // View principal com os 3 cards separados
  return (
    <div className="container mx-auto py-8 ml-2 w-[70rem] space-y-6">
      {/* Header com busca e botão de nova reserva */}
      <Card className="border-gray-200 bg-gray-50 shadow-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <CardTitle className="text-gray-900">Reservas de Laboratórios</CardTitle>
            <div className="mt-4 md:mt-0 flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar reservas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-300"
                />
              </div>
              <Button
                className="bg-gray-800 hover:bg-gray-900 text-gray-50"
                onClick={() => setView("create")}
                disabled={userLoading}
              >
                <Plus className="mr-2 h-4 w-4" /> Nova Reserva
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Card de Reservas Pendentes */}
      <Card className="border-yellow-200 bg-yellow-50 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800">
            <Clock className="h-5 w-5" />
            Reservas Pendentes
            <Badge variant="warning" className="bg-yellow-500 text-white">
              {reservasPendentes.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reservasPendentes.length > 0 ? (
            <ReservaLista
              reservas={reservasPendentes}
              loading={loading}
              onView={(id) => {
                setSelectedReservaId(id)
                setView("detail")
              }}
              onApprove={(id, funcao) => handleApprove(id, funcao)}
              onReject={handleReject}
              userProfile={userProfile}
              temPermissaoAdministrativa={temPermissaoAdministrativa}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-center p-4">
              <Clock className="h-8 w-8 text-yellow-400 mb-2" />
              <p className="text-yellow-700 font-medium">Nenhuma reserva pendente</p>
              <p className="text-yellow-600 text-sm">Todas as reservas foram processadas</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Card de Reservas Aprovadas */}
      <Card className="border-green-200 bg-green-50 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CheckCircle className="h-5 w-5" />
            Reservas Aprovadas
            <Badge variant="success" className="bg-green-500 text-white">
              {reservasAprovadas.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reservasAprovadas.length > 0 ? (
            <ReservaLista
              reservas={reservasAprovadas}
              loading={loading}
              onView={(id) => {
                setSelectedReservaId(id)
                setView("detail")
              }}
              onApprove={(id, funcao) => handleApprove(id, funcao)}
              onReject={handleReject}
              userProfile={userProfile}
              temPermissaoAdministrativa={temPermissaoAdministrativa}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-center p-4">
              <CheckCircle className="h-8 w-8 text-green-400 mb-2" />
              <p className="text-green-700 font-medium">Nenhuma reserva aprovada</p>
              <p className="text-green-600 text-sm">As reservas aprovadas aparecerão aqui</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Card de Reservas Rejeitadas */}
      <Card className="border-red-200 bg-red-50 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <XCircle className="h-5 w-5" />
            Reservas Rejeitadas
            <Badge variant="destructive" className="bg-red-500 text-white">
              {reservasRejeitadas.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reservasRejeitadas.length > 0 ? (
            <ReservaLista
              reservas={reservasRejeitadas}
              loading={loading}
              onView={(id) => {
                setSelectedReservaId(id)
                setView("detail")
              }}
              onApprove={(id, funcao) => handleApprove(id, funcao)}
              onReject={handleReject}
              userProfile={userProfile}
              temPermissaoAdministrativa={temPermissaoAdministrativa}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-32 text-center p-4">
              <XCircle className="h-8 w-8 text-red-400 mb-2" />
              <p className="text-red-700 font-medium">Nenhuma reserva rejeitada</p>
              <p className="text-red-600 text-sm">As reservas rejeitadas aparecerão aqui</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
