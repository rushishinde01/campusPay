"use client"

import { motion, Variants } from "framer-motion"
import { ArrowUpRight, QrCode, Shield, Settings } from "lucide-react"

interface ActionDockProps {
    theme: "light" | "dark"
    onReceive: () => void
    onPay: () => void
    onEscrow: () => void
    onManage: () => void
}

const dockVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            delay: 0.4,
            duration: 0.5,
            ease: "easeInOut",
            staggerChildren: 0.08,
        },
    },
}

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0 },
}

export function ActionDock({ theme, onReceive, onPay, onEscrow }: ActionDockProps) {
    const isDark = theme === "dark"

    // Pay Button Styles (Primary)
    const payBg = isDark ? "bg-white" : "bg-black"
    const payIcon = isDark ? "text-black" : "text-white"

    // Secondary Button Styles
    const secBg = isDark ? "bg-white/10 border-white/10" : "bg-black/5 border-black/5"
    const secIcon = isDark ? "text-white" : "text-black"
    const secBorder = isDark ? "border-white/10" : "border-black/10"

    const labelColor = isDark ? "text-white/50" : "text-black/40"

    return (
        <motion.div
            variants={dockVariants}
            initial="hidden"
            animate="visible"
            className="flex items-center gap-6 sm:gap-10"
        >
            {/* Pay */}
            <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onPay}
                className="group flex flex-col items-center gap-3"
                aria-label="Pay"
            >
                <div className={`flex h-16 w-16 items-center justify-center rounded-full ${payBg} shadow-lg transition-all duration-300`}>
                    <ArrowUpRight className={`h-7 w-7 ${payIcon}`} strokeWidth={2} />
                </div>
                <span className={`text-[10px] font-medium uppercase tracking-[0.2em] ${labelColor}`}>
                    Pay
                </span>
            </motion.button>

            {/* Receive */}
            <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onReceive}
                className="group flex flex-col items-center gap-3"
                aria-label="Receive"
            >
                <div className={`flex h-16 w-16 items-center justify-center rounded-full border ${secBg} backdrop-blur-sm transition-all duration-300`}>
                    <QrCode className={`h-6 w-6 ${secIcon}`} strokeWidth={1.5} />
                </div>
                <span className={`text-[10px] font-medium uppercase tracking-[0.2em] ${labelColor}`}>
                    Receive
                </span>
            </motion.button>

            {/* Escrow */}
            <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onEscrow}
                className="group flex flex-col items-center gap-3"
                aria-label="Escrow"
            >
                <div className={`flex h-16 w-16 items-center justify-center rounded-full border ${secBorder} bg-transparent transition-all duration-300`}>
                    <Shield className={`h-6 w-6 ${secIcon}`} strokeWidth={1.5} />
                </div>
                <span className={`text-[10px] font-medium uppercase tracking-[0.2em] ${labelColor}`}>
                    Escrow
                </span>
            </motion.button>

            {/* Manage */}
            <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onManage}
                className="group flex flex-col items-center gap-3"
                aria-label="Manage"
            >
                <div className={`flex h-16 w-16 items-center justify-center rounded-full border ${secBorder} bg-transparent transition-all duration-300 opacity-50 hover:opacity-100`}>
                    <Settings className={`h-6 w-6 ${secIcon}`} strokeWidth={1.5} />
                </div>
                <span className={`text-[10px] font-medium uppercase tracking-[0.2em] ${labelColor}`}>
                    Manage
                </span>
            </motion.button>
        </motion.div>
    )
}
