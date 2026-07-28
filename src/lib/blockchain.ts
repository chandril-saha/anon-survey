export interface MidnightWalletAPI {
  connect: (networkId: string) => Promise<MidnightDAppAPI>;
  name?: string;
  version?: string;
}

export interface MidnightDAppAPI {
  getUnshieldedAddress: () => Promise<unknown>;
  getUnshieldedBalances: () => Promise<unknown>;
  getShieldedAddresses?: () => Promise<unknown[]>;
  getShieldedBalances?: () => Promise<unknown[]>;
  getConfiguration: () => Promise<unknown>;
  signTransaction: (tx: unknown) => Promise<unknown>;
  submitTransaction: (tx: unknown) => Promise<unknown>;
}

declare global {
  interface Window {
    midnight?: {
      [key: string]: MidnightWalletAPI | undefined;
    };
  }
}

class BlockchainService {
  private api: MidnightDAppAPI | null = null;
  private currentAddress: string | null = null;
  private currentNetwork: string | number | null = null;
  private currentBalances: any = null;

  async connectWallet(): Promise<{ address: string; network: string | number; balances: any }> {
    if (this.api && this.currentAddress) {
      return { 
        address: this.currentAddress, 
        network: this.currentNetwork || 'preview', 
        balances: this.currentBalances 
      };
    }

    if (!window.midnight) {
      throw new Error("Please install or enable a Midnight compatible wallet (like Lace).");
    }

    // Dynamically discover the wallet provider (Lace injects a UUID key)
    const walletKeys = Object.keys(window.midnight);
    if (walletKeys.length === 0) {
      throw new Error("Midnight wallet object found, but no providers are available.");
    }
    
    // Grab the first available wallet provider
    const walletKey = walletKeys[0];
    const wallet = window.midnight[walletKey];

    if (!wallet || typeof wallet.connect !== 'function') {
      throw new Error("Invalid wallet API detected (missing connect method).");
    }

    try {
      this.api = await wallet.connect("preview");
      
      const rawAddress = await this.api.getUnshieldedAddress();
      console.log("Raw Address from wallet:", rawAddress);
      
      let addressStr = String(rawAddress);
      if (Array.isArray(rawAddress)) {
        addressStr = String(rawAddress[0]);
      } else if (rawAddress && typeof rawAddress === 'object') {
        addressStr = String(Object.values(rawAddress)[0]);
      }
      const address = addressStr;
      
      let balance = null;
      try {
        if (typeof this.api.getUnshieldedBalances === 'function') {
          balance = await this.api.getUnshieldedBalances();
        }
      } catch (e) {
        console.warn("Could not fetch balances", e);
      }
      
      let config: any = "preview";
      try {
        if (typeof this.api.getConfiguration === 'function') {
          config = await this.api.getConfiguration();
        }
      } catch (e) {
        console.warn("Could not fetch configuration", e);
      }

      this.currentAddress = address;
      this.currentNetwork = "preview";
      this.currentBalances = balance || {};

      return {
        address: this.currentAddress,
        network: this.currentNetwork,
        balances: this.currentBalances
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
    this.currentBalances = null;
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

  getBalance(): any {
    return this.currentBalances;
  }

  async signTransaction(tx: unknown): Promise<unknown> {
    if (!this.api) throw new Error("Wallet not connected.");
    throw new Error("Contract not deployed");
  }

  async submitTransaction(tx: unknown): Promise<unknown> {
    if (!this.api) throw new Error("Wallet not connected.");
    throw new Error("Contract not deployed");
  }

  getContractAddress(): string | null {
    return import.meta.env.VITE_CONTRACT_ADDRESS || null;
  }
}

export const blockchainService = new BlockchainService();
