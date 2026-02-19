"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import QRCode from "react-qr-code"

interface ReceiveModalProps {
    isOpen: boolean
    onClose: () => void
    address: string
}

export function ReceiveModal({ isOpen, onClose, address }: ReceiveModalProps) {
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
                        aria-label="Receive payment"
                    >
                        <div className="rounded-t-3xl border border-b-0 border-white/10 bg-[#121212] px-6 pb-10 pt-4 text-white shadow-2xl">
                            {/* Handle */}
                            <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-white/20" />

                            {/* Close button */}
                            <div className="mb-8 flex items-center justify-between">
                                <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">
                                    Receive
                                </span>
                                <button
                                    onClick={onClose}
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                                    aria-label="Close"
                                >
                                    <X className="h-4 w-4 text-white" strokeWidth={1.5} />
                                </button>
                            </div>

                            {/* QR Code */}
                            <div className="flex flex-col items-center gap-8">
                                <div className="p-4 bg-white rounded-xl">
                                    <QRCode value={address} size={200} />
                                </div>
                                <div className="text-center">
                                    <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-white/50 mb-2">
                                        Your Address
                                    </p>
                                    <p className="font-mono text-xs text-white/80 break-all max-w-[250px] text-center">
                                        {address}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
