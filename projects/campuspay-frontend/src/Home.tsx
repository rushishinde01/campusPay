import { useWallet } from '@txnlab/use-wallet-react'
import React, { useState } from 'react'
import ConnectWallet from './components/ConnectWallet'
import Transact from './components/Transact'
import AppCalls from './components/AppCalls'
import { Dashboard } from './components/dashboard/Dashboard'

interface HomeProps { }

const Home: React.FC<HomeProps> = () => {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)
  const [openDemoModal, setOpenDemoModal] = useState<boolean>(false)
  const [appCallsDemoModal, setAppCallsDemoModal] = useState<boolean>(false)
  const { activeAddress } = useWallet()

  const toggleWalletModal = () => {
    setOpenWalletModal(!openWalletModal)
  }

  const toggleAppCallsModal = () => {
    setAppCallsDemoModal(!appCallsDemoModal)
  }

  const toggleDemoModal = () => {
    setOpenDemoModal(!openDemoModal)
  }

  // If connected, show Dashboard
  if (activeAddress) {
    return (
      <>
        <Dashboard
          onEscrowClick={toggleAppCallsModal}
          onWalletClick={toggleWalletModal}
        />
        <AppCalls openModal={appCallsDemoModal} setModalState={setAppCallsDemoModal} />
        <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
      </>
    )
  }

  // Landing Page
  return (
    <div className="hero min-h-screen bg-black text-white relative overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-teal-900/20 rounded-full blur-[120px]" />
      </div>

      <div className="hero-content text-center z-10 max-w-2xl px-6">
        <div className="flex flex-col items-center gap-8">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-thin tracking-tighter">
              Campus<span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-purple-500">Wallet</span>
            </h1>
            <p className="text-xl text-white/50 tracking-wide font-light">
              The Future of Student Payments on Algorand
            </p>
          </div>

          <div className="flex flex-col gap-4 w-full max-w-sm">
            <button
              data-test-id="connect-wallet"
              className="btn border-none bg-white text-black hover:bg-gray-200 text-lg py-4 h-auto rounded-full font-medium tracking-wide transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
              onClick={toggleWalletModal}
            >
              Connect Wallet
            </button>
            <p className="text-xs text-white/30 uppercase tracking-[0.2em] mt-4">
              Powered by Algorand Testnet
            </p>
          </div>

          <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
          <Transact openModal={openDemoModal} setModalState={setOpenDemoModal} />
        </div>
      </div>
    </div>
  )
}

export default Home
