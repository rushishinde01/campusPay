"use client"

import { motion, Variants } from "framer-motion"

export interface Transaction {
    id: string
    label: string // TxID or Address
    date: string // Round or Date
    amount: string
    type: "credit" | "debit"
}

interface TransactionListProps {
    transactions: Transaction[]
    theme: "light" | "dark"
}

const listVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            delay: 0.6,
            staggerChildren: 0.06,
        },
    },
}

const rowVariants: Variants = {
    hidden: { opacity: 0, x: -8 },
    visible: { opacity: 1, x: 0 },
}

export function TransactionList({ transactions, theme }: TransactionListProps) {
    const isDark = theme === "dark"
    const headingColor = isDark ? "text-white/50" : "text-black/40"
    const primaryText = isDark ? "text-white" : "text-black"
    const secondaryText = isDark ? "text-white/40" : "text-black/40"
    const borderColor = isDark ? "border-white/5" : "border-black/5"
    const emptyColor = isDark ? "text-white/20" : "text-black/20"
    const creditColor = isDark ? "text-emerald-400" : "text-emerald-600"

    return (
        <motion.div
            variants={listVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-md mt-4"
        >
            <p className={`mb-6 text-xs font-medium uppercase tracking-[0.2em] ${headingColor}`}>
                Recent Activity
            </p>
            <div className="flex flex-col">
                {transactions.map((tx) => (
                    <motion.div
                        key={tx.id}
                        variants={rowVariants}
                        className={`flex items-center justify-between border-b ${borderColor} py-5 last:border-b-0 group`}
                    >
                        <div className="flex flex-col gap-1">
                            <span className={`text-sm font-normal ${primaryText}`}>
                                {tx.label}
                            </span>
                            <span className={`text-[10px] ${secondaryText}`}>
                                {tx.date}
                            </span>
                        </div>
                        <span
                            className={`text-sm font-medium tabular-nums ${tx.type === "credit"
                                ? creditColor
                                : primaryText
                                }`}
                        >
                            {tx.amount}
                        </span>
                    </motion.div>
                ))}
                {transactions.length === 0 && (
                    <div className={`text-center py-8 ${emptyColor} text-xs uppercase tracking-widest`}>
                        No transactions yet
                    </div>
                )}
            </div>
        </motion.div>
    )
}
