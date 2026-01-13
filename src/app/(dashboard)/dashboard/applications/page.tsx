"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useApplications, useDeleteApplication } from "@/hooks/use-applications";
import { calculateMetrics } from "@/lib/firestore";
import { StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Plus } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function ApplicationsPage() {
    const { data: apps, isLoading, error } = useApplications();
    const deleteMutation = useDeleteApplication();
    const [filterStatus, setFilterStatus] = useState<string>("All");

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 animate-pulse">Chargement de la liste...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-xl text-center">
                <h2 className="text-red-800 dark:text-red-400 font-bold text-xl mb-4">Erreur de chargement</h2>
                <p className="text-red-600 dark:text-red-300 max-w-md mx-auto mb-6">
                    {error instanceof Error ? error.message : "Impossible de charger vos candidatures."}
                </p>
                <p className="text-sm text-gray-500 dark:text-zinc-400">
                    💡 Astuce : Vérifie ta connexion ou rafraîchis la page.
                </p>
            </div>
        );
    }
    const filteredApps = apps?.filter(app => filterStatus === "All" || app.status === filterStatus) || [];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl md:text-3xl font-black text-[var(--foreground)] tracking-tight">Mes Candidatures</h2>
                    <p className="text-zinc-500 dark:text-zinc-400 text-sm font-semibold">Suivez l'état de vos postulations en temps réel.</p>
                </div>
                <Link href="/dashboard/applications/new">
                    <Button className="font-bold shrink-0 shadow-lg shadow-orange-500/20"><Plus size={18} className="mr-2" /> Nouvelle</Button>
                </Link>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                {["All", "To apply", "Interview", "Offer"].map(s => (
                    <button
                        key={s}
                        onClick={() => setFilterStatus(s)}
                        className={cn(
                            "px-5 py-2 rounded-full text-[10px] font-black whitespace-nowrap transition-all uppercase tracking-widest border",
                            filterStatus === s
                                ? "bg-[var(--primary)] text-white border-[var(--primary)] shadow-lg shadow-orange-500/30"
                                : "bg-[var(--sidebar)] text-zinc-500 border-[var(--border)] hover:border-[var(--primary)]/50"
                        )}
                    >
                        {s === "All" ? "Toutes" : s}
                    </button>
                ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block bg-[var(--sidebar)] rounded-2xl shadow-sm overflow-hidden border border-[var(--border)]">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#fcfcfc] dark:bg-zinc-900/50 text-zinc-600 dark:text-zinc-500 uppercase font-black text-[10px] tracking-widest border-b border-[var(--border)]">
                            <tr>
                                <th className="px-6 py-5">Entreprise</th>
                                <th className="px-6 py-5">Poste</th>
                                <th className="px-6 py-5">Statut</th>
                                <th className="px-6 py-5 text-center">Date</th>
                                <th className="px-6 py-5 text-center">Activité</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border)]">
                            {filteredApps.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-zinc-400 font-bold italic">
                                        Aucune candidature trouvée.
                                    </td>
                                </tr>
                            ) : (
                                filteredApps.map((app) => {
                                    const metrics = calculateMetrics(app);
                                    return (
                                        <tr key={app.id} className={cn(
                                            "hover:bg-zinc-50/50 dark:hover:bg-zinc-900/50 transition-colors group",
                                            metrics.isFollowUpDue && "bg-orange-50/20 dark:bg-orange-950/5"
                                        )}>
                                            <td className="px-6 py-5">
                                                <div className="font-black text-[var(--foreground)] uppercase tracking-tight">{app.company}</div>
                                            </td>
                                            <td className="px-6 py-5 text-zinc-600 dark:text-zinc-300 font-bold">{app.role}</td>
                                            <td className="px-6 py-5"><StatusBadge status={app.status} /></td>
                                            <td className="px-6 py-5 text-center text-zinc-500 dark:text-zinc-400 font-black">{format(app.dateApplied, "dd MMM", { locale: fr })}</td>
                                            <td className="px-6 py-5">
                                                <div className="flex flex-col items-center">
                                                    <div className="text-[11px] text-[var(--foreground)] font-black">{metrics.daysSinceApplied} <span className="text-[9px] text-zinc-400 font-bold uppercase ml-0.5">jour(s)</span></div>
                                                    {metrics.isFollowUpDue && (
                                                        <span className="mt-1 flex items-center px-2 py-0.5 rounded-full text-[9px] font-black bg-orange-500 text-white uppercase tracking-tighter animate-pulse">
                                                            Relance
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Link href={`/dashboard/applications/${app.id}/edit`}>
                                                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0 text-zinc-400 hover:text-[var(--primary)] hover:bg-orange-50/50"><Pencil size={15} /></Button>
                                                    </Link>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-9 w-9 p-0 text-zinc-400 hover:text-red-500 hover:bg-red-50/50"
                                                        onClick={() => confirm("Supprimer cette candidature ?") && deleteMutation.mutate(app.id!)}
                                                    >
                                                        <Trash2 size={15} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
                {filteredApps.length === 0 ? (
                    <div className="p-12 text-center text-zinc-400 font-bold italic bg-[var(--sidebar)] rounded-2xl border border-[var(--border)]">
                        Aucune candidature trouvée.
                    </div>
                ) : (
                    filteredApps.map((app) => {
                        const metrics = calculateMetrics(app);
                        return (
                            <div key={app.id} className={cn(
                                "bg-[var(--sidebar)] p-6 rounded-2xl border border-[var(--border)] shadow-sm relative overflow-hidden",
                                metrics.isFollowUpDue && "ring-2 ring-orange-500/20 bg-orange-50/5"
                            )}>
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="font-black text-[var(--foreground)] text-lg leading-tight uppercase tracking-tight">{app.company}</div>
                                        <div className="text-zinc-500 dark:text-zinc-400 text-xs font-black uppercase tracking-widest mt-1">{app.role}</div>
                                    </div>
                                    <StatusBadge status={app.status} />
                                </div>

                                <div className="flex items-center justify-between mt-6 pt-5 border-t border-[var(--border)]">
                                    <div className="flex gap-5">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Postulé</span>
                                            <span className="text-xs font-black text-[var(--foreground)]">{format(app.dateApplied, "dd MMM", { locale: fr })}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Activité</span>
                                            <span className="text-xs font-black text-[var(--foreground)]">{metrics.daysSinceApplied} j</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Link href={`/dashboard/applications/${app.id}/edit`}>
                                            <Button variant="outline" size="sm" className="h-10 w-10 p-0 rounded-2xl border-[var(--border)] bg-white dark:bg-zinc-900"><Pencil size={16} /></Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="h-10 w-10 p-0 rounded-2xl border-red-100 dark:border-red-900/30 text-red-500 bg-red-50/20"
                                            onClick={() => confirm("Supprimer ?") && deleteMutation.mutate(app.id!)}
                                        >
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </div>

                                {metrics.isFollowUpDue && (
                                    <div className="absolute top-0 right-0">
                                        <div className="bg-orange-500 text-white text-[9px] font-black px-3 py-1.5 rounded-bl-xl uppercase tracking-widest shadow-lg shadow-orange-500/20">
                                            Relance
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
