"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { LogOut, LayoutDashboard, Briefcase, Clock, ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { AuthGuard } from "@/components/auth-guard";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const navItems = [
        { href: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
        { href: "/dashboard/applications", icon: <Briefcase size={20} />, label: "Candidatures" },
        { href: "/dashboard/follow-ups", icon: <Clock size={20} />, label: "Relances" },
    ];

    return (
        <div className="min-h-screen bg-[var(--background)] flex flex-col md:flex-row transition-colors overflow-hidden">
            <header className="md:hidden flex items-center justify-between p-4 bg-[var(--sidebar)] border-b border-[var(--border)] z-30">
                <h1 className="text-xl font-black text-[var(--primary)] tracking-tighter uppercase italic">
                    Job<span className="text-[var(--foreground)]">Flow</span>
                </h1>
                <div className="flex items-center gap-3">
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-zinc-400">
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </header>

            {/* Sidebar Overlay (Mobile) */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 md:relative transform transition-all duration-300 ease-in-out bg-[var(--sidebar)] border-r border-[var(--border)] flex flex-col shadow-2xl md:shadow-none",
                    isMobileMenuOpen ? "translate-x-0 w-80" : "-translate-x-full md:translate-x-0",
                    isCollapsed ? "md:w-20" : "md:w-72"
                )}
            >
                {/* Mobile Sidebar Header */}
                <div className="flex md:hidden items-center justify-between p-6 border-b border-[var(--border)]">
                    <h1 className="text-2xl font-black text-[var(--primary)] tracking-tighter uppercase italic">
                        Job<span className="text-[var(--foreground)]">Flow</span>
                    </h1>
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-500"
                    >
                        <X size={20} />
                    </button>
                </div>
                {/* Desktop Header */}
                <div className="hidden md:flex items-center justify-between p-6 h-24">
                    {!isCollapsed && (
                        <h1 className="text-3xl font-black text-[var(--primary)] tracking-tighter uppercase italic">
                            Job<span className="text-[var(--foreground)]">Flow</span>
                        </h1>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-400 transition-colors mx-auto"
                    >
                        {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>

                <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                    {!isCollapsed && <p className="text-[10px] font-black text-zinc-500 dark:text-zinc-500 uppercase tracking-[0.2em] mb-4 ml-2">Principal</p>}
                    {navItems.map((item) => (
                        <NavItem
                            key={item.href}
                            {...item}
                            isCollapsed={isCollapsed}
                            isActive={pathname === item.href}
                        />
                    ))}
                </div>

                <div className="p-4 border-t border-[var(--border)] space-y-4">

                    <button
                        onClick={() => signOut(auth)}
                        className={cn(
                            "w-full flex items-center gap-3 text-[var(--foreground)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 px-4 py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all group",
                            isCollapsed && "justify-center"
                        )}
                    >
                        <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                        {!isCollapsed && <span>Quitter</span>}
                    </button>

                    {!isCollapsed && (
                        <div className="flex items-center gap-3 px-3 py-2">
                            <div className="w-8 h-8 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-black text-xs">
                                {auth.currentUser?.email?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-black text-[var(--foreground)] truncate max-w-[140px]">{auth.currentUser?.email}</span>
                                <span className="text-[9px] font-black text-zinc-500 dark:text-zinc-500 uppercase tracking-tighter">Utilisateur</span>
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative p-6 md:p-10">
                <AuthGuard>
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </AuthGuard>
            </main>
        </div>
    );
}

function NavItem({ href, icon, label, isCollapsed, isActive }: any) {
    return (
        <Link
            href={href}
            className={cn(
                "flex items-center gap-3 px-4 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all group relative",
                isActive
                    ? "bg-[var(--primary)] text-white shadow-xl shadow-orange-500/20 md:shadow-orange-500/25 scale-[1.02]"
                    : "text-zinc-500 dark:text-zinc-400 hover:text-[var(--primary)] hover:bg-orange-50 dark:hover:bg-orange-950/10",
                isCollapsed && "justify-center px-0"
            )}
        >
            <span className={cn("transition-colors", isActive ? "text-white" : "text-zinc-400 group-hover:text-[var(--primary)]")}>
                {icon}
            </span>
            {!isCollapsed && <span>{label}</span>}
            {isCollapsed && isActive && (
                <div className="absolute left-0 w-1.5 h-6 bg-[var(--primary)] rounded-r-full" />
            )}
        </Link>
    );
}
