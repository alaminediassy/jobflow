import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#000000] text-white selection:bg-orange-500/30">
      {/* Navbar Minimaliste */}
      <nav className="fixed top-0 w-full z-50 border-b border-zinc-900/50 bg-black/50 backdrop-blur-xl px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-black tracking-tighter italic uppercase">
            Job<span className="text-orange-500">Flow</span>
          </h1>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/login" className="text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
            <Button size="sm" className="bg-transparent hover:bg-orange-500 text-orange-500 hover:text-white font-black uppercase tracking-widest text-[10px] rounded-full px-5 h-9 border border-orange-500">
              Se connecter
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm" className="bg-orange-600 hover:bg-orange-500 text-white font-black uppercase tracking-widest text-[10px] rounded-full px-5 h-9">
              Essayer
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Gradients de fond */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 pointer-events-none opacity-50">
          <div className="absolute top-[10%] right-[-5%] w-[600px] h-[600px] bg-orange-600/20 blur-[150px] rounded-full animate-pulse" />
          <div className="absolute top-[40%] left-[-5%] w-[500px] h-[500px] bg-red-600/10 blur-[150px] rounded-full" />
        </div>

        <div className="max-w-5xl mx-auto text-center space-y-10">
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[0.85] italic uppercase">
            Transformez votre <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-orange-400 to-red-500">Recherche</span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Finis les tableurs Excel interminables pour le suivi de vos candidatures.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-zinc-900 bg-black text-center">
        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">
          &copy; {new Date().getFullYear()} Mamadou Lamine DIASSY - All rights reserved
        </p>
      </footer>
    </div>
  );
}
