"use client";
import { useState, useEffect } from "react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { getCookie, deleteCookie } from "@/lib/cookies";
import { useRouter } from "next/navigation";

import {
  Home,
  BookOpenCheck,
  Info,
  ChevronUp,
  TestTubeDiagonal,
  Ungroup,
  Users,
  DatabaseBackup,
  LogOut,
  User,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
} from "@/components/ui/sidebar";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";

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
];

// Função para formatar o nome da função
const getFuncaoLabel = (funcaoId) => {
  const funcoes = {
    0: "Professor",
    1: "Coordenador de Curso",
    2: "Coordenador de Laboratório",
    3: "Reitoria",
    4: "Técnico",
    5: "Auditor"
  };
  return funcoes[funcaoId] || "Desconhecido";
};

export function AppSidebar() {
  const router = useRouter();
  const [abrirDialogo, setDialogo] = useState(false);
  const { userProfile, loading, error } = useUserProfile();

  const handleLogout = () => {
    deleteCookie('token');
    router.push('/login');
  };

  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent className="flex flex-col h-full">
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <Dialog open={abrirDialogo} onOpenChange={setDialogo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">Perfil</DialogTitle>
            <DialogDescription>
              {loading ? (
                <span className="flex justify-center py-4">
                  <span className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500"></span>
                </span>
              ) : error ? (
                <p className="text-red-500">{error}</p>
              ) : userProfile ? (
                <span className="space-y-2">
                  <span className="flex justify-center mb-4">
                     <Image src='/image.png' width={100} height={100} className="rounded-2xl" alt="Avatar Perfil"/>
                  </span>
                  
                  <span className="grid grid-cols-2 gap-2">
                    <span className="font-medium">ID:</span>
                    <span>{userProfile.id}</span>
                    
                    <span className="font-medium">Nome:</span>
                    <span>{userProfile.nome}</span>
                    
                    <span className="font-medium">Matrícula:</span>
                    <span>{userProfile.matricula || 'N/A'}</span>
                    
                    <span className="font-medium">E-Mail:</span>
                    <span>{userProfile.emailInstitucional}</span>
                    
                    <span className="font-medium">Curso:</span>
                    <span>{userProfile.cursoNome}</span>
                    
                    <span className="font-medium">Função:</span>
                    <span>{getFuncaoLabel(userProfile.funcao)}</span>
                  </span>
                </span>
              ) : (
                <p>Nenhum dado de perfil disponível</p>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="flex items-center gap-2 cursor-pointer">
                  <Users className="w-4 h-4" />
                  {loading ? (
                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                  ) : userProfile ? (
                    <span className="truncate max-w-[120px]">
                      {userProfile.nome.split(' ')[0]}
                    </span>
                  ) : (
                    'Perfil'
                  )}
                  <ChevronUp className="ml-auto w-4 h-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem
                  onClick={() => setDialogo(true)}
                  className="cursor-pointer flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer flex items-center gap-2 text-red-600 hover:!text-red-800"
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
  );
}