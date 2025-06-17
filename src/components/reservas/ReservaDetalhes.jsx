"use client"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Calendar, Check, X, Clock, MapPin, User, GraduationCap, Building2 } from "lucide-react"
import { format, parseISO } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  podeAprovar,
  getStatusLabel,
  getStatusBadgeVariant,
  getStatusEtapa,
  getResponsavelEtapa,
  getDataEtapa,
  getEtapaBadgeVariant,
} from "../../lib/reservaUtils"

export default function ReservaDetalhes({
  reserva,
  onApprove,
  onReject,
  onBack,
  userProfile,
  temPermissaoAdministrativa,
}) {
  const mostrarAprovar =
    temPermissaoAdministrativa &&
    temPermissaoAdministrativa(userProfile?.funcao) &&
    podeAprovar(reserva.status, userProfile?.funcao)
  const mostrarRejeitar =
    temPermissaoAdministrativa && temPermissaoAdministrativa(userProfile?.funcao) && reserva.status < 4

  // Renderiza o fluxo de aprovação com design compacto
  const renderApprovalFlow = () => {
    const steps = [
      { nivel: 1, nome: "Coordenador do Laboratório", icon: Building2 },
      { nivel: 2, nome: "Coordenador do Curso", icon: GraduationCap },
      { nivel: 3, nome: "Pró-Reitoria", icon: User },
    ]

    return (
      <div className="mt-4">
        <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
          <Clock className="h-4 w-4 mr-2 text-gray-600" />
          Fluxo de Aprovação
        </h3>
        <div className="relative">
          {/* Linha conectora */}
          <div className="absolute left-5 top-6 bottom-0 w-0.5 bg-gray-200"></div>

          <div className="space-y-3">
            {steps.map((step, index) => {
              const status = getStatusEtapa(reserva, step.nivel)
              const responsavel = getResponsavelEtapa(reserva, step.nivel)
              const dataEtapa = getDataEtapa(reserva, step.nivel)
              const Icon = step.icon

              return (
                <div key={index} className="relative flex items-start">
                  {/* Ícone de status */}
                  <div
                    className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-3 ${
                      status === "Aprovada"
                        ? "bg-green-500 border-green-200"
                        : status === "Rejeitada"
                          ? "bg-red-500 border-red-200"
                          : "bg-yellow-500 border-yellow-200"
                    }`}
                  >
                    {status === "Aprovada" ? (
                      <Check className="h-4 w-4 text-white" />
                    ) : status === "Rejeitada" ? (
                      <X className="h-4 w-4 text-white" />
                    ) : (
                      <Clock className="h-4 w-4 text-white" />
                    )}
                  </div>

                  {/* Conteúdo da etapa */}
                  <div className="ml-4 flex-1">
                    <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          <Icon className="h-4 w-4 text-gray-600 mr-2" />
                          <h4 className="font-medium text-gray-900 text-sm">{step.nome}</h4>
                        </div>
                        <Badge variant={getEtapaBadgeVariant(status)} className="text-xs px-2 py-0.5">
                          {status}
                        </Badge>
                      </div>

                      {responsavel && (
                        <div className="space-y-0.5 text-xs text-gray-600">
                          <div className="flex items-center">
                            <span className="font-medium w-18">Responsável:</span>
                            <span className="text-gray-900 ml-1">{responsavel}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium w-18">Data:</span>
                            <span className="text-gray-900 ml-1">
                              {dataEtapa ? format(parseISO(dataEtapa), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR }) : ""}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Função para formatar data/hora
  const formatDateTime = (dateString) => {
    if (!dateString) return ""
    const date = parseISO(dateString)
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = parseISO(dateString)
    return format(date, "dd/MM/yyyy", { locale: ptBR })
  }

  const formatTime = (dateString) => {
    if (!dateString) return ""
    const date = parseISO(dateString)
    return format(date, "HH:mm", { locale: ptBR })
  }

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-4 space-y-3">
      {/* Header */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <span className="text-lg font-bold text-gray-900">Detalhes da Reserva</span>
            <Badge variant={getStatusBadgeVariant(reserva.status)} className="text-sm px-3 py-1 w-fit">
              {getStatusLabel(reserva.status)}
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Informações Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Laboratório */}
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-4">
            <div className="flex items-start">
              <div className="p-2 bg-blue-100 rounded-lg mr-3">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-medium text-blue-600 uppercase tracking-wide">Laboratório</h3>
                <p className="text-lg font-bold text-gray-900 mt-0.5">{reserva.laboratorioNome}</p>
                {reserva.laboratorioLocalizacao && (
                  <div className="flex items-center mt-1 text-sm text-gray-600">
                    <MapPin className="h-3 w-3 mr-1" />
                    {reserva.laboratorioLocalizacao}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professor e Turma */}
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-4">
            <div className="flex items-start">
              <div className="p-2 bg-green-100 rounded-lg mr-3">
                <User className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-xs font-medium text-green-600 uppercase tracking-wide">Professor</h3>
                <p className="text-lg font-bold text-gray-900 mt-0.5">{reserva.professorNome}</p>
                {reserva.professorEmail && <p className="text-sm text-gray-600 mt-0.5">{reserva.professorEmail}</p>}
                <div className="mt-2 pt-2 border-t border-green-200">
                  <h4 className="text-xs font-medium text-green-600 uppercase tracking-wide">Turma</h4>
                  <p className="text-base font-semibold text-gray-900 mt-0.5">{reserva.turmaCodigo}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Horários */}
      <Card className="border-purple-200 bg-purple-50/50">
        <CardContent className="p-4">
          <div className="flex items-start">
            <div className="p-2 bg-purple-100 rounded-lg mr-3">
              <Calendar className="h-5 w-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-xs font-medium text-purple-600 uppercase tracking-wide mb-3">Agendamento</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-medium text-gray-500 mb-1">Data e Hora de Início</h4>
                  <div className="space-y-0.5">
                    <p className="text-base font-bold text-gray-900">{formatDate(reserva.dataHoraInicio)}</p>
                    <p className="text-base font-semibold text-purple-600">{formatTime(reserva.dataHoraInicio)}</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-medium text-gray-500 mb-1">Data e Hora de Término</h4>
                  <div className="space-y-0.5">
                    <p className="text-base font-bold text-gray-900">{formatDate(reserva.dataHoraFim)}</p>
                    <p className="text-base font-semibold text-purple-600">{formatTime(reserva.dataHoraFim)}</p>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-purple-200">
                <div className="flex items-center text-xs text-gray-600">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Criada em {formatDateTime(reserva.dataCriacao)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fluxo de Aprovação */}
      <Card className="border-gray-200">
        <CardContent className="p-4">{renderApprovalFlow()}</CardContent>
      </Card>

      {/* Ações */}
      <Card className="border-gray-200">
        <CardFooter className="p-4">
          <div className="flex flex-col sm:flex-row justify-between items-center w-full gap-3">
            <Button
              variant="outline"
              onClick={onBack}
              className="w-full sm:w-auto border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              ← Voltar à Lista
            </Button>

            {/* Botões de ação para administradores */}
            {temPermissaoAdministrativa && temPermissaoAdministrativa(userProfile?.funcao) && (
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                {mostrarRejeitar && (
                  <Button
                    variant="destructive"
                    onClick={() => onReject(reserva.id, userProfile.funcao)}
                    className="w-full sm:w-auto px-4"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Rejeitar
                  </Button>
                )}

                {mostrarAprovar && (
                  <Button
                    onClick={() => onApprove(reserva.id, userProfile.funcao)}
                    className="w-full sm:w-auto px-4 bg-green-600 hover:bg-green-700"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Aprovar
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
