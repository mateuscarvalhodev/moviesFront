import { ThemeToggle } from "@/components/ThemeToggle";
import backgroundMovies from "@/assets/backgroundMovies.png";
import logoMovies from "@/assets/logoMovies.png";
import { useEffect, useState, type ReactNode } from "react";
import { AppButton } from "../Button";
import { logout } from "@/service/authApi";
import { Link } from "react-router";

function isAuthenticated() {
  return Boolean(sessionStorage.getItem("accessToken"));
}

function signOut() {
  try {
    sessionStorage.removeItem("accessToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("user");
    logout();
  } catch {
    /* */
  }
  window.location.replace("/auth/login");
}

export function Layout({ children }: { children: ReactNode }) {
  const [logged, setLogged] = useState<boolean>(isAuthenticated());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (!e.key) return;
      if (["accessToken", "refreshToken", "user"].includes(e.key)) {
        setLogged(isAuthenticated());
      }
    };
    window.addEventListener("storage", onStorage);

    const onAuthChanged = () => setLogged(isAuthenticated());
    window.addEventListener("auth:changed", onAuthChanged);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth:changed", onAuthChanged);
    };
  }, []);

  return (
    <div className="relative isolate min-h-dvh flex flex-col bg-bg text-fg">
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundMovies})` }}
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/95 to-black/99"
          aria-hidden
        />
      </div>

      <header className="relative z-10 flex items-center justify-between px-4 py-3 backdrop-blur-sm bg-black/40 border-b border-white/10">
        <Link
          to="/movies"
          className="flex items-center gap-2 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[--focus]"
          aria-label="Ir para a lista de filmes"
          title="Ir para Filmes"
        >
          <img
            src={logoMovies}
            alt="Cubos"
            className="h-6 w-auto select-none"
            draggable={false}
          />
          <span className="text-white/90 font-medium tracking-wide">
            Movies
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {logged && (
            <AppButton variant="brand" onClick={signOut}>
              Deslogar
            </AppButton>
          )}
          <ThemeToggle />
        </div>
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center p-4">
        {children}
      </main>

      <footer className="relative z-10 text-center text-white/80 p-4 text-sm backdrop-blur-sm bg-black/30 border-t border-white/10">
        2025 © Todos os direitos reservados a Cubos Movies
      </footer>
    </div>
  );
}
