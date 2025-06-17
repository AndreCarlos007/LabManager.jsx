"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getCursoLabel } from "@/lib/constants"
import { BookOpen, Clock, Calendar, GraduationCap, Hash, Edit, Trash2 } from "lucide-react"

export default function TurmaDetalhes({ turma, onEdit, onDelete }) {
  if (!turma) return null

  const cursoNome = getCursoLabel(turma.cursoId || turma.curso?.id)

  return (
    <div className="space-y-4">
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-lg sm:text-xl text-gray-900 font-semibold">{turma.codigo}</CardTitle>
              <p className="text-xs text-gray-500 mt-1">Detalhes da Turma</p>
            </div>
            <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs px-2 py-1 w-fit">
              {turma.periodoLetivo}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-gray-100 rounded-md">
                  <Hash className="h-3.5 w-3.5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-medium text-gray-500 mb-0.5">Código</h3>
                  <p className="text-sm text-gray-900 font-medium">{turma.codigo}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-gray-100 rounded-md">
                  <BookOpen className="h-3.5 w-3.5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-medium text-gray-500 mb-0.5">Disciplina</h3>
                  <p className="text-sm text-gray-900 font-medium truncate">{turma.disciplina}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-gray-100 rounded-md">
                  <Clock className="h-3.5 w-3.5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-medium text-gray-500 mb-0.5">Horário</h3>
                  <p className="text-sm text-gray-900 font-medium">{turma.horario}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-gray-100 rounded-md">
                  <Calendar className="h-3.5 w-3.5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xs font-medium text-gray-500 mb-0.5">Período Letivo</h3>
                  <p className="text-sm text-gray-900 font-medium">{turma.periodoLetivo}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-gray-200" />

          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-gray-100 rounded-md">
              <GraduationCap className="h-3.5 w-3.5 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xs font-medium text-gray-500 mb-0.5">Curso</h3>
              <p className="text-sm text-gray-900 font-medium">{cursoNome}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          className="border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 h-8 px-3 text-xs font-medium order-2 sm:order-1"
          onClick={() => onEdit(turma.id)}
        >
          <Edit className="mr-1.5 h-3.5 w-3.5" />
          Editar
        </Button>
        <Button
          variant="destructive"
          size="sm"
          className="bg-red-600 hover:bg-red-700 text-white h-8 px-3 text-xs font-medium order-1 sm:order-2"
          onClick={() => onDelete(turma.id)}
        >
          <Trash2 className="mr-1.5 h-3.5 w-3.5" />
          Excluir
        </Button>
      </div>
    </div>
  )
}
