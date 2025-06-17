"use client"
import { useState } from "react"
import { useUserProfile } from "@/hooks/useUserProfile"
import { deleteCookie } from "@/lib/cookies"
import { useRouter } from "next/navigation"
import { getFuncaoLabel } from "@/lib/constants"

import {
  Home,
  BookOpenCheck,
  Info,
  ChevronUp,
  TestTubeDiagonal,
  Ungroup,
  Users,
  LogOut,
  User,
  Mail,
  Hash,
  GraduationCap,
  Briefcase,
} from "lucide-react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

const items = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Reservas",
    url: "/reservas",
    icon: BookOpenCheck,
  },
  {
    title: "Laboratórios",
    url: "/labs",
    icon: TestTubeDiagonal,
  },
  {
    title: "Turmas",
    url: "/turmas",
    icon: Ungroup,
  },
  {
    title: "Relatório",
    url: "/relatorio",
    icon: Info,
  },
]

export function AppSidebar() {
  const router = useRouter()
  const [abrirDialogo, setDialogo] = useState(false)
  const { userProfile, loading, error } = useUserProfile()

  const handleLogout = () => {
    deleteCookie("token")
    router.push("/login")
  }

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-3 sm:p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-800 text-white">
            <TestTubeDiagonal className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-gray-900">Lab Manager</span>
            <span className="text-xs text-gray-500">Sistema de Laboratórios</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex flex-col h-full">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-medium text-gray-600 px-3">Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="w-full hover:bg-gray-50">
                    <a
                      href={item.url}
                      className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:text-gray-900"
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <Dialog open={abrirDialogo} onOpenChange={setDialogo}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <User className="h-5 w-5" />
              Perfil do Usuário
            </DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-gray-800"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
              </div>
            ) : userProfile ? (
              <div className="space-y-4">
                {/* Avatar */}
                <div className="flex justify-center">
                  <div className="relative">
                    <Image
                      src="/image.png"
                      width={80}
                      height={80}
                      className="rounded-full border-2 border-gray-200"
                      alt="Avatar do usuário"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* Nome e Função */}
                <div className="text-center space-y-1">
                  <h3 className="font-semibold text-gray-900">{userProfile.nome}</h3>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
                    {getFuncaoLabel(userProfile.funcao)}
                  </Badge>
                </div>

                <Separator className="bg-gray-200" />

                {/* Informações */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                    <Hash className="h-4 w-4 text-gray-500 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500 font-medium">ID</p>
                      <p className="text-sm text-gray-900">{userProfile.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                    <Hash className="h-4 w-4 text-gray-500 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500 font-medium">Matrícula</p>
                      <p className="text-sm text-gray-900">{userProfile.matricula || "Não informado"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                    <Mail className="h-4 w-4 text-gray-500 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-500 font-medium">E-mail</p>
                      <p className="text-sm text-gray-900 truncate">{userProfile.emailInstitucional}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-2 rounded-lg bg-blue-50">
                    <GraduationCap className="h-4 w-4 text-blue-600 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-blue-600 font-medium">Curso</p>
                      <p className="text-sm text-blue-900 font-medium">{userProfile.cursoNome}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-2 rounded-lg bg-green-50">
                    <Briefcase className="h-4 w-4 text-green-600 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-green-600 font-medium">Função</p>
                      <p className="text-sm text-green-900 font-medium">{getFuncaoLabel(userProfile.funcao)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-gray-500">Nenhum dado de perfil disponível</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <SidebarFooter className="p-3 border-t border-gray-100">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                    <Users className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex flex-col items-start min-w-0 flex-1">
                    {loading ? (
                      <div className="space-y-1">
                        <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                        <div className="h-2 bg-gray-200 rounded w-12 animate-pulse"></div>
                      </div>
                    ) : userProfile ? (
                      <>
                        <span className="text-sm font-medium text-gray-900 truncate max-w-full">
                          {userProfile.nome.split(" ")[0]}
                        </span>
                        <span className="text-xs text-gray-500 truncate max-w-full">{userProfile.cursoNome}</span>
                      </>
                    ) : (
                      <span className="text-sm text-gray-700">Perfil</span>
                    )}
                  </div>
                  <ChevronUp className="ml-auto w-4 h-4 shrink-0 text-gray-400" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                <DropdownMenuItem onClick={() => setDialogo(true)} className="cursor-pointer flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Ver Perfil</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer flex items-center gap-2 text-red-600 hover:!text-red-800 focus:!text-red-800"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
