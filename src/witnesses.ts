import type { WitnessContext } from '@midnight-ntwrk/compact-runtime';
import type { Ledger } from '../managed/counter/contract/index.js';

export type SurveyPrivateState = {
  privateCounter: number;
};

// Legacy alias for backward compatibility with existing tests
export type CounterPrivateState = SurveyPrivateState;

/**
 * Default witnesses for the anonymous survey contract.
 *
 * Each witness receives a WitnessContext and returns a tuple:
 *   [nextPrivateState, result]
 *
 * responseToken: returns a default token value of 1 (non-zero = valid eligibility).
 * surveyIdWitness: returns a default survey ID of 1.
 * voteToken: kept for backward compatibility with the original counter.compact contract.
 */
export const witnesses = {
  responseToken(context: WitnessContext<Ledger, SurveyPrivateState>): [SurveyPrivateState, bigint] {
    return [context.privateState, 1n];
  },

  surveyIdWitness(context: WitnessContext<Ledger, SurveyPrivateState>): [SurveyPrivateState, bigint] {
    return [context.privateState, 1n];
  },

  // Backward compatibility with counter.compact
  voteToken(context: WitnessContext<Ledger, SurveyPrivateState>): [SurveyPrivateState, bigint] {
    return [context.privateState, 1n];
  },
};
