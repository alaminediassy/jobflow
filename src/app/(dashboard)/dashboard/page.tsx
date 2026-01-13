"use client";
import { useApplications } from "@/hooks/use-applications";
import { calculateMetrics } from "@/lib/firestore";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Briefcase, Clock } from "lucide-react";

export default function DashboardPage() {
    const { data: apps, isLoading, error } = useApplications();

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mb-4 shadow-lg shadow-orange-500/20"></div>
                <p className="text-gray-500 dark:text-zinc-500 font-black uppercase text-xs tracking-widest animate-pulse">Synchronisation...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl text-center">
                <h2 className="text-red-800 dark:text-red-400 font-black text-xl mb-4">Erreur de chargement</h2>
                <p className="text-red-600 dark:text-red-300 max-w-md mx-auto mb-6 font-medium">
                    {error instanceof Error ? error.message : "Erreur de connexion aux données."}
                </p>
                <p className="text-xs text-gray-500 dark:text-zinc-500 font-bold uppercase tracking-wider">
                    💡 Vérifie ta connexion ou rafraîchis la page.
                </p>
            </div>
        );
    }

    if (!apps || apps.length === 0) {
        return (
            <div className="p-12 text-center bg-[var(--sidebar)] rounded-2xl border-2 border-dashed border-[var(--border)] text-gray-500 flex flex-col items-center gap-4">
                <p className="font-bold text-lg">Aucune donnée pour le moment.</p>
                <p className="text-sm max-w-xs mb-4">Commencez par ajouter votre première candidature pour voir vos statistiques apparaître ici.</p>
                <Button onClick={() => window.location.href = '/dashboard/applications/new'} className="font-bold">Ajouter une candidature</Button>
            </div>
        );
    }

    const stats = apps.reduce((acc, app) => {
        const m = calculateMetrics(app);
        acc.total++;
        acc.statuses[app.status] = (acc.statuses[app.status] || 0) + 1;
        acc.countries[app.country] = (acc.countries[app.country] || 0) + 1;
        if (m.isFollowUpDue) acc.followUps++;
        return acc;
    }, { total: 0, statuses: {} as Record<string, number>, countries: {} as Record<string, number>, followUps: 0 });

    const COLORS = ['#ff4d29', '#f97316', '#fbbf24', '#71717a', '#a1a1aa'];
    const pieData = Object.entries(stats.statuses).map(([name, value]) => ({ name, value }));
    const barData = Object.entries(stats.countries).map(([name, value]) => ({ name, value }));

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h2 className="text-2xl md:text-3xl font-black text-[var(--foreground)] tracking-tight">Tableau de Bord</h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm font-semibold">Vue d'ensemble de votre progression de carrière.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <KPICard title="Total" value={stats.total} icon={<Briefcase size={20} />} />
                <KPICard title="Offres" value={stats.statuses["Offer"] || 0} icon={<div className="h-2 w-2 rounded-full bg-green-500" />} className="text-green-600 dark:text-green-400" />
                <KPICard title="Relances" value={stats.followUps} icon={<Clock size={20} />} className={stats.followUps > 0 ? "text-orange-600 dark:text-orange-500" : ""} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[var(--sidebar)] p-6 md:p-8 rounded-2xl shadow-sm border border-[var(--border)] min-h-[400px] flex flex-col">
                    <h3 className="text-[10px] font-black uppercase tracking-widest mb-8 text-zinc-400 dark:text-zinc-500">Répartition par Statut</h3>
                    <div className="flex-1 min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%" cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    stroke="none"
                                    paddingAngle={5}
                                >
                                    {pieData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'var(--sidebar)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', color: 'var(--foreground)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-[var(--sidebar)] p-6 md:p-8 rounded-2xl shadow-sm border border-[var(--border)] min-h-[400px] flex flex-col">
                    <h3 className="text-[10px] font-black uppercase tracking-widest mb-8 text-zinc-400 dark:text-zinc-500">Candidatures par Pays</h3>
                    <div className="flex-1 min-h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                                <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-muted)', fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                                <YAxis hide />
                                <Tooltip cursor={{ fill: 'var(--primary)', opacity: 0.05 }} contentStyle={{ backgroundColor: 'var(--sidebar)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', color: 'var(--foreground)' }} />
                                <Bar dataKey="value" fill="var(--primary)" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

function KPICard({ title, value, icon, className }: { title: string, value: number, icon?: React.ReactNode, className?: string }) {
    return (
        <div className="bg-[var(--sidebar)] p-6 rounded-2xl shadow-sm border border-[var(--border)] group hover:border-[var(--primary)]/50 transition-colors">
            <div className="flex items-center justify-between mb-4">
                <p className="text-[10px] font-black text-zinc-500 dark:text-zinc-500 uppercase tracking-widest group-hover:text-[var(--primary)] transition-colors">{title}</p>
                <div className="text-orange-500 bg-orange-500/5 dark:bg-zinc-900/50 p-2.5 rounded-xl border border-orange-500/10 dark:border-transparent">
                    {icon}
                </div>
            </div>
            <p className={`text-5xl font-black tracking-tighter ${className || 'text-[var(--foreground)]'}`}>{value}</p>
        </div>
    );
}
