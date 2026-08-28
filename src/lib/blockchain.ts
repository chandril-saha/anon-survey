import type { InitialAPI, ConnectedAPI, ProvingProvider, Configuration } from '@midnight-ntwrk/dapp-connector-api';
import { dappConnectorProofProvider } from '@midnight-ntwrk/midnight-js-dapp-connector-proof-provider';
import { createCircuitCallTxInterface, submitCallTx } from '@midnight-ntwrk/midnight-js-contracts';
import { CompiledContract } from '@midnight-ntwrk/compact-js';
import * as Survey from '../../managed/survey/contract/index.js';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';

declare global {
  interface Window {
    midnight?: Record<string, InitialAPI>;
  }
}

class BlockchainService {
  private api: ConnectedAPI | null = null;
  private currentAddress: string | null = null;
  private currentNetwork: string | number | null = null;
  private contractAddress: string | null = (import.meta as any).env.VITE_CONTRACT_ADDRESS || null;
  private compiledContract: any = null;

  async connectWallet(): Promise<{ address: string; network: string | number; balances: any }> {
    if (this.api && this.currentAddress) {
      return { 
        address: this.currentAddress, 
        network: this.currentNetwork || 'preview', 
        balances: {} 
      };
    }

    if (!window.midnight || !window.midnight.mnLace) {
      throw new Error("Lace wallet not found. Please install the Lace browser extension.");
    }

    const provider = window.midnight.mnLace;

    try {
      this.api = await provider.connect("preview");
      
      const addrObj = await this.api.getUnshieldedAddress();
      this.currentAddress = addrObj.unshieldedAddress;
      this.currentNetwork = "preview";
      
      // @ts-ignore - Ignore type arguments mismatch for now
      setNetworkId('preview');

      return {
        address: this.currentAddress,
        network: this.currentNetwork,
        balances: {}
      };
      
    } catch (e: any) {
      console.error("Connection Error Details:", e);
      if (e.message && e.message.toLowerCase().includes('locked')) {
        throw new Error("Wallet is locked. Please unlock Lace and try again.");
      }
      throw new Error(e.message || "Wallet connection failed or was rejected by the user.");
    }
  }

  async disconnectWallet(): Promise<void> {
    this.api = null;
    this.currentAddress = null;
    this.currentNetwork = null;
  }

  isConnected(): boolean {
    return this.api !== null && this.currentAddress !== null;
  }

  getAddress(): string | null {
    return this.currentAddress;
  }

  getNetwork(): string | number | null {
    return this.currentNetwork;
  }

  getContractAddress(): string | null {
    return this.contractAddress;
  }

  getCompiledContract(dummyWitnesses: any) {
    if (!this.compiledContract) {
      // @ts-ignore
      this.compiledContract = CompiledContract.make('survey', Survey.Contract).pipe(
        // @ts-ignore
        CompiledContract.withWitnesses(dummyWitnesses)
      );
    }
    return this.compiledContract;
  }

  async buildProviders(dummyWitnesses: any) {
    if (!this.api) throw new Error("Wallet not connected.");
    
    const config = await this.api.getConfiguration();
    
    const keyMaterialProvider = {
      getZKIR: async (location: string) => new Uint8Array(await (await fetch(`/${location}.zkir`)).arrayBuffer()),
      getProverKey: async (location: string) => new Uint8Array(await (await fetch(`/${location}.pk`)).arrayBuffer()),
      getVerifierKey: async (location: string) => new Uint8Array(await (await fetch(`/${location}.vk`)).arrayBuffer()),
    };

    const provingProvider = await this.api.getProvingProvider(keyMaterialProvider);
    // @ts-ignore - Ignore missing costModel argument
    const proofProvider = dappConnectorProofProvider(provingProvider);

    const publicDataProvider = indexerPublicDataProvider(
      config.indexerUri,
      config.indexerWsUri
    );

    return {
      proofProvider,
      publicDataProvider,
      walletProvider: {
        coinPublicKey: (await this.api.getShieldedAddresses()).shieldedCoinPublicKey,
        balanceTx: this.api.balanceUnsealedTransaction.bind(this.api),
      },
    };
  }

  async submitSurveyResponseTx(surveyId: string, walletAddress: string): Promise<string> {
    if (!this.contractAddress) {
      throw new Error("Contract address is not set in environment.");
    }
    if (!this.api) {
      throw new Error("Wallet not connected.");
    }

    // 1. Construct the dummy witnesses returning the tuple `[privateState, value]`
    const dummyWitnesses = {
      responseToken: (context: any) => [context.privateState, 1n], // Must be > 0
      surveyIdWitness: (context: any) => [context.privateState, 1n], // Must be > 0
    };

    // 2. Build the providers and the compiled contract
    const providers = await this.buildProviders(dummyWitnesses);
    const compiledContract = this.getCompiledContract(dummyWitnesses);

    // 3. Create the circuit call interface
    // @ts-ignore - Ignore exact provider mismatch
    const callTxInterface = createCircuitCallTxInterface(
      providers as any,
      compiledContract,
      this.contractAddress
    );

    // 4. Create unproven transaction using submitResponse circuit
    const unprovenTx = await callTxInterface.submitResponse();

    // 5. Submit to network
    // @ts-ignore - Ignore exact unprovenTx type mismatch
    const result = await submitCallTx(providers as any, {
      unprovenTx: unprovenTx
    } as any);

    return "Transaction successfully submitted!";
  }
}

export const blockchainService = new BlockchainService();
