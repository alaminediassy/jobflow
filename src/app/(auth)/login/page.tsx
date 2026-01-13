"use client";
import { useState } from "react";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Briefcase } from "lucide-react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/dashboard");
        } catch (err: any) { setError("Email ou mot de passe incorrect."); setLoading(false); }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError("");
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
            router.push("/dashboard");
        } catch (err: any) { setError("Erreur Google."); setLoading(false); }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-[var(--background)] transition-colors">
            <div className="max-w-md w-full bg-[var(--sidebar)] p-8 md:p-10 rounded-3xl shadow-xl shadow-orange-500/5 border border-[var(--border)] space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-black text-[var(--foreground)] tracking-tighter uppercase italic">Job<span className="text-orange-500">Flow</span></h1>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-bold text-xs uppercase tracking-widest">Connectez-vous à votre futur</p>
                </div>

                {error && (
                    <div className="bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-xs font-black uppercase tracking-wider text-center border border-red-100 dark:border-red-900/30 animate-shake">
                        {error}
                    </div>
                )}

                <form onSubmit={handleEmailLogin} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Email</label>
                        <input
                            type="email"
                            className="input-standard h-11"
                            placeholder="nom@exemple.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-widest ml-1">Mot de passe</label>
                        <input
                            type="password"
                            className="input-standard h-11"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit" disabled={loading} className="w-full h-11 font-black uppercase tracking-widest text-xs mt-2">
                        {loading ? "Chargement..." : "Se connecter"}
                    </Button>
                </form>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[var(--border)]"></div>
                    </div>
                    <div className="relative flex justify-center text-[10px] font-black uppercase tracking-widest">
                        <span className="bg-[var(--sidebar)] px-4 text-gray-400">Ou continuer avec</span>
                    </div>
                </div>

                <Button onClick={handleGoogleLogin} disabled={loading} variant="outline" className="w-full h-11 font-black uppercase tracking-widest text-xs gap-3">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/smartlock/google.svg" className="w-4 h-4" alt="Google" />
                    Google
                </Button>

                <p className="text-center text-xs font-bold text-gray-500 dark:text-zinc-400">
                    Pas de compte ? <Link href="/register" className="text-orange-600 dark:text-orange-500 hover:underline">Créer un accès gratuit</Link>
                </p>
            </div>
        </div>
    );
}
