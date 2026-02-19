"use client"

import { useState, useEffect, useCallback } from "react"
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import algosdk from 'algosdk'
import { getAlgodConfigFromViteEnvironment, getIndexerConfigFromViteEnvironment } from '../../utils/network/getAlgoClientConfigs'

import { BalanceDisplay } from "./BalanceDisplay"
import { ActionDock } from "./ActionDock"
import { ThemeToggle } from "./ThemeToggle"
import { ReceiveModal } from "./ReceiveModal"
import { TransactionList, Transaction } from "./TransactionList"
import { SendModal } from "./SendModal"

interface DashboardProps {
    onEscrowClick: () => void
    onWalletClick: () => void
}

export function Dashboard({ onEscrowClick, onWalletClick }: DashboardProps) {
    const { activeAddress, signTransactions } = useWallet()
    const { enqueueSnackbar } = useSnackbar()

    // UI State
    const [receiveOpen, setReceiveOpen] = useState(false)
    const [sendOpen, setSendOpen] = useState(false)

    // Data State
    const [balance, setBalance] = useState<string>("0.00")
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    // Algorand Clients
    const algodConfig = getAlgodConfigFromViteEnvironment()
    const indexerConfig = getIndexerConfigFromViteEnvironment()

    const algodClient = new algosdk.Algodv2(
        algodConfig.token as string,
        algodConfig.server,
        algodConfig.port
    )

    const indexerClient = new algosdk.Indexer(
        indexerConfig.token as string,
        indexerConfig.server,
        indexerConfig.port
    )

    const fetchBalance = useCallback(async () => {
        if (!activeAddress) return
        try {
            const accountInfo = await algodClient.accountInformation(activeAddress).do()
            const algoBalance = Number(accountInfo.amount) / 1000000
            setBalance(algoBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }))
        } catch (e) {
            console.error('Error fetching balance:', e)
        }
    }, [activeAddress])

    const fetchHistory = useCallback(async () => {
        if (!activeAddress) return
        try {
            // Removed .order('desc') as it might not be supported in this SDK version or signature
            const response = await indexerClient.lookupAccountTransactions(activeAddress).limit(10).do()
            const txns = response['transactions'] || []

            const formattedTxns: Transaction[] = txns.map((tx: any) => {
                const isPayment = !!tx['payment-transaction']
                const isSender = tx.sender === activeAddress
                const amountMicro = isPayment ? tx['payment-transaction'].amount : 0
                const amountAlgo = amountMicro / 1000000

                let label = 'Transaction'
                if (isPayment) {
                    const otherParty = isSender ? tx['payment-transaction'].receiver : tx.sender
                    label = isSender
                        ? `To: ${otherParty.slice(0, 4)}...${otherParty.slice(-4)}`
                        : `From: ${otherParty.slice(0, 4)}...${otherParty.slice(-4)}`
                } else if (tx['application-transaction']) {
                    label = 'App Call'
                }

                return {
                    id: tx.id,
                    label,
                    date: new Date(tx['round-time'] * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
                    amount: isPayment ? `${isSender ? '-' : '+'}${amountAlgo.toFixed(2)} ALGO` : '0.00 ALGO',
                    type: isSender ? 'debit' : 'credit'
                }
            })
            setTransactions(formattedTxns)
        } catch (e) {
            console.error('Error fetching history:', e)
        }
    }, [activeAddress])

    useEffect(() => {
        if (activeAddress) {
            fetchBalance()
            fetchHistory()
        }
    }, [activeAddress, fetchBalance, fetchHistory])

    const handleSend = async (receiver: string, amount: number) => {
        if (!activeAddress) return
        setLoading(true)
        try {
            const suggestedParams = await algodClient.getTransactionParams().do()
            const amountMicroAlgos = Math.floor(amount * 1000000)

            const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
                sender: activeAddress,
                receiver: receiver,
                amount: amountMicroAlgos,
                suggestedParams,
            })

            const encodedTxn = algosdk.encodeUnsignedTransaction(txn)
            const signedTxns = await signTransactions([encodedTxn])
            const validSignedTxns = signedTxns.filter((t) => t !== null) as Uint8Array[]

            const response = await algodClient.sendRawTransaction(validSignedTxns).do()
            const txId = response.txid

            enqueueSnackbar(`Sent! TxID: ${txId.slice(0, 8)}...`, { variant: 'info' })

            await algosdk.waitForConfirmation(algodClient, txId, 4)
            enqueueSnackbar('Transaction confirmed!', { variant: 'success' })

            fetchBalance()
            fetchHistory()
        } catch (e: any) {
            enqueueSnackbar(`Failed: ${e.message}`, { variant: 'error' })
        } finally {
            setLoading(false)
        }
    }

    // Theme State
    const [theme, setTheme] = useState<"light" | "dark">("dark")

    const toggleTheme = () => {
        setTheme(prev => prev === "light" ? "dark" : "light")
    }

    const textColor = theme === "dark" ? "text-white" : "text-black"
    const subTextColor = theme === "dark" ? "text-white/50" : "text-black/50"

    return (
        <main className={`relative flex min-h-svh flex-col items-center transition-colors duration-500 font-sans ${theme === "dark" ? "bg-black" : "bg-[#F5F5F7]"}`}>
            {/* Header */}
            <header className="flex w-full max-w-lg items-center justify-between px-6 pt-8 mb-8">
                <span className={`text-xs font-medium uppercase tracking-[0.2em] ${subTextColor}`}>
                    Campus Wallet
                </span>

                <div className="flex items-center gap-4">
                    <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                    <div
                        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={onWalletClick}
                    >
                        <div className={`h-2 w-2 rounded-full ${theme === "dark" ? "bg-emerald-400" : "bg-emerald-600"} animate-pulse`} />
                        <span className={`text-[10px] font-mono ${theme === "dark" ? "text-white/70" : "text-black/70"}`}>
                            {activeAddress?.slice(0, 4)}...{activeAddress?.slice(-4)}
                        </span>
                    </div>
                </div>
            </header>

            {/* Balance — centred hero */}
            <section className="flex flex-1 flex-col items-center justify-center px-6 mb-12">
                <BalanceDisplay amount={balance} theme={theme} />
            </section>

            {/* Bottom dock & transactions */}
            <section className="flex w-full max-w-lg flex-col items-center gap-12 px-6 pb-16">
                <ActionDock
                    theme={theme}
                    onReceive={() => setReceiveOpen(true)}
                    onPay={() => setSendOpen(true)}
                    onEscrow={onEscrowClick}
                />
                <TransactionList transactions={transactions} theme={theme} />
            </section>

            {/* Modals */}
            <ReceiveModal
                isOpen={receiveOpen}
                onClose={() => setReceiveOpen(false)}
                address={activeAddress || ""}
            />
            <SendModal
                isOpen={sendOpen}
                onClose={() => setSendOpen(false)}
                onSend={handleSend}
                isLoading={loading}
            />
        </main>
    )
}
