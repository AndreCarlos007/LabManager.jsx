"use client"
import { useState } from "react"
import { loginUser } from "../../../lib/api"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Mail, Lock, Eye, EyeOff, User, GraduationCap, Briefcase } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { registerUser } from "../../../lib/api"

export default function LoginForm() {
  const [currentView, setCurrentView] = useState("login")
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Login form state
  const [loginData, setLoginData] = useState({
    matriculaOuEmail: "",
    senha: "",
  })
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState(null)

  // Register form state
  const [registerData, setRegisterData] = useState({
    nome: "",
    emailInstitucional: "",
    senha: "",
    funcao: 0,
    cursoId: 1,
  })
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [registerLoading, setRegisterLoading] = useState(false)
  const [registerError, setRegisterError] = useState(null)
  const [registerSuccess, setRegisterSuccess] = useState(false)

  const router = useRouter()

  const switchView = (newView) => {
    if (newView === currentView || isTransitioning) return

    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentView(newView)
      setIsTransitioning(false)
      // Reset errors when switching
      setLoginError(null)
      setRegisterError(null)
      setRegisterSuccess(false)
    }, 300)
  }

  // Login handlers
  const handleLoginChange = (e) => {
    const { name, value } = e.target
    setLoginData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError(null)

    try {
      const response = await loginUser(loginData)
      const token = response.token || response.accessToken || response.access_token

      if (!token) {
        throw new Error("Token não encontrado na resposta da API")
      }

      document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`
      router.push("/dashboard")
    } catch (err) {
      setLoginError(err.message || "Credenciais inválidas. Tente novamente.")
    } finally {
      setLoginLoading(false)
    }
  }

  // Register handlers
  const handleRegisterChange = (e) => {
    const { name, value } = e.target
    setRegisterData((prev) => ({
      ...prev,
      [name]: name === "funcao" || name === "cursoId" ? Number.parseInt(value) : value,
    }))
  }

  const handleSelectChange = (name, value) => {
    setRegisterData((prev) => ({
      ...prev,
      [name]: Number.parseInt(value),
    }))
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()
    setRegisterLoading(true)
    setRegisterError(null)

    try {
      await registerUser(registerData)
      setRegisterSuccess(true)

      setTimeout(() => {
        switchView("login")
        setRegisterData({
          nome: "",
          emailInstitucional: "",
          senha: "",
          funcao: 0,
          cursoId: 1,
        })
        setRegisterSuccess(false)
      }, 2000)
    } catch (err) {
      setRegisterError(err.message || "Erro durante o registro")
    } finally {
      setRegisterLoading(false)
    }
  }

  const funcoes = [
    { id: 0, label: "Professor" },
    { id: 1, label: "Coordenador de Curso" },
    { id: 2, label: "Coordenador de Laboratório" },
    { id: 3, label: "Reitoria" },
    { id: 4, label: "Técnico" },
    { id: 5, label: "Auditor" },
  ]

  const cursos = [
    { id: 1, label: "Engenharia de Software" },
    { id: 2, label: "Ciência da Computação" },
    { id: 3, label: "Sistemas de Informação" },
    { id: 4, label: "Análise e Desenvolvimento de Sistemas" },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-gray-700 to-gray-900 rounded-2xl mb-4 shadow-lg">
            <span className="text-2xl font-bold text-white">LM</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lab Manager</h1>
          <p className="text-gray-600">Sistema de Gerenciamento de Laboratórios</p>
        </div>

        {/* Navigation tabs */}
        <div className="flex bg-gray-200 rounded-lg p-1 mb-6">
          <Button
            variant={currentView === "login" ? "default" : "ghost"}
            className={`flex-1 transition-all duration-200 ${
              currentView === "login"
                ? "bg-white shadow-sm text-gray-900 hover:bg-white"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
            onClick={() => switchView("login")}
            disabled={isTransitioning}
          >
            Entrar
          </Button>
          <Button
            variant={currentView === "register" ? "default" : "ghost"}
            className={`flex-1 transition-all duration-200 ${
              currentView === "register"
                ? "bg-white shadow-sm text-gray-900 hover:bg-white"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
            onClick={() => switchView("register")}
            disabled={isTransitioning}
          >
            Registrar
          </Button>
        </div>

        {/* Form container with slide animation */}
        <div className="relative overflow-hidden">
          <div
            className={`transition-transform duration-300 ease-in-out ${
              isTransitioning
                ? currentView === "login"
                  ? "transform translate-x-full"
                  : "transform -translate-x-full"
                : "transform translate-x-0"
            }`}
          >
            <Card className="border-gray-200 shadow-xl bg-white">
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-2xl font-semibold text-center text-gray-900">
                  {currentView === "login" ? "Bem-vindo de volta" : "Criar conta"}
                </CardTitle>
                <CardDescription className="text-center text-gray-600">
                  {currentView === "login"
                    ? "Entre com suas credenciais para acessar o sistema"
                    : "Preencha os dados para criar sua conta"}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {currentView === "login" ? (
                  // LOGIN FORM
                  <form onSubmit={handleLoginSubmit} className="space-y-4">
                    {loginError && (
                      <Alert variant="destructive">
                        <AlertDescription>{loginError}</AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="matriculaOuEmail" className="text-sm font-medium text-gray-700">
                        Email ou Matrícula
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="matriculaOuEmail"
                          name="matriculaOuEmail"
                          type="text"
                          placeholder="seu.email@instituicao.edu"
                          value={loginData.matriculaOuEmail}
                          onChange={handleLoginChange}
                          className="pl-10 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                          required
                          disabled={loginLoading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="senha" className="text-sm font-medium text-gray-700">
                        Senha
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="senha"
                          name="senha"
                          type={showLoginPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={loginData.senha}
                          onChange={handleLoginChange}
                          className="pl-10 pr-10 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                          required
                          disabled={loginLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          disabled={loginLoading}
                        >
                          {showLoginPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gray-800 hover:bg-gray-900 text-white"
                      disabled={loginLoading}
                    >
                      {loginLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Entrando...
                        </>
                      ) : (
                        "Entrar"
                      )}
                    </Button>

                    <div className="text-center">
                      <Button
                        type="button"
                        variant="link"
                        className="text-sm text-gray-600 hover:text-gray-900"
                        onClick={() => switchView("register")}
                        disabled={loginLoading}
                      >
                        Não tem uma conta? Registre-se
                      </Button>
                    </div>
                  </form>
                ) : (
                  // REGISTER FORM
                  <form onSubmit={handleRegisterSubmit} className="space-y-4">
                    {registerError && (
                      <Alert variant="destructive">
                        <AlertDescription>{registerError}</AlertDescription>
                      </Alert>
                    )}

                    {registerSuccess && (
                      <Alert className="border-green-200 bg-green-50">
                        <AlertDescription className="text-green-800">
                          Conta criada com sucesso! Redirecionando para o login...
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="nome" className="text-sm font-medium text-gray-700">
                        Nome Completo
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="nome"
                          name="nome"
                          type="text"
                          placeholder="Seu nome completo"
                          value={registerData.nome}
                          onChange={handleRegisterChange}
                          className="pl-10 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                          required
                          disabled={registerLoading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emailInstitucional" className="text-sm font-medium text-gray-700">
                        Email Institucional
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="emailInstitucional"
                          name="emailInstitucional"
                          type="email"
                          placeholder="seu.email@instituicao.edu"
                          value={registerData.emailInstitucional}
                          onChange={handleRegisterChange}
                          className="pl-10 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                          required
                          disabled={registerLoading}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="registerSenha" className="text-sm font-medium text-gray-700">
                        Senha
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="registerSenha"
                          name="senha"
                          type={showRegisterPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={registerData.senha}
                          onChange={handleRegisterChange}
                          className="pl-10 pr-10 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
                          required
                          minLength={6}
                          disabled={registerLoading}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                          disabled={registerLoading}
                        >
                          {showRegisterPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <Briefcase className="h-4 w-4" />
                          Função
                        </Label>
                        <Select
                          value={registerData.funcao.toString()}
                          onValueChange={(value) => handleSelectChange("funcao", value)}
                          disabled={registerLoading}
                        >
                          <SelectTrigger className="border-gray-300 focus:border-gray-500 focus:ring-gray-500">
                            <SelectValue placeholder="Selecione sua função" />
                          </SelectTrigger>
                          <SelectContent>
                            {funcoes.map((funcao) => (
                              <SelectItem key={funcao.id} value={funcao.id.toString()}>
                                {funcao.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <GraduationCap className="h-4 w-4" />
                          Curso
                        </Label>
                        <Select
                          value={registerData.cursoId.toString()}
                          onValueChange={(value) => handleSelectChange("cursoId", value)}
                          disabled={registerLoading}
                        >
                          <SelectTrigger className="border-gray-300 focus:border-gray-500 focus:ring-gray-500">
                            <SelectValue placeholder="Selecione o curso" />
                          </SelectTrigger>
                          <SelectContent>
                            {cursos.map((curso) => (
                              <SelectItem key={curso.id} value={curso.id.toString()}>
                                {curso.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gray-800 hover:bg-gray-900 text-white"
                      disabled={registerLoading}
                    >
                      {registerLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Criando conta...
                        </>
                      ) : (
                        "Criar conta"
                      )}
                    </Button>

                    <div className="text-center">
                      <Button
                        type="button"
                        variant="link"
                        className="text-sm text-gray-600 hover:text-gray-900"
                        onClick={() => switchView("login")}
                        disabled={registerLoading}
                      >
                        Já tem uma conta? Entre aqui
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

       
      </div>
    </div>
  )
}
