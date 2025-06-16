const API_URL = "https://labmanagers-bgfbepbvgvgwd5ff.brazilsouth-01.azurewebsites.net/api";

export async function registerUser(userData) {
  try {
    const res = await fetch(`${API_URL}/Usuario/registrar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const text = await res.text();
    
    if (!res.ok) {
      try {
        const error = JSON.parse(text);
        throw new Error(error.message || `Falha no registro: ${res.statusText}`);
      } catch {
        throw new Error(text || `Falha no registro: ${res.statusText}`);
      }
    }

    
    if (!text) {
      return { success: true }; 
    }

    try {
      return JSON.parse(text);
    } catch (err) {
      return { message: text };
    }
    
  } catch (err) {
    throw new Error(err.message || "Erro de conexão com o servidor");
  }
}

export async function loginUser(credentials) {
  try {
    const res = await fetch(`${API_URL}/Usuario/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    // Verifica se a resposta está vazia
    if (res.status === 204) {
      return { success: true }; // Resposta vazia é considerada sucesso
    }

    const text = await res.text();
    
    if (!res.ok) {
      try {
        const error = JSON.parse(text);
        throw new Error(error.message || `Falha no login: ${res.statusText}`);
      } catch {
        throw new Error(text || `Falha no login: ${res.statusText}`);
      }
    }

    // Tenta parsear apenas se houver conteúdo
    if (text) {
      try {
        return JSON.parse(text);
      } catch (err) {
        // Se não for JSON válido, retorna o texto como token
        return { token: text };
      }
    }
    
    return { success: true };
    
  } catch (err) {
    throw new Error(err.message || "Erro de conexão com o servidor");
  }
}

// Obter perfil do usuário
export async function getUserProfile(token) {
  try {
    const res = await fetch(`${API_URL}/Usuario/perfil`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const text = await res.text();
    
    if (!res.ok) {
      try {
        const error = JSON.parse(text);
        throw new Error(error.message || `Falha ao obter perfil: ${res.statusText}`);
      } catch {
        throw new Error(text || `Falha ao obter perfil: ${res.statusText}`);
      }
    }

    try {
      return JSON.parse(text);
    } catch (err) {
      throw new Error("Resposta da API malformada");
    }
    
  } catch (err) {
    throw new Error(err.message || "Erro de conexão com o servidor");
  }
}