"use client"
import LoginForm from "../loginForm/page"

export default function RegisterForm() {
  // O RegisterForm agora é apenas um wrapper que renderiza o LoginForm
  // O LoginForm gerencia ambos os formulários e a navegação entre eles
  return <LoginForm />
}
