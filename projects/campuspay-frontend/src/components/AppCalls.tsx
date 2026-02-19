import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { CampusPayFactory } from '../contracts/CampusPay'
import { OnSchemaBreak, OnUpdate } from '@algorandfoundation/algokit-utils/types/app'
import { getAlgodConfigFromViteEnvironment, getIndexerConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

interface AppCallsInterface {
  openModal: boolean
  setModalState: (value: boolean) => void
}

const AppCalls = ({ openModal, setModalState }: AppCallsInterface) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [amountInput, setAmountInput] = useState<string>('200000')
  const [receiverInput, setReceiverInput] = useState<string>('') // ✅ NEW
  const { enqueueSnackbar } = useSnackbar()
  const { transactionSigner, activeAddress } = useWallet()

  const algodConfig = getAlgodConfigFromViteEnvironment()
  const indexerConfig = getIndexerConfigFromViteEnvironment()
  const algorand = AlgorandClient.fromConfig({ algodConfig, indexerConfig })
  algorand.setDefaultSigner(transactionSigner)

  const sendAppCall = async () => {
    if (!activeAddress) {
      enqueueSnackbar('Please connect your wallet first.', { variant: 'warning' })
      return
    }

    if (!receiverInput.trim()) {
      enqueueSnackbar('Please enter a receiver address (must be different than your address).', { variant: 'warning' })
      return
    }

    if (receiverInput.trim() === activeAddress) {
      enqueueSnackbar('Receiver must be different than payer.', { variant: 'error' })
      return
    }

    setLoading(true)

    const factory = new CampusPayFactory({
      defaultSender: activeAddress,
      algorand,
    })

    const deployResult = await factory
      .deploy({
        onSchemaBreak: OnSchemaBreak.AppendApp,
        onUpdate: OnUpdate.AppendApp,
      })
      .catch((e: Error) => {
        enqueueSnackbar(`Error deploying the contract: ${e.message}`, { variant: 'error' })
        setLoading(false)
        return undefined
      })

    if (!deployResult) return
    const { appClient } = deployResult

    const amount = BigInt(amountInput)

    const response = await appClient.send
      .createEscrow({
        args: {
          receiver: receiverInput.trim(),
          amount,
        },
      })
      .catch((e: Error) => {
        enqueueSnackbar(`Error calling contract: ${e.message}`, { variant: 'error' })
        setLoading(false)
        return undefined
      })

    if (!response) return

    enqueueSnackbar('Escrow created successfully!', { variant: 'success' })
    setLoading(false)
  }

  return (
    <dialog id="appcalls_modal" className={`modal ${openModal ? 'modal-open' : ''} bg-slate-200`}>
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-lg">Create Escrow (CampusPay)</h3>
        <br />

        {/* ✅ Receiver address input */}
        <input
          type="text"
          placeholder="Receiver address (must NOT be your address)"
          className="input input-bordered w-full"
          value={receiverInput}
          onChange={(e) => setReceiverInput(e.target.value)}
        />

        <br />
        <br />

        <input
          type="number"
          placeholder="Amount in microAlgos (e.g. 200000)"
          className="input input-bordered w-full"
          value={amountInput}
          onChange={(e) => setAmountInput(e.target.value)}
        />

        <div className="modal-action">
          <button className="btn" onClick={() => setModalState(!openModal)}>
            Close
          </button>

          <button className="btn" onClick={sendAppCall}>
            {loading ? <span className="loading loading-spinner" /> : 'Create Escrow'}
          </button>
        </div>
      </form>
    </dialog>
  )
}

export default AppCalls