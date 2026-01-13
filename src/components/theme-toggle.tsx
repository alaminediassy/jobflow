"use client";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
// Test

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return <Button variant="ghost" size="sm" className="w-9 h-9 p-0" />;

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-9 h-9 p-0 rounded-full"
        >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            <span className="sr-only">Changer de thème</span>
        </Button>
    );
}
