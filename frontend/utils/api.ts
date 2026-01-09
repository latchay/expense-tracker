const API_URL = "http://localhost:5000/api";

let token: string | null = null;

export const setToken = (newToken: string) => {
  token = newToken;
  localStorage.setItem("token", newToken);
};

export const loadToken = () => {
  token = localStorage.getItem("token");
};

export const clearToken = () => {
  token = null;
  localStorage.removeItem("token");
};

export const apiFetch = async (
  endpoint: string,
  options: RequestInit = {}
) => {
  loadToken();

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};
