import axios, { AxiosError } from "axios";

const baseURL = import.meta.env.VITE_API_URL ?? "/api";

const api = axios.create({
  baseURL,
  withCredentials: false,
});

function getAccessToken(): string | null {
  return sessionStorage.getItem("accessToken");
}
function clearSession(): void {
  try {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("user");
  } catch {
    /* */
  }
}
function redirectToLoginWithNext(): void {
  const current =
    window.location.pathname + window.location.search + window.location.hash;

  if (current.startsWith("/auth/")) return;

  const next = encodeURIComponent(current);
  window.location.replace(`/auth/login?next=${next}`);
}

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    const status = err.response?.status;
    if (status === 401) {
      clearSession();
      redirectToLoginWithNext();
    }
    return Promise.reject(err);
  }
);

export default api;
