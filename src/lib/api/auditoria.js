const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://labmanagers-bgfbepbvgvgwd5ff.brazilsouth-01.azurewebsites.net"

const getToken = () => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1]
}

export const obterHistoricoAuditoria = async () => {
  const token = getToken()
  const res = await fetch(`${API_URL}/api/Auditoria/historico`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    const error = await res.text()
    throw new Error(error || "Falha ao obter histórico de auditoria")
  }

  return res.json()
}
