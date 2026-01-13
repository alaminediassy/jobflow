import { cn } from "@/lib/utils";
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost" | "destructive";
    size?: "default" | "sm" | "lg";
}
export const Button = ({ className, variant = "default", size = "default", ...props }: ButtonProps) => {
    const variants = {
        default: "bg-[var(--primary)] text-white hover:opacity-90 active:scale-95 transition-all shadow-sm",
        outline: "border border-[var(--border)] bg-transparent hover:bg-gray-100 dark:hover:bg-zinc-900 text-gray-700 dark:text-zinc-300",
        ghost: "hover:bg-gray-100 dark:hover:bg-zinc-900 text-gray-700 dark:text-zinc-400 dark:hover:text-zinc-100",
        destructive: "bg-red-500 text-white hover:bg-red-600 dark:bg-red-950 dark:hover:bg-red-900",
    };
    const sizes = {
        default: "px-3.5 py-1.5",
        sm: "px-3 py-1 text-xs",
        lg: "px-5 py-2 text-base",
    };
    return <button className={cn("inline-flex items-center justify-center rounded-lg font-semibold transition-all text-sm disabled:opacity-50 disabled:pointer-events-none", variants[variant], sizes[size], className)} {...props} />;
};
