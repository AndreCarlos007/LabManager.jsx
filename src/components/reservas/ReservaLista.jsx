"use client"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Calendar, Check, X, Eye, Loader } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  podeAprovar,
  getStatusLabel,
  getStatusBadgeVariant,
  getFuncaoParaNivel,
  getEtapaAtual,
} from "../../lib/reservaUtils"

export default function ReservaLista({
  reservas,
  loading,
  onView,
  onApprove,
  onReject,
  userProfile,
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2 text-gray-700">Carregando reservas...</span>
      </div>
    )
  }

  if (!reservas || reservas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center p-8 border rounded-lg bg-gray-50">
        <Calendar className="h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          Nenhuma reserva encontrada
        </h3>
        <p className="text-sm text-gray-500">
          Crie uma nova reserva para começar
        </p>
      </div>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <Table className="min-w-full">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-[20%]">Laboratório</TableHead>
            <TableHead className="w-[15%]">Turma</TableHead>
            <TableHead className="w-[15%]">Início</TableHead>
            <TableHead className="w-[15%]">Fim</TableHead>
            <TableHead className="w-[15%]">Status</TableHead>
            <TableHead className="w-[20%] text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y">
          {reservas.map((reserva) => {
            const funcaoUsuario = userProfile?.funcao
            const etapaAtual = getEtapaAtual(reserva)
            const nivelUsuario = getFuncaoParaNivel(funcaoUsuario)

            const podeVerBotaoAprovar = podeAprovar(
              reserva.status,
              funcaoUsuario
            )

            const podeVerBotaoRejeitar =
              nivelUsuario === etapaAtual && reserva.status < 4

            return (
              <TableRow key={reserva.id} className="hover:bg-gray-50">
                <TableCell className="py-3">
                  <div className="font-medium">
                    {reserva.laboratorioNome || "N/A"}
                  </div>
                  {reserva.laboratorioLocalizacao && (
                    <div className="text-xs text-gray-500 mt-1">
                      {reserva.laboratorioLocalizacao}
                    </div>
                  )}
                </TableCell>

                <TableCell className="py-3">
                  {reserva.turmaCodigo || "N/A"}
                </TableCell>

                <TableCell className="py-3">
                  {reserva.dataHoraInicio
                    ? format(new Date(reserva.dataHoraInicio), "dd/MM/yy HH:mm", {
                        locale: ptBR,
                      })
                    : "N/A"}
                </TableCell>

                <TableCell className="py-3">
                  {reserva.dataHoraFim
                    ? format(new Date(reserva.dataHoraFim), "dd/MM/yy HH:mm", {
                        locale: ptBR,
                      })
                    : "N/A"}
                </TableCell>

                <TableCell className="py-3">
                  <Badge variant={getStatusBadgeVariant(reserva.status)}>
                    {getStatusLabel(reserva.status)}
                  </Badge>
                </TableCell>

                <TableCell className="py-3 text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView(reserva.id)}
                      className="px-2"
                    >
                      <Eye className="h-4 w-4 mr-1" /> Detalhes
                    </Button>

                    {podeVerBotaoRejeitar && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onReject(reserva.id)}
                        className="px-2"
                        title="Rejeitar reserva"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}

                    {podeVerBotaoAprovar && (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => onApprove(reserva.id, funcaoUsuario)}
                        className="px-2"
                        title="Aprovar reserva"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
