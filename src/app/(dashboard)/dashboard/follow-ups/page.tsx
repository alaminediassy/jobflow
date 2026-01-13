"use client";
import { useApplications } from "@/hooks/use-applications";
import { calculateMetrics } from "@/lib/firestore";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { AlertCircle, Clock, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FollowUpsPage() {
    const { data: apps, isLoading, error } = useApplications();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-4 shadow-lg shadow-orange-500/20"></div>
                <p className="text-gray-500 dark:text-zinc-500 font-black uppercase text-xs tracking-widest animate-pulse">Vérification...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl text-center">
                <h2 className="text-red-800 dark:text-red-400 font-bold text-xl mb-4">Erreur de chargement</h2>
                <p className="text-red-600 dark:text-red-300 max-w-md mx-auto mb-6">
                    {error instanceof Error ? error.message : "Impossible de charger vos relances."}
                </p>
                <p className="text-sm text-gray-500 dark:text-zinc-400">
                    💡 Astuce : Vérifie ta connexion ou rafraîchis la page.
                </p>
            </div>
        );
    }

    // Filter only due follow-ups
    const dueApps = apps?.filter(app => calculateMetrics(app).isFollowUpDue) || [];

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black text-[var(--foreground)] tracking-tight">Relances Prioritaires</h2>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm font-semibold mt-1">Actions requises pour maintenir le momentum de votre recherche.</p>
                </div>
                <div className="flex items-center gap-2 bg-orange-500/10 dark:bg-orange-500/10 px-4 py-2 rounded-2xl border border-orange-500/20">
                    <span className="text-orange-600 dark:text-orange-500 font-black text-xl leading-none">{dueApps.length}</span>
                    <span className="text-[10px] font-black text-orange-800/80 dark:text-orange-400/60 uppercase tracking-widest leading-none">Candidatures</span>
                </div>
            </div>

            <div className="grid gap-4 mt-8">
                {dueApps.length === 0 ? (
                    <div className="bg-[var(--sidebar)] border border-[var(--border)] p-12 rounded-3xl text-center flex flex-col items-center shadow-sm">
                        <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6">
                            <CheckCircle2 className="text-green-500" size={32} />
                        </div>
                        <h3 className="text-xl font-black text-[var(--foreground)] uppercase tracking-tight">Tout est à jour !</h3>
                        <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-semibold max-w-xs">Vous n'avez aucune relance urgente à effectuer pour le moment. Beau travail !</p>
                    </div>
                ) : (
                    dueApps.map(app => (
                        <div key={app.id} className="bg-[var(--sidebar)] p-5 md:p-6 rounded-2xl border border-[var(--border)] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-[var(--primary)]/50 transition-all">
                            <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-2">
                                    <h3 className="text-lg md:text-xl font-black text-[var(--foreground)] uppercase tracking-tight">{app.company}</h3>
                                    <div className="h-1 w-1 rounded-full bg-zinc-300 dark:bg-zinc-700 hidden sm:block" />
                                    <p className="text-zinc-600 dark:text-zinc-400 font-bold text-sm md:text-base">{app.role}</p>
                                </div>

                                <div className="flex flex-wrap items-center gap-4 text-xs">
                                    <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-500 font-black uppercase tracking-tighter">
                                        <Clock size={14} className="text-[var(--primary)]" />
                                        <span>Dû le : <span className="text-[var(--foreground)] ml-1">{app.nextActionDate && format(app.nextActionDate, "dd MMMM", { locale: fr })}</span></span>
                                    </div>
                                    <div className="bg-zinc-100 dark:bg-zinc-950 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-600 border border-[var(--border)]">
                                        {app.status}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between w-full md:w-auto mt-2 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-[var(--border)]/50">
                                <span className="flex items-center gap-1.5 text-orange-600 dark:text-orange-500 font-black text-[10px] md:text-xs uppercase tracking-widest animate-pulse">
                                    <AlertCircle size={14} /> Action Due
                                </span>
                                <div className="md:ml-6">
                                    <Link href={`/dashboard/applications/${app.id}/edit`}>
                                        <Button variant="default" size="sm" className="font-bold px-6 rounded-xl shadow-lg shadow-orange-500/20">Traiter</Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
