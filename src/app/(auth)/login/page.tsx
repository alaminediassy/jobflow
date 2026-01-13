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

                <Button onClick={handleGoogleLogin} disabled={loading} variant="outline" className="w-full h-11 font-black uppercase tracking-widest text-xs gap-3 border-zinc-800 hover:bg-zinc-900 transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                            fill="#EA4335"
                            d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z"
                        />
                        <path
                            fill="#34A853"
                            d="M16.04 18.013c-1.09.593-2.325.896-3.64.896-3.136 0-5.89-2.099-6.84-4.89l-4.154 3.21C3.304 21.063 7.345 24 12 24c3.055 0 5.782-1.027 7.782-2.773l-3.742-3.214Z"
                        />
                        <path
                            fill="#4285F4"
                            d="M19.782 21.227C22.4 18.945 24 15.655 24 12c0-.855-.073-1.682-.21-2.482H12v4.709h6.727c-.29 1.536-1.155 2.836-2.455 3.709l3.51 3.299Z"
                        />
                        <path
                            fill="#FBBC05"
                            d="M5.56 12.012c0-.654.109-1.282.309-1.872l-4.027-3.114A11.91 11.91 0 0 0 0 12c0 1.83.418 3.555 1.155 5.09l4.154-3.21a7.03 7.03 0 0 1-.05-1.868Z"
                        />
                    </svg>
                    Google
                </Button>

                <p className="text-center text-xs font-bold text-gray-500 dark:text-zinc-400">
                    Pas de compte ? <Link href="/register" className="text-orange-600 dark:text-orange-500 hover:underline">Créer un accès gratuit</Link>
                </p>
            </div>
        </div>
    );
}
