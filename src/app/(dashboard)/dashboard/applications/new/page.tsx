"use client";
import { useRouter } from "next/navigation";
import { useCreateApplication } from "@/hooks/use-applications";
import { ApplicationSchema, CONTRACT_TYPES, SOURCES, COUNTRIES, STATUSES } from "@/lib/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";

export default function NewApplicationPage() {
    const router = useRouter();
    const createMutation = useCreateApplication();
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(ApplicationSchema.omit({ id: true, userId: true })),
        defaultValues: {
            status: "To apply",
            contract: "CDI",
            source: "LinkedIn",
            country: "France",
            dateApplied: new Date().toISOString().split('T')[0]
        }
    });

    const onSubmit = (data: any) => {
        createMutation.mutate(data, {
            onSuccess: () => {
                router.push("/dashboard/applications");
            },
            onError: (error) => {
                console.error("Submission error:", error);
                alert("Erreur lors de l'enregistrement. Veuillez réessayer.");
            }
        });
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <div className="mb-10">
                <h2 className="text-3xl font-black text-[var(--foreground)] tracking-tighter uppercase italic">
                    Ajouter une <span className="text-orange-500">Candidature</span>
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm font-semibold mt-1">Détaillez votre opportunité pour un suivi optimal.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-[var(--sidebar)] p-8 md:p-10 rounded-3xl border border-[var(--border)] shadow-xl shadow-orange-500/5 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Entreprise & Poste */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-600 dark:text-zinc-500 uppercase tracking-widest ml-1">Entreprise</label>
                            <input {...register("company")} className="input-standard h-12" placeholder="ex: Google, Apple..." />
                            {errors.company && <p className="text-red-500 text-[10px] font-black mt-1 ml-1 uppercase tracking-tighter">{errors.company.message as string}</p>}
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-600 dark:text-zinc-500 uppercase tracking-widest ml-1">Poste visé</label>
                            <input {...register("role")} className="input-standard h-12" placeholder="ex: Software Engineer" />
                            {errors.role && <p className="text-red-500 text-[10px] font-black mt-1 ml-1 uppercase tracking-tighter">{errors.role.message as string}</p>}
                        </div>
                    </div>

                    {/* Statut & Pays */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-600 dark:text-zinc-500 uppercase tracking-widest ml-1">Statut Initial</label>
                            <select {...register("status")} className="input-standard h-12">
                                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-zinc-600 dark:text-zinc-500 uppercase tracking-widest ml-1">Pays</label>
                            <select {...register("country")} className="input-standard h-12">
                                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-600 dark:text-zinc-500 uppercase tracking-widest ml-1">Type de Contrat</label>
                        <select {...register("contract")} className="input-standard h-12">
                            {CONTRACT_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-600 dark:text-zinc-500 uppercase tracking-widest ml-1">Source</label>
                        <select {...register("source")} className="input-standard h-12">
                            {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-600 dark:text-zinc-500 uppercase tracking-widest ml-1">Date de Candidature</label>
                        <input type="date" {...register("dateApplied")} className="input-standard h-12" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-zinc-600 dark:text-zinc-500 uppercase tracking-widest ml-1">Lien de l'offre (Optionnel)</label>
                        <input {...register("jobLink")} className="input-standard h-12" placeholder="https://..." />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-[var(--border)]">
                    <Button
                        type="button"
                        variant="ghost"
                        className="flex-1 h-12 font-black uppercase tracking-widest text-xs"
                        onClick={() => router.back()}
                    >
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        className="flex-1 h-12 font-black uppercase tracking-widest text-xs shadow-lg shadow-orange-500/20"
                        disabled={createMutation.isPending}
                    >
                        {createMutation.isPending ? "Traitement..." : "Enregistrer la Candidature"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
