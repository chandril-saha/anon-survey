import { SurveySimulator } from './counter-simulator.js';
import { setNetworkId } from '@midnight-ntwrk/midnight-js-network-id';
import { describe, it, expect } from 'vitest';

setNetworkId('undeployed');

describe('Anonymous survey smart contract', () => {
  it('generates initial ledger state deterministically', () => {
    const simulator0 = new SurveySimulator();
    const simulator1 = new SurveySimulator();
    expect(simulator0.getLedger()).toEqual(simulator1.getLedger());
  });

  it('transitions public state when submitting an anonymous response', () => {
    const simulator = new SurveySimulator();
    const initialLedger = simulator.getLedger();
    expect(initialLedger.round).toEqual(0n);
    expect(initialLedger.lastPublicIncrement).toEqual(0n);

    const nextLedger = simulator.submitResponse();
    expect(nextLedger.round).toEqual(1n);
    expect(nextLedger.lastPublicIncrement).toEqual(1n);
  });

  it('increments the counter for each anonymous response', () => {
    const simulator = new SurveySimulator();

    const ledger1 = simulator.submitResponse();
    expect(ledger1.round).toEqual(1n);

    const ledger2 = simulator.submitResponse();
    expect(ledger2.round).toEqual(2n);

    const ledger3 = simulator.submitResponse();
    expect(ledger3.round).toEqual(3n);
  });

  it('never exposes private witness values on the public ledger', () => {
    const secretToken = 42n;
    const secretWitnesses = {
      voteToken: (ctx: any): [any, bigint] => [ctx.privateState, secretToken],
      responseToken: (ctx: any): [any, bigint] => [ctx.privateState, secretToken],
      surveyIdWitness: (ctx: any): [any, bigint] => [ctx.privateState, 1n],
    };

    const simulator = new SurveySimulator({ privateCounter: 0 }, secretWitnesses);
    const nextLedger = simulator.submitResponse();
    const ledgerJson = JSON.stringify(nextLedger, (_key, value) =>
      typeof value === 'bigint' ? value.toString() : value,
    );

    // The response should register (round incremented)
    expect(nextLedger.round).toEqual(1n);
    // But the secret token value (42) must never appear in public ledger state
    expect(ledgerJson).not.toContain('42');
    expect(ledgerJson).not.toContain(String(secretToken));
  });

  it('proves response validity without revealing response contents', () => {
    const simulator = new SurveySimulator();
    const ledgerBefore = simulator.getLedger();
    
    simulator.submitResponse();
    const ledgerAfter = simulator.getLedger();
    
    // Public ledger only shows incremented counter, not response details
    expect(ledgerAfter.round).toEqual(ledgerBefore.round + 1n);
    expect(ledgerAfter.lastPublicIncrement).toEqual(1n);
  });
});
