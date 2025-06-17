"use client"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Calendar, Check, X, Clock } from "lucide-react"
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

  // Renderiza o fluxo de aprovação com informações detalhadas
  const renderApprovalFlow = () => {
    const steps = [
      { nivel: 1, nome: "Coordenador do Laboratório" },
      { nivel: 2, nome: "Coordenador do Curso" },
      { nivel: 3, nome: "Pró-Reitoria" },
    ]

    return (
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Fluxo de Aprovação</h3>
        <div className="space-y-4">
          {steps.map((step, index) => {
            const status = getStatusEtapa(reserva, step.nivel)
            const responsavel = getResponsavelEtapa(reserva, step.nivel)
            const dataEtapa = getDataEtapa(reserva, step.nivel)

            return (
              <div key={index} className="border rounded-lg p-3 bg-white shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        status === "Aprovada" ? "bg-green-500" : status === "Rejeitada" ? "bg-red-500" : "bg-yellow-500"
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
                    <div>
                      <span className="font-medium">{step.nome}</span>
                      <Badge variant={getEtapaBadgeVariant(status)} className="ml-2">
                        {status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {responsavel && (
                  <div className="mt-2 text-sm text-gray-600">
                    <div className="flex">
                      <span className="font-medium w-24">Responsável:</span>
                      <span>{responsavel}</span>
                    </div>
                    <div className="flex">
                      <span className="font-medium w-24">Data:</span>
                      <span>{dataEtapa ? format(parseISO(dataEtapa), "dd/MM/yyyy HH:mm", { locale: ptBR }) : ""}</span>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Função para formatar data/hora
  const formatDateTime = (dateString) => {
    if (!dateString) return ""
    const date = parseISO(dateString)
    return format(date, "dd/MM/yyyy HH:mm", { locale: ptBR })
  }

  return (
    <Card className="border-gray-200 bg-gray-50 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Detalhes da Reserva</span>
          <Badge variant={getStatusBadgeVariant(reserva.status)}>{getStatusLabel(reserva.status)}</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Laboratório</h3>
            <p className="text-lg font-medium mt-1">{reserva.laboratorioNome}</p>
            {reserva.laboratorioLocalizacao && (
              <p className="text-sm text-gray-600 mt-1">{reserva.laboratorioLocalizacao}</p>
            )}
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Turma</h3>
            <p className="text-lg font-medium mt-1">{reserva.turmaCodigo}</p>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Professor</h3>
            <p className="text-lg font-medium mt-1">{reserva.professorNome}</p>
            {reserva.professorEmail && <p className="text-sm text-gray-600 mt-1">{reserva.professorEmail}</p>}
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Início</h3>
            <div className="flex items-center mt-1">
              <Calendar className="h-5 w-5 mr-2 text-gray-500" />
              <p className="text-lg font-medium">{formatDateTime(reserva.dataHoraInicio)}</p>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Fim</h3>
            <div className="flex items-center mt-1">
              <Calendar className="h-5 w-5 mr-2 text-gray-500" />
              <p className="text-lg font-medium">{formatDateTime(reserva.dataHoraFim)}</p>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500">Criada em</h3>
            <div className="flex items-center mt-1">
              <Clock className="h-5 w-5 mr-2 text-gray-500" />
              <p className="text-sm font-medium">{formatDateTime(reserva.dataCriacao)}</p>
            </div>
          </div>
        </div>

        {renderApprovalFlow()}
      </CardContent>

      <CardFooter className="flex justify-between pt-4">
        <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100" onClick={onBack}>
          Voltar
        </Button>

        {/* Só mostra os botões de ação para usuários com permissão administrativa */}
        {temPermissaoAdministrativa && temPermissaoAdministrativa(userProfile?.funcao) && (
          <div className="flex space-x-3">
            {mostrarRejeitar && (
              <Button variant="destructive" onClick={() => onReject(reserva.id, userProfile.funcao)} className="px-6">
                <X className="mr-2 h-4 w-4" /> Rejeitar
              </Button>
            )}

            {mostrarAprovar && (
              <Button variant="success" onClick={() => onApprove(reserva.id, userProfile.funcao)} className="px-6">
                <Check className="mr-2 h-4 w-4" /> Aprovar
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
