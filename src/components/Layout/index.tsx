import { ThemeToggle } from "@/components/ThemeToggle";
import backgroundMovies from "@/assets/backgroundMovies.png";
import logoMovies from "@/assets/logoMovies.png";

export function Layout({ children }: { children: React.ReactNode }) {
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
        <div className="flex items-center gap-2">
          <img
            src={logoMovies}
            alt="Cubos"
            className="h-6 w-auto select-none"
            draggable={false}
          />
          <span className="text-white/90 font-medium tracking-wide">
            Movies
          </span>
        </div>
        <ThemeToggle />
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
