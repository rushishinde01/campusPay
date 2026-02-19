import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { useState, useEffect } from 'react'
import algosdk from 'algosdk'
import { getAlgodConfigFromViteEnvironment, getIndexerConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'

interface WalletProps {
    openModal: boolean
    setModalState: (value: boolean) => void
}

const Wallet = ({ openModal, setModalState }: WalletProps) => {
    const { activeAddress, signTransactions } = useWallet()
    const { enqueueSnackbar } = useSnackbar()

    const [balance, setBalance] = useState<number>(0)
    const [history, setHistory] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    // Form State
    const [receiver, setReceiver] = useState<string>('')
    const [amount, setAmount] = useState<string>('')

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

    const fetchBalance = async () => {
        if (!activeAddress) return
        try {
            const accountInfo = await algodClient.accountInformation(activeAddress).do()
            setBalance(Number(accountInfo.amount) / 1000000) // Convert microAlgos to Algos
        } catch (e) {
            console.error('Error fetching balance:', e)
        }
    }

    const fetchHistory = async () => {
        if (!activeAddress) return
        try {
            const response = await indexerClient.lookupAccountTransactions(activeAddress).limit(10).do()
            setHistory(response['transactions'])
        } catch (e) {
            console.error('Error fetching history:', e)
        }
    }

    useEffect(() => {
        if (openModal && activeAddress) {
            fetchBalance()
            fetchHistory()
        }
    }, [openModal, activeAddress])

    const handleSend = async () => {
        if (!activeAddress || !receiver || !amount) {
            enqueueSnackbar('Please fill all fields', { variant: 'warning' })
            return
        }

        setLoading(true)
        try {
            const suggestedParams = await algodClient.getTransactionParams().do()
            const amountMicroAlgos = Number(amount) * 1000000

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

            enqueueSnackbar(`Transaction sent: ${txId}`, { variant: 'info' })

            await algosdk.waitForConfirmation(algodClient, txId, 4)
            enqueueSnackbar('Transaction confirmed!', { variant: 'success' })

            setReceiver('')
            setAmount('')
            fetchBalance()
            fetchHistory()
        } catch (e: any) {
            enqueueSnackbar(`Failed: ${e.message}`, { variant: 'error' })
        } finally {
            setLoading(false)
        }
    }

    return (
        <dialog id="wallet_modal" className={`modal ${openModal ? 'modal-open' : ''} bg-slate-200`}>
            <form method="dialog" className="modal-box w-11/12 max-w-5xl">
                <h3 className="font-bold text-lg mb-4">Campus Wallet</h3>

                <div className="stats shadow w-full mb-6">
                    <div className="stat">
                        <div className="stat-title">Current Balance</div>
                        <div className="stat-value text-primary">{balance.toFixed(4)} ALGO</div>
                        <div className="stat-desc">{activeAddress}</div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4">
                    {/* Send Section */}
                    <div className="card bg-base-100 shadow-xl flex-1">
                        <div className="card-body">
                            <h2 className="card-title">Send Payment</h2>
                            <input
                                type="text"
                                placeholder="Receiver Address"
                                className="input input-bordered w-full"
                                value={receiver}
                                onChange={(e) => setReceiver(e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="Amount (ALGO)"
                                className="input input-bordered w-full"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                            <button
                                className="btn btn-primary"
                                onClick={handleSend}
                                disabled={loading}
                            >
                                {loading ? <span className="loading loading-spinner"></span> : 'Send ALGO'}
                            </button>
                        </div>
                    </div>

                    {/* History Section */}
                    <div className="card bg-base-100 shadow-xl flex-1">
                        <div className="card-body">
                            <h2 className="card-title">Recent Transactions</h2>
                            <div className="overflow-x-auto">
                                <table className="table table-xs">
                                    <thead>
                                        <tr>
                                            <th>Type</th>
                                            <th>Amount</th>
                                            <th>To/From</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {history.map((tx) => (
                                            <tr key={tx.id}>
                                                <td>{tx['payment-transaction'] ? 'Pay' : 'Other'}</td>
                                                <td>
                                                    {tx['payment-transaction']
                                                        ? (tx['payment-transaction'].amount / 1000000).toFixed(2)
                                                        : 0}
                                                </td>
                                                <td className="truncate max-w-[100px]">
                                                    {tx['payment-transaction']?.receiver === activeAddress
                                                        ? 'Received'
                                                        : 'Sent'}
                                                </td>
                                            </tr>
                                        ))}
                                        {history.length === 0 && <tr><td colSpan={3}>No transactions found</td></tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal-action">
                    <button className="btn" onClick={() => setModalState(false)}>Close</button>
                </div>
            </form>
        </dialog>
    )
}

export default Wallet
