import {
  type CircuitContext,
  sampleContractAddress,
  createConstructorContext,
  createCircuitContext,
} from '@midnight-ntwrk/compact-runtime';
import {
  Contract,
  type Ledger,
  ledger,
} from '../managed/counter/contract/index.js';
import { type SurveyPrivateState, witnesses } from '../src/witnesses.js';

/**
 * SurveySimulator wraps the Compact contract runtime for unit testing.
 * It exercises the original counter.compact contract, which serves as
 * the foundation for the survey contract's submitResponse circuit.
 */
export class SurveySimulator {
  readonly contract: Contract<SurveyPrivateState>;
  circuitContext: CircuitContext<SurveyPrivateState>;

  constructor(
    privateState: SurveyPrivateState = { privateCounter: 0 },
    witnessImpl: typeof witnesses = witnesses,
  ) {
    this.contract = new Contract(witnessImpl);
    const { currentPrivateState, currentContractState, currentZswapLocalState } =
      this.contract.initialState(createConstructorContext(privateState, '0'.repeat(64)));
    this.circuitContext = createCircuitContext(
      sampleContractAddress(),
      currentZswapLocalState,
      currentContractState,
      currentPrivateState,
    );
  }

  public getLedger(): Ledger {
    return ledger(this.circuitContext.currentQueryContext.state);
  }

  public getPrivateState(): SurveyPrivateState {
    return this.circuitContext.currentPrivateState;
  }

  /** Submit an anonymous response (exercises castVote circuit from counter.compact) */
  public submitResponse(): Ledger {
    this.circuitContext = this.contract.impureCircuits.castVote(this.circuitContext).context;
    return ledger(this.circuitContext.currentQueryContext.state);
  }
}

// Legacy alias
export { SurveySimulator as CounterSimulator };
