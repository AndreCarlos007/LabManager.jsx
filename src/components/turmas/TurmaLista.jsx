"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Pencil, Trash } from "lucide-react"
import { getCursoLabel } from "@/lib/constants"

export default function TurmaLista({ turmas, loading, onView, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-md bg-gray-100" />
        ))}
      </div>
    )
  }

  if (!turmas || turmas.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500 text-sm">Nenhuma turma encontrada</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <TableHead className="text-gray-700 font-medium text-xs h-10">Código</TableHead>
            <TableHead className="text-gray-700 font-medium text-xs h-10">Disciplina</TableHead>
            <TableHead className="text-gray-700 font-medium text-xs h-10 hidden sm:table-cell">Horário</TableHead>
            <TableHead className="text-gray-700 font-medium text-xs h-10 hidden md:table-cell">Período</TableHead>
            <TableHead className="text-gray-700 font-medium text-xs h-10 hidden lg:table-cell">Curso</TableHead>
            <TableHead className="text-gray-700 font-medium text-xs h-10 w-32">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {turmas.map((turma) => {
            const cursoNome = getCursoLabel(turma.cursoId || turma.curso?.id)

            return (
              <TableRow key={turma.id} className="hover:bg-gray-50 border-gray-100">
                <TableCell className="font-medium text-gray-900 text-sm py-3">{turma.codigo}</TableCell>
                <TableCell className="text-gray-700 text-sm py-3">
                  <div className="max-w-32 truncate">{turma.disciplina}</div>
                </TableCell>
                <TableCell className="text-gray-600 text-sm py-3 hidden sm:table-cell">{turma.horario}</TableCell>
                <TableCell className="text-gray-600 text-sm py-3 hidden md:table-cell">
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs px-2 py-1">
                    {turma.periodoLetivo}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-600 text-sm py-3 hidden lg:table-cell">
                  <div className="max-w-28 truncate">{cursoNome}</div>
                </TableCell>
                <TableCell className="py-3">
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      onClick={() => onView(turma.id)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      onClick={() => onEdit(turma.id)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => onDelete(turma.id)}
                    >
                      <Trash className="h-3.5 w-3.5" />
                    </Button>
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
