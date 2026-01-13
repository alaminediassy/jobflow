export const StatusBadge = ({ status }: { status: string }) => {
    let color = "bg-zinc-100 text-zinc-700 dark:bg-zinc-800/50 dark:text-zinc-400";
    if (status === "Offer" || status === "Offer accepted") color = "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400";
    if (status === "Interview" || status === "Final interview") color = "bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400";
    if (status === "Rejected" || status === "Offer declined") color = "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400";
    if (status === "Applied") color = "bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400";
    return <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight border border-transparent dark:border-zinc-800/50 ${color}`}>{status}</span>;
};
