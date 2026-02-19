"use client"

import { motion } from "framer-motion"

interface BalanceDisplayProps {
    amount: string
    theme: "light" | "dark"
}

export function BalanceDisplay({ amount, theme }: BalanceDisplayProps) {
    const textColor = theme === "dark" ? "text-white" : "text-black"
    const subTextColor = theme === "dark" ? "text-white/50" : "text-black/40"
    const currencyColor = theme === "dark" ? "text-white/30" : "text-black/30"
    const activeColor = theme === "dark" ? "text-white/50" : "text-black/40"
    const dotColor = theme === "dark" ? "bg-emerald-500" : "bg-emerald-600"
    const dotShadow = theme === "dark" ? "shadow-[0_0_8px_rgba(16,185,129,0.5)]" : ""

    return (
        <div className="flex flex-col items-center gap-6">
            <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
                className={`text-xs font-medium uppercase tracking-[0.2em] ${subTextColor}`}
            >
                Current Balance
            </motion.p>
            <motion.h1
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
                className={`text-7xl font-light tracking-tight ${textColor} sm:text-8xl md:text-9xl`}
            >
                {amount} <span className={`text-2xl font-light ${currencyColor}`}>ALGO</span>
            </motion.h1>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="flex items-center gap-2"
            >
                <span className={`inline-block h-1.5 w-1.5 rounded-full ${dotColor} ${dotShadow}`} />
                <span className={`text-[10px] font-medium tracking-[0.1em] uppercase ${activeColor}`}>
                    Active
                </span>
            </motion.div>
        </div>
    )
}
