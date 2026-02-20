import { AlgoViteClientConfig, AlgoViteKMDConfig } from '../../interfaces/network'

export function getAlgodConfigFromViteEnvironment(): AlgoViteClientConfig {
  // Fallback to Testnet if env vars are missing (Submission Hack)
  if (!import.meta.env.VITE_ALGOD_SERVER) {
    return {
      server: 'https://testnet-api.algonode.cloud',
      port: '443',
      token: '',
      network: 'testnet',
    }
  }

  return {
    server: import.meta.env.VITE_ALGOD_SERVER,
    port: import.meta.env.VITE_ALGOD_PORT,
    token: import.meta.env.VITE_ALGOD_TOKEN,
    network: import.meta.env.VITE_ALGOD_NETWORK,
  }
}

export function getIndexerConfigFromViteEnvironment(): AlgoViteClientConfig {
  // Fallback to Testnet if env vars are missing (Submission Hack)
  if (!import.meta.env.VITE_INDEXER_SERVER) {
    return {
      server: 'https://testnet-idx.algonode.cloud',
      port: '443',
      token: '',
      network: 'testnet',
    }
  }

  if (!import.meta.env.VITE_INDEXER_SERVER) {
    throw new Error('Attempt to get default algod configuration without specifying VITE_INDEXER_SERVER in the environment variables')
  }

  return {
    server: import.meta.env.VITE_INDEXER_SERVER,
    port: import.meta.env.VITE_INDEXER_PORT,
    token: import.meta.env.VITE_INDEXER_TOKEN,
    network: import.meta.env.VITE_ALGOD_NETWORK,
  }
}

export function getKmdConfigFromViteEnvironment(): AlgoViteKMDConfig {
  if (!import.meta.env.VITE_KMD_SERVER) {
    throw new Error('Attempt to get default kmd configuration without specifying VITE_KMD_SERVER in the environment variables')
  }

  return {
    server: import.meta.env.VITE_KMD_SERVER,
    port: import.meta.env.VITE_KMD_PORT,
    token: import.meta.env.VITE_KMD_TOKEN,
    wallet: import.meta.env.VITE_KMD_WALLET,
    password: import.meta.env.VITE_KMD_PASSWORD,
  }
}
