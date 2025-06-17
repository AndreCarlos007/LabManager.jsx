"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"
import {
  Calendar,
  Users,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  Activity,
  BookOpen,
  Settings,
  Plus,
  ArrowRight,
  TestTubeDiagonal,
  Ungroup,
  Info,
  AlertTriangle,
  Loader,
} from "lucide-react"
import Cookies from "js-cookie"
import { getUserProfile } from "../../../lib/api"
import useLaboratorios from "../../../hooks/useLaboratorio"
import useTurmas from "../../../hooks/useTurmas"
import useReserva from "../../../hooks/useReserva"
import Link from "next/link"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { getStatusLabel, getStatusBadgeVariant } from "../../../lib/reservaUtils"
import { FUNCOES, getFuncaoLabel } from "../../../lib/constants"

export default function DashboardPage() {
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Hooks para dados reais
  const { laboratorios, carregarLaboratorios } = useLaboratorios()
  const { turmas, listarTurmas } = useTurmas()
  const { reservas, listarReservas } = useReserva()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get("token")
        if (token) {
          const profile = await getUserProfile(token)
          setUserProfile(profile)
        }

        // Carrega dados em paralelo
        await Promise.all([carregarLaboratorios(), listarTurmas(), listarReservas()])
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Função para verificar se o usuário tem permissões administrativas
  const temPermissaoAdministrativa = (funcao) => {
    return [
      FUNCOES.COORDENADOR_CURSO,
      FUNCOES.COORDENADOR_LABORATORIO,
      FUNCOES.REITORIA,
      FUNCOES.TECNICO,
      FUNCOES.AUDITOR,
    ].includes(funcao)
  }

  // Cálculos de estatísticas baseados nos dados reais
  const stats = {
    totalReservas: reservas.length,
    reservasPendentes: reservas.filter((r) => r.status < 3).length,
    reservasAprovadas: reservas.filter((r) => r.status === 3).length,
    reservasRejeitadas: reservas.filter((r) => r.status === 4).length,
    totalLaboratorios: laboratorios.length,
    laboratoriosDisponiveis: laboratorios.filter((l) => !l.emManutencao).length,
    laboratoriosManutencao: laboratorios.filter((l) => l.emManutencao).length,
    totalTurmas: turmas.length,
  }

  const getFuncaoColor = (funcao) => {
    switch (funcao) {
      case FUNCOES.PROFESSOR:
        return "bg-blue-500"
      case FUNCOES.COORDENADOR_CURSO:
        return "bg-green-500"
      case FUNCOES.COORDENADOR_LABORATORIO:
        return "bg-purple-500"
      case FUNCOES.REITORIA:
        return "bg-red-500"
      case FUNCOES.TECNICO:
        return "bg-orange-500"
      case FUNCOES.AUDITOR:
        return "bg-gray-500"
      default:
        return "bg-gray-400"
    }
  }

  // Ações rápidas baseadas nas permissões do usuário
  const getQuickActions = () => {
    const baseActions = [
      {
        title: "Nova Reserva",
        description: "Criar uma nova reserva de laboratório",
        icon: Plus,
        href: "/reservas",
        color: "bg-blue-500 hover:bg-blue-600",
      },
      {
        title: "Ver Reservas",
        description: "Visualizar todas as reservas",
        icon: Calendar,
        href: "/reservas",
        color: "bg-green-500 hover:bg-green-600",
      },
    ]

    // Adiciona ações administrativas baseadas na função específica
    if ([FUNCOES.COORDENADOR_CURSO, FUNCOES.COORDENADOR_LABORATORIO, FUNCOES.REITORIA].includes(userProfile?.funcao)) {
      baseActions.push(
        {
          title: "Gerenciar Labs",
          description: "Administrar laboratórios",
          icon: TestTubeDiagonal,
          href: "/labs",
          color: "bg-purple-500 hover:bg-purple-600",
        },
        {
          title: "Gerenciar Turmas",
          description: "Administrar turmas",
          icon: Ungroup,
          href: "/turmas",
          color: "bg-orange-500 hover:bg-orange-600",
        },
      )
    }

    if ([FUNCOES.REITORIA, FUNCOES.AUDITOR].includes(userProfile?.funcao)) {
      baseActions.push({
        title: "Relatórios",
        description: "Visualizar relatórios de auditoria",
        icon: Info,
        href: "/relatorio",
        color: "bg-red-500 hover:bg-red-600",
      })
    }

    return baseActions
  }

  // Reservas recentes (últimas 5)
  const reservasRecentes = reservas.sort((a, b) => new Date(b.dataCriacao) - new Date(a.dataCriacao)).slice(0, 5)

  // Laboratórios em manutenção
  const labsManutencao = laboratorios.filter((l) => l.emManutencao)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="h-8 w-8 animate-spin text-gray-900" />
        <span className="ml-2">Carregando dashboard...</span>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-6 space-y-8 transition-all duration-300 ease-in-out peer-data-[state=collapsed]:max-w-6xl peer-data-[state=collapsed]:mx-auto">
      {/* Header com boas-vindas */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Olá, {userProfile?.nome?.split(" ")[0] || "Usuário"}!</h1>
          <p className="text-gray-600 mt-1">Bem-vindo ao sistema de gerenciamento de laboratórios</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Badge className={`${getFuncaoColor(userProfile?.funcao)} text-white px-3 py-1`}>
            {getFuncaoLabel(userProfile?.funcao)}
          </Badge>
        </div>
      </div>

      {/* Cards de estatísticas principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Reservas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalReservas}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.reservasPendentes}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aprovadas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.reservasAprovadas}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Laboratórios</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalLaboratorios}</p>
              </div>
              <Building2 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ações rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Ações Rápidas
          </CardTitle>
          <CardDescription>
            Acesse rapidamente as funcionalidades{" "}
            {temPermissaoAdministrativa(userProfile?.funcao) ? "administrativas" : "disponíveis"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {getQuickActions().map((action, index) => (
              <Link key={index} href={action.href}>
                <Button className={`w-full h-auto p-4 ${action.color} text-white flex flex-col items-center gap-2`}>
                  <action.icon className="h-6 w-6" />
                  <div className="text-center">
                    <div className="font-medium">{action.title}</div>
                    <div className="text-xs opacity-90">{action.description}</div>
                  </div>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Grid com informações detalhadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reservas Recentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Reservas Recentes
            </CardTitle>
            <CardDescription>Últimas reservas criadas no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            {reservasRecentes.length > 0 ? (
              <div className="space-y-4">
                {reservasRecentes.map((reserva) => (
                  <div key={reserva.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{reserva.laboratorioNome}</p>
                      <p className="text-sm text-gray-600">{reserva.turmaCodigo}</p>
                      <p className="text-xs text-gray-500">
                        {reserva.dataHoraInicio &&
                          format(new Date(reserva.dataHoraInicio), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(reserva.status)}>{getStatusLabel(reserva.status)}</Badge>
                  </div>
                ))}
                <Link href="/reservas">
                  <Button variant="outline" className="w-full">
                    Ver todas as reservas
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Nenhuma reserva encontrada</p>
                <Link href="/reservas">
                  <Button className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar primeira reserva
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Status dos Laboratórios - Só mostra para usuários com permissão */}
        {temPermissaoAdministrativa(userProfile?.funcao) ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Status dos Laboratórios
              </CardTitle>
              <CardDescription>Situação atual dos laboratórios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">{stats.laboratoriosDisponiveis}</div>
                    <div className="text-xs text-gray-600">Disponíveis</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600">{stats.laboratoriosManutencao}</div>
                    <div className="text-xs text-gray-600">Em Manutenção</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{stats.totalLaboratorios}</div>
                    <div className="text-xs text-gray-600">Total</div>
                  </div>
                </div>

                {labsManutencao.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      Laboratórios em Manutenção
                    </h4>
                    <div className="space-y-2">
                      {labsManutencao.slice(0, 3).map((lab) => (
                        <div key={lab.id} className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                          <span className="text-sm font-medium">{lab.nome}</span>
                          <Badge variant="destructive" className="text-xs">
                            Manutenção
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Link href="/labs">
                  <Button variant="outline" className="w-full">
                    Gerenciar laboratórios
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Card alternativo para usuários sem permissão administrativa
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Meu Perfil
              </CardTitle>
              <CardDescription>Informações da sua conta</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Nome:</span>
                  <span className="text-sm">{userProfile?.nome || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Email:</span>
                  <span className="text-sm">{userProfile?.emailInstitucional || "N/A"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Função:</span>
                  <Badge className={`${getFuncaoColor(userProfile?.funcao)} text-white`}>
                    {getFuncaoLabel(userProfile?.funcao)}
                  </Badge>
                </div>
                <Link href="/perfil">
                  <Button variant="outline" className="w-full">
                    Ver perfil completo
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Estatísticas Gerais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Visão Geral
            </CardTitle>
            <CardDescription>Resumo do sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {temPermissaoAdministrativa(userProfile?.funcao) && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Ungroup className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm font-medium">Total de Turmas</span>
                  </div>
                  <span className="text-lg font-bold">{stats.totalTurmas}</span>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">Reservas Rejeitadas</span>
                </div>
                <span className="text-lg font-bold">{stats.reservasRejeitadas}</span>
              </div>

              <div className="pt-4 border-t">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Taxa de Aprovação</p>
                  <div className="text-2xl font-bold text-green-600">
                    {stats.totalReservas > 0 ? Math.round((stats.reservasAprovadas / stats.totalReservas) * 100) : 0}%
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Links Rápidos - Condicionais baseados na permissão */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Links Úteis
            </CardTitle>
            <CardDescription>Acesso rápido a outras funcionalidades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[FUNCOES.COORDENADOR_CURSO, FUNCOES.COORDENADOR_LABORATORIO, FUNCOES.REITORIA].includes(
                userProfile?.funcao,
              ) && (
                <>
                  <Link href="/turmas">
                    <Button variant="ghost" className="w-full justify-start">
                      <Ungroup className="h-4 w-4 mr-2" />
                      Gerenciar Turmas
                    </Button>
                  </Link>

                  <Link href="/labs">
                    <Button variant="ghost" className="w-full justify-start">
                      <TestTubeDiagonal className="h-4 w-4 mr-2" />
                      Gerenciar Laboratórios
                    </Button>
                  </Link>
                </>
              )}

              {[FUNCOES.REITORIA, FUNCOES.AUDITOR].includes(userProfile?.funcao) && (
                <Link href="/relatorio">
                  <Button variant="ghost" className="w-full justify-start">
                    <Info className="h-4 w-4 mr-2" />
                    Relatórios de Auditoria
                  </Button>
                </Link>
              )}

              <Link href="/reservas">
                <Button variant="ghost" className="w-full justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  Minhas Reservas
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
