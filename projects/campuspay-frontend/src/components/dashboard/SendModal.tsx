"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Send } from "lucide-react"
import { useState } from "react"

interface SendModalProps {
    isOpen: boolean
    onClose: () => void
    onSend: (receiver: string, amount: number) => Promise<void>
    isLoading: boolean
}

export function SendModal({ isOpen, onClose, onSend, isLoading }: SendModalProps) {
    const [receiver, setReceiver] = useState("")
    const [amount, setAmount] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!receiver || !amount) return
        await onSend(receiver, Number(amount))
        setReceiver("")
        setAmount("")
        onClose()
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={onClose}
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                        aria-hidden="true"
                    />

                    {/* Modal Panel */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 32, stiffness: 380 }}
                        className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-lg"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Send payment"
                    >
                        <div className="rounded-t-3xl border border-b-0 border-white/10 bg-[#121212] px-6 pb-10 pt-4 text-white shadow-2xl">
                            {/* Handle */}
                            <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-white/20" />

                            {/* Close button */}
                            <div className="mb-6 flex items-center justify-between">
                                <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">
                                    Send ALGO
                                </span>
                                <button
                                    onClick={onClose}
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                                    aria-label="Close"
                                >
                                    <X className="h-4 w-4 text-white" strokeWidth={1.5} />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-medium uppercase tracking-wider text-white/50">Receiver Address</label>
                                    <input
                                        type="text"
                                        value={receiver}
                                        onChange={(e) => setReceiver(e.target.value)}
                                        placeholder="ALGO Address..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-white/20 font-mono"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[11px] font-medium uppercase tracking-wider text-white/50">Amount (ALGO)</label>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0.00"
                                        step="0.001"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-2xl text-white focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-white/20"
                                    />
                                </div>

                                <button
                                    disabled={isLoading}
                                    type="submit"
                                    className="mt-4 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-4 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            CONFIRM TRANSACTION
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
