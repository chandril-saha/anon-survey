import { describe, it, expect, vi, beforeEach } from 'vitest';
import { surveyService } from '../src/lib/surveyService';

// Mock the blockchain service so tests don't attempt to connect to Lace
vi.mock('../src/lib/blockchain', () => {
  return {
    blockchainService: {
      submitSurveyResponseTx: vi.fn().mockResolvedValue('mock-tx-hash')
    }
  };
});

describe('Survey Service (Application Logic)', () => {
  const MOCK_WALLET = 'mn_addr_test123';
  const SURVEY_ID_ACTIVE = 'srv-001';
  const SURVEY_ID_CLOSED = 'srv-006';

  beforeEach(() => {
    // We would normally clear internal state here, but since the service
    // is a singleton with in-memory arrays for the hackathon, we will just 
    // use dynamic wallets or different surveys to avoid state pollution between tests.
  });

  it('1. should fetch initial surveys correctly', async () => {
    const surveys = await surveyService.getSurveys();
    expect(surveys).toBeDefined();
    expect(surveys.length).toBeGreaterThan(0);
    
    const activeSurvey = surveys.find(s => s.id === SURVEY_ID_ACTIVE);
    expect(activeSurvey).toBeDefined();
    expect(activeSurvey?.status).toBe('active');
  });

  it('2. should successfully submit a response to an active survey', async () => {
    const wallet = `wallet_${Date.now()}`;
    const answers = { q1: 5, q2: 'Agree' };

    const result = await surveyService.submitResponse(SURVEY_ID_ACTIVE, wallet, answers);
    
    expect(result.txHash).toBeDefined();
    
    // Verify it was marked as submitted
    const hasSubmitted = await surveyService.hasSubmitted(SURVEY_ID_ACTIVE, wallet);
    expect(hasSubmitted).toBe(true);
  });

  it('3. should prevent duplicate submissions from the same wallet', async () => {
    const wallet = `wallet_dup_${Date.now()}`;
    const answers = { q1: 4 };

    // First submission should succeed
    await surveyService.submitResponse(SURVEY_ID_ACTIVE, wallet, answers);

    // Second submission should throw an error
    await expect(
      surveyService.submitResponse(SURVEY_ID_ACTIVE, wallet, answers)
    ).rejects.toThrow('You have already submitted a response to this survey.');
  });

  it('4. should prevent submissions to a closed survey', async () => {
    const wallet = `wallet_closed_${Date.now()}`;
    const answers = { q1: 3 };

    await expect(
      surveyService.submitResponse(SURVEY_ID_CLOSED, wallet, answers)
    ).rejects.toThrow('This survey is no longer accepting responses.');
  });
});
