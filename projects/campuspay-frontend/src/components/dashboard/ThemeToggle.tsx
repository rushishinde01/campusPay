"use client"

import { motion } from "framer-motion"
import { Moon, Sun } from "lucide-react"

interface ThemeToggleProps {
    theme: "light" | "dark"
    toggleTheme: () => void
}

export function ThemeToggle({ theme, toggleTheme }: ThemeToggleProps) {
    return (
        <button
            onClick={toggleTheme}
            className={`relative h-8 w-14 rounded-full p-1 transition-colors duration-300 ${theme === "dark" ? "bg-white/10" : "bg-black/5"
                }`}
        >
            <motion.div
                layout
                transition={{ type: "spring", stiffness: 700, damping: 30 }}
                className={`flex h-6 w-6 items-center justify-center rounded-full shadow-sm ${theme === "dark" ? "bg-black text-white" : "bg-white text-black"
                    }`}
                style={{
                    x: theme === "dark" ? 24 : 0
                }}
            >
                {theme === "dark" ? (
                    <Moon className="h-3.5 w-3.5" />
                ) : (
                    <Sun className="h-3.5 w-3.5" />
                )}
            </motion.div>
        </button>
    )
}
