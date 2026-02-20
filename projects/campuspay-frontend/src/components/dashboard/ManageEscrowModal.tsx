"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Settings, Download, RefreshCcw, Loader2, Trash2 } from "lucide-react"
import { useState } from "react"
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { CampusPayFactory } from '../../contracts/CampusPay'
import { getAlgodConfigFromViteEnvironment, getIndexerConfigFromViteEnvironment } from '../../utils/network/getAlgoClientConfigs'
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import algosdk from 'algosdk'

interface ManageEscrowModalProps {
    isOpen: boolean
    onClose: () => void
}

export function ManageEscrowModal({ isOpen, onClose }: ManageEscrowModalProps) {
    const { activeAddress, transactionSigner } = useWallet()
    const { enqueueSnackbar } = useSnackbar()

    const [appId, setAppId] = useState("")
    const [loading, setLoading] = useState(false)
    const [appState, setAppState] = useState<{
        payer: string
        receiver: string
        amount: number
        isActive: boolean
        isClaimed: boolean
    } | null>(null)

    const algodConfig = getAlgodConfigFromViteEnvironment()
    const indexerConfig = getIndexerConfigFromViteEnvironment()
    const algorand = AlgorandClient.fromConfig({ algodConfig, indexerConfig })
    algorand.setDefaultSigner(transactionSigner)

    const handleConnect = async () => {
        if (!appId || !activeAddress) return
        setLoading(true)
        setAppState(null)

        try {
            const factory = new CampusPayFactory({
                defaultSender: activeAddress,
                algorand,
            })

            const appClient = factory.getAppClientById({ appId: BigInt(appId) })
            const state = await appClient.state.global.getAll()

            setAppState({
                payer: state.payer?.asString() ? algosdk.encodeAddress(state.payer.asByteArray()!) : "",
                receiver: state.receiver?.asString() ? algosdk.encodeAddress(state.receiver.asByteArray()!) : "",
                amount: Number(state.amount || 0),
                isActive: Number(state.isActive) === 1,
                isClaimed: Number(state.isClaimed) === 1,
            })
            enqueueSnackbar("Loaded Escrow State", { variant: 'success' })
        } catch (e: any) {
            console.error(e)
            enqueueSnackbar(`Failed to load app: ${e.message}`, { variant: 'error' })
        } finally {
            setLoading(false)
        }
    }

    const handleClaim = async () => {
        if (!appId || !activeAddress) return
        setLoading(true)
        try {
            const factory = new CampusPayFactory({
                defaultSender: activeAddress,
                algorand,
            })
            const appClient = factory.getAppClientById({ appId: BigInt(appId) })

            await appClient.send.claimEscrow({
                args: []
            })

            enqueueSnackbar("Funds Claimed Successfully!", { variant: 'success' })
            onClose()
        } catch (e: any) {
            enqueueSnackbar(`Claim Failed: ${e.message}`, { variant: 'error' })
        } finally {
            setLoading(false)
        }
    }

    const handleRefund = async () => {
        if (!appId || !activeAddress) return
        setLoading(true)
        try {
            const factory = new CampusPayFactory({
                defaultSender: activeAddress,
                algorand,
            })
            const appClient = factory.getAppClientById({ appId: BigInt(appId) })

            await appClient.send.cancelEscrow({
                args: []
            })

            enqueueSnackbar("Funds Refunded Successfully!", { variant: 'success' })
            onClose()
        } catch (e: any) {
            enqueueSnackbar(`Refund Failed: ${e.message}`, { variant: 'error' })
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        if (!appId || !activeAddress) return
        setLoading(true)
        try {
            const factory = new CampusPayFactory({
                defaultSender: activeAddress,
                algorand,
            })
            const appClient = factory.getAppClientById({ appId: BigInt(appId) })

            await appClient.send.delete.bare()

            enqueueSnackbar("Contract Deleted!", { variant: 'success' })
            onClose()
        } catch (e: any) {
            enqueueSnackbar(`Delete Failed: ${e.message}`, { variant: 'error' })
        } finally {
            setLoading(false)
        }
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
                        aria-label="Manage Escrow"
                    >
                        <div className="rounded-t-3xl border border-b-0 border-white/10 bg-[#121212] px-6 pb-10 pt-4 text-white shadow-2xl">
                            {/* Handle */}
                            <div className="mx-auto mb-6 h-1 w-10 rounded-full bg-white/20" />

                            {/* Close button */}
                            <div className="mb-6 flex items-center justify-between">
                                <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/50">
                                    Manage Escrow
                                </span>
                                <button
                                    onClick={onClose}
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
                                    aria-label="Close"
                                >
                                    <X className="h-4 w-4 text-white" strokeWidth={1.5} />
                                </button>
                            </div>

                            {/* content */}
                            <div className="flex flex-col gap-6">
                                <div className="space-y-2">
                                    <label className="text-[11px] font-medium uppercase tracking-wider text-white/50">App ID</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            value={appId}
                                            onChange={(e) => setAppId(e.target.value)}
                                            placeholder="e.g. 755805226"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors placeholder:text-white/20 font-mono"
                                        />
                                        <button
                                            onClick={handleConnect}
                                            disabled={loading || !appId}
                                            className="bg-white/10 hover:bg-white/20 text-white rounded-xl px-4 transition-colors disabled:opacity-50"
                                        >
                                            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <RefreshCcw className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                {appState && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white/5 rounded-xl p-4 space-y-3 text-sm"
                                    >
                                        <div className="flex justify-between">
                                            <span className="text-white/50">Amount:</span>
                                            <span className="font-mono">{appState.amount} µALGO</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-white/50">Status:</span>
                                            <span className={appState.isActive ? "text-emerald-400" : "text-red-400"}>
                                                {appState.isActive ? "Active" : appState.isClaimed ? "Claimed" : "Inactive"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-white/50">Role:</span>
                                            <span className="font-mono text-xs bg-white/10 px-2 py-1 rounded">
                                                {activeAddress === appState.receiver ? "RECEIVER" : activeAddress === appState.payer ? "PAYER" : "OBSERVER"}
                                            </span>
                                        </div>

                                        <div className="pt-4 flex flex-col gap-2">
                                            {activeAddress === appState.receiver && appState.isActive && (
                                                <button
                                                    onClick={handleClaim}
                                                    disabled={loading}
                                                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
                                                >
                                                    <Download className="h-4 w-4" /> Claim Funds
                                                </button>
                                            )}

                                            {activeAddress === appState.payer && appState.isActive && (
                                                <button
                                                    onClick={handleRefund}
                                                    disabled={loading}
                                                    className="w-full bg-red-600 hover:bg-red-500 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
                                                >
                                                    <RefreshCcw className="h-4 w-4" /> Refund Payer
                                                </button>
                                            )}

                                            {!appState.isActive && (
                                                <button
                                                    onClick={handleDelete}
                                                    disabled={loading}
                                                    className="w-full bg-white/10 hover:bg-red-900/50 text-white/70 font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all"
                                                >
                                                    <Trash2 className="h-4 w-4" /> Delete Contract
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
