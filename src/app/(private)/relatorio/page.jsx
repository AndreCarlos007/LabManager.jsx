"use client"
import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import { Badge } from "../../../components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import {
  FileText,
  Download,
  Search,
  Filter,
  Calendar,
  User,
  Building2,
  BookOpen,
  Loader,
  RefreshCw,
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import useAuditoria from "../../../hooks/useAuditoria"
import { toast } from "sonner"

export default function RelatorioPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todos")
  const [professorFilter, setProfessorFilter] = useState("todos")
  const [laboratorioFilter, setLaboratorioFilter] = useState("todos")

  const { historico, loading, carregarHistorico } = useAuditoria()

  useEffect(() => {
    carregarHistorico()
  }, [carregarHistorico])

  // Filtros únicos para os selects
  const professoresUnicos = [...new Set(historico.map((item) => item.professor))].sort()
  const laboratoriosUnicos = [...new Set(historico.map((item) => item.laboratorio))].sort()
  const statusUnicos = [...new Set(historico.map((item) => item.status))].sort()

  // Aplicar filtros
  const dadosFiltrados = historico.filter((item) => {
    const matchSearch =
      searchTerm === "" ||
      item.professor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.turma.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.disciplina.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.curso.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.laboratorio.toLowerCase().includes(searchTerm.toLowerCase())

    const matchStatus = statusFilter === "todos" || item.status === statusFilter
    const matchProfessor = professorFilter === "todos" || item.professor === professorFilter
    const matchLaboratorio = laboratorioFilter === "todos" || item.laboratorio === laboratorioFilter

    return matchSearch && matchStatus && matchProfessor && matchLaboratorio
  })

  // Função para obter cor do badge baseado no status
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case "Aprovada":
        return "success"
      case "Rejeitada":
        return "destructive"
      case "Desconhecido":
        return "secondary"
      default:
        return "outline"
    }
  }

  // Função para gerar PDF
  const gerarPDF = async () => {
    try {
      // Importação dinâmica para garantir que funcione no cliente
      const jsPDF = (await import("jspdf")).default
      const autoTable = (await import("jspdf-autotable")).default

      const doc = new jsPDF()

      // Configurar fonte para suportar caracteres especiais
      doc.setFont("helvetica")

      // Título do relatório
      doc.setFontSize(20)
      doc.text("Relatório de Auditoria - Histórico de Reservas", 20, 20)

      // Data de geração
      doc.setFontSize(12)
      doc.text(`Gerado em: ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: ptBR })}`, 20, 35)
      doc.text(`Total de registros: ${dadosFiltrados.length}`, 20, 45)

      // Preparar dados para a tabela
      const tableData = dadosFiltrados.map((item) => [
        item.professor,
        item.turma,
        item.disciplina,
        item.laboratorio,
        format(new Date(item.dataHoraInicio), "dd/MM/yyyy HH:mm", { locale: ptBR }),
        format(new Date(item.dataHoraFim), "dd/MM/yyyy HH:mm", { locale: ptBR }),
        item.status,
      ])

      // Configurar tabela usando autoTable
      autoTable(doc, {
        head: [["Professor", "Turma", "Disciplina", "Laboratório", "Início", "Fim", "Status"]],
        body: tableData,
        startY: 55,
        styles: {
          fontSize: 8,
          cellPadding: 3,
        },
        headStyles: {
          fillColor: [71, 85, 105], // gray-600
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [248, 250, 252], // gray-50
        },
        columnStyles: {
          0: { cellWidth: 25 }, // Professor
          1: { cellWidth: 20 }, // Turma
          2: { cellWidth: 25 }, // Disciplina
          3: { cellWidth: 25 }, // Laboratório
          4: { cellWidth: 25 }, // Início
          5: { cellWidth: 25 }, // Fim
          6: { cellWidth: 20 }, // Status
        },
      })

      // Salvar o PDF
      doc.save(`relatorio-auditoria-${format(new Date(), "yyyy-MM-dd-HHmm")}.pdf`)
      toast.success("Relatório PDF gerado com sucesso!")
    } catch (error) {
      console.error("Erro ao gerar PDF:", error)
      toast.error("Erro ao gerar relatório PDF")
    }
  }

  // Limpar todos os filtros
  const limparFiltros = () => {
    setSearchTerm("")
    setStatusFilter("todos")
    setProfessorFilter("todos")
    setLaboratorioFilter("todos")
  }

  return (
    <div className="container mx-auto py-8 ml-2 w-[70rem] space-y-6">
      {/* Header */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-blue-900">
            <FileText className="h-6 w-6" />
            Relatório de Auditoria
            <Badge variant="outline" className="bg-white text-blue-700">
              {dadosFiltrados.length} registros
            </Badge>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Filtros e Ações */}
      <Card className="border-gray-200 bg-gray-50 shadow-sm">
        <CardHeader>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              {/* Busca */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar por professor, turma, disciplina..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-300"
                />
              </div>

              {/* Filtro de Status */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px] bg-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Status</SelectItem>
                  {statusUnicos.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Filtro de Professor */}
              <Select value={professorFilter} onValueChange={setProfessorFilter}>
                <SelectTrigger className="w-full sm:w-[180px] bg-white">
                  <SelectValue placeholder="Professor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Professores</SelectItem>
                  {professoresUnicos.map((professor) => (
                    <SelectItem key={professor} value={professor}>
                      {professor}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Filtro de Laboratório */}
              <Select value={laboratorioFilter} onValueChange={setLaboratorioFilter}>
                <SelectTrigger className="w-full sm:w-[180px] bg-white">
                  <SelectValue placeholder="Laboratório" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Laboratórios</SelectItem>
                  {laboratoriosUnicos.map((lab) => (
                    <SelectItem key={lab} value={lab}>
                      {lab}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Ações */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={limparFiltros}
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                <Filter className="h-4 w-4 mr-2" />
                Limpar
              </Button>

              <Button
                variant="outline"
                onClick={carregarHistorico}
                disabled={loading}
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Atualizar
              </Button>

              <Button
                onClick={gerarPDF}
                disabled={dadosFiltrados.length === 0}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar PDF
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Estatísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Reservas</p>
                <p className="text-2xl font-bold text-gray-900">{dadosFiltrados.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aprovadas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dadosFiltrados.filter((item) => item.status === "Aprovada").length}
                </p>
              </div>
              <User className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Laboratórios</p>
                <p className="text-2xl font-bold text-gray-900">{laboratoriosUnicos.length}</p>
              </div>
              <Building2 className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Professores</p>
                <p className="text-2xl font-bold text-gray-900">{professoresUnicos.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Dados */}
      <Card className="border-gray-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Histórico de Reservas</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader className="h-8 w-8 animate-spin text-gray-500" />
              <span className="ml-2 text-gray-700">Carregando dados...</span>
            </div>
          ) : dadosFiltrados.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="w-[15%]">Professor</TableHead>
                    <TableHead className="w-[10%]">Turma</TableHead>
                    <TableHead className="w-[15%]">Disciplina</TableHead>
                    <TableHead className="w-[15%]">Laboratório</TableHead>
                    <TableHead className="w-[15%]">Início</TableHead>
                    <TableHead className="w-[15%]">Fim</TableHead>
                    <TableHead className="w-[10%]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dadosFiltrados.map((item, index) => (
                    <TableRow key={index} className="hover:bg-gray-50">
                      <TableCell className="font-medium">{item.professor}</TableCell>
                      <TableCell>{item.turma}</TableCell>
                      <TableCell>{item.disciplina}</TableCell>
                      <TableCell>{item.laboratorio}</TableCell>
                      <TableCell>
                        {format(new Date(item.dataHoraInicio), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                      </TableCell>
                      <TableCell>{format(new Date(item.dataHoraFim), "dd/MM/yyyy HH:mm", { locale: ptBR })}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(item.status)}>{item.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center p-8">
              <FileText className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum dado encontrado</h3>
              <p className="text-sm text-gray-500">
                {historico.length === 0
                  ? "Não há dados de auditoria disponíveis"
                  : "Tente ajustar os filtros para ver mais resultados"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
