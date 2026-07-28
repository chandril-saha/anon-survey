/**
 * Survey Data Service
 * 
 * Centralized mock data layer that mirrors the future contract API.
 * All analytics are computed dynamically from stored data — nothing is hardcoded.
 * When the contract is deployed, replace the internal storage with contract calls.
 */

export type SurveyCategory =
  | 'Workplace Feedback'
  | 'Student Feedback'
  | 'Customer Satisfaction'
  | 'Community Governance'
  | 'Mental Health Check'
  | 'Anonymous Event Feedback';

export type SurveyStatus = 'active' | 'closed' | 'upcoming';

export interface SurveyQuestion {
  id: string;
  text: string;
  type: 'rating' | 'choice' | 'text';
  options?: string[];
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  category: SurveyCategory;
  status: SurveyStatus;
  responseCount: number;
  closingDate: string;
  createdAt: string;
  questions: SurveyQuestion[];
}

export interface SurveyResponse {
  surveyId: string;
  answers: Record<string, string | number>;
  submittedAt: string;
}

export interface SurveyAnalytics {
  surveyId: string;
  totalResponses: number;
  questionBreakdown: {
    questionId: string;
    questionText: string;
    type: string;
    distribution: Record<string, number>;
  }[];
}

// ─── Internal Storage ───────────────────────────────────────────────────
// This simulates what would live on-chain or in an indexer.
const surveys: Survey[] = [
  {
    id: 'srv-001',
    title: 'Workplace Culture Assessment',
    description: 'Help us understand your experience at work. All responses are completely anonymous through zero-knowledge proofs.',
    category: 'Workplace Feedback',
    status: 'active',
    responseCount: 0,
    closingDate: '2026-08-15',
    createdAt: '2026-07-20',
    questions: [
      { id: 'q1', text: 'How would you rate your overall job satisfaction?', type: 'rating' },
      { id: 'q2', text: 'Do you feel your contributions are valued?', type: 'choice', options: ['Strongly Agree', 'Agree', 'Neutral', 'Disagree', 'Strongly Disagree'] },
      { id: 'q3', text: 'What would improve your work environment?', type: 'text' },
    ],
  },
  {
    id: 'srv-002',
    title: 'Student Course Feedback',
    description: 'Rate your learning experience this semester. Your identity remains mathematically hidden.',
    category: 'Student Feedback',
    status: 'active',
    responseCount: 0,
    closingDate: '2026-08-30',
    createdAt: '2026-07-22',
    questions: [
      { id: 'q1', text: 'How effective was the teaching methodology?', type: 'rating' },
      { id: 'q2', text: 'Would you recommend this course?', type: 'choice', options: ['Definitely', 'Probably', 'Not Sure', 'Probably Not', 'Definitely Not'] },
      { id: 'q3', text: 'What topics should be added or removed?', type: 'text' },
    ],
  },
  {
    id: 'srv-003',
    title: 'Product Satisfaction Survey',
    description: 'Share honest feedback about our product. Zero-knowledge proofs ensure your anonymity.',
    category: 'Customer Satisfaction',
    status: 'active',
    responseCount: 0,
    closingDate: '2026-09-01',
    createdAt: '2026-07-25',
    questions: [
      { id: 'q1', text: 'How satisfied are you with the product quality?', type: 'rating' },
      { id: 'q2', text: 'How likely are you to recommend us?', type: 'choice', options: ['Very Likely', 'Likely', 'Neutral', 'Unlikely', 'Very Unlikely'] },
      { id: 'q3', text: 'Any additional feedback?', type: 'text' },
    ],
  },
  {
    id: 'srv-004',
    title: 'Community Budget Allocation',
    description: 'Vote on how community funds should be allocated. Your preferences stay private.',
    category: 'Community Governance',
    status: 'active',
    responseCount: 0,
    closingDate: '2026-08-20',
    createdAt: '2026-07-18',
    questions: [
      { id: 'q1', text: 'Which area deserves the most funding?', type: 'choice', options: ['Education', 'Infrastructure', 'Healthcare', 'Environment', 'Technology'] },
      { id: 'q2', text: 'Rate the current community management.', type: 'rating' },
    ],
  },
  {
    id: 'srv-005',
    title: 'Mental Wellness Check-In',
    description: 'A safe, anonymous space to share how you are feeling. Your responses are never linked to your identity.',
    category: 'Mental Health Check',
    status: 'active',
    responseCount: 0,
    closingDate: '2026-12-31',
    createdAt: '2026-07-01',
    questions: [
      { id: 'q1', text: 'How would you rate your overall mental wellbeing this week?', type: 'rating' },
      { id: 'q2', text: 'Have you felt supported by those around you?', type: 'choice', options: ['Always', 'Often', 'Sometimes', 'Rarely', 'Never'] },
      { id: 'q3', text: 'Is there anything specific weighing on your mind?', type: 'text' },
    ],
  },
  {
    id: 'srv-006',
    title: 'Hackathon Event Feedback',
    description: 'Rate your experience at the recent hackathon event. Fully anonymous.',
    category: 'Anonymous Event Feedback',
    status: 'closed',
    responseCount: 0,
    closingDate: '2026-07-15',
    createdAt: '2026-07-10',
    questions: [
      { id: 'q1', text: 'How would you rate the event overall?', type: 'rating' },
      { id: 'q2', text: 'What was the best part?', type: 'choice', options: ['Workshops', 'Networking', 'Mentorship', 'Prizes', 'Venue'] },
      { id: 'q3', text: 'How can we improve next time?', type: 'text' },
    ],
  },
];

const responses: SurveyResponse[] = [];
const submittedWallets: Set<string> = new Set(); // surveyId:walletAddress

// Simulated delay for realistic UX
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// ─── Public API ─────────────────────────────────────────────────────────

export const surveyService = {
  async getSurveys(): Promise<Survey[]> {
    await delay(600);
    return [...surveys];
  },

  async getSurvey(id: string): Promise<Survey | null> {
    await delay(400);
    return surveys.find(s => s.id === id) || null;
  },

  async submitResponse(
    surveyId: string,
    walletAddress: string,
    answers: Record<string, string | number>
  ): Promise<{ txHash: string }> {
    await delay(2500); // Simulates ZK proof generation

    const key = `${surveyId}:${walletAddress}`;
    if (submittedWallets.has(key)) {
      throw new Error('You have already submitted a response to this survey.');
    }

    const survey = surveys.find(s => s.id === surveyId);
    if (!survey) throw new Error('Survey not found.');
    if (survey.status !== 'active') throw new Error('This survey is no longer accepting responses.');

    submittedWallets.add(key);
    survey.responseCount += 1;

    responses.push({
      surveyId,
      answers,
      submittedAt: new Date().toISOString(),
    });

    return { txHash: '0x' + Math.random().toString(16).slice(2, 66) };
  },

  async hasSubmitted(surveyId: string, walletAddress: string): Promise<boolean> {
    await delay(300);
    return submittedWallets.has(`${surveyId}:${walletAddress}`);
  },

  async getSurveyAnalytics(surveyId: string): Promise<SurveyAnalytics | null> {
    await delay(500);
    const survey = surveys.find(s => s.id === surveyId);
    if (!survey) return null;

    const surveyResponses = responses.filter(r => r.surveyId === surveyId);

    const questionBreakdown = survey.questions.map(q => {
      const distribution: Record<string, number> = {};

      surveyResponses.forEach(r => {
        const answer = r.answers[q.id];
        if (answer !== undefined) {
          const key = String(answer);
          distribution[key] = (distribution[key] || 0) + 1;
        }
      });

      return {
        questionId: q.id,
        questionText: q.text,
        type: q.type,
        distribution,
      };
    });

    return {
      surveyId,
      totalResponses: surveyResponses.length,
      questionBreakdown,
    };
  },

  async getGlobalAnalytics(): Promise<{
    totalSurveys: number;
    totalResponses: number;
    activeSurveys: number;
    closedSurveys: number;
    categoryBreakdown: Record<string, number>;
    responsesByCategory: Record<string, number>;
  }> {
    await delay(500);

    const categoryBreakdown: Record<string, number> = {};
    const responsesByCategory: Record<string, number> = {};
    let totalResponses = 0;
    let activeSurveys = 0;
    let closedSurveys = 0;

    surveys.forEach(s => {
      categoryBreakdown[s.category] = (categoryBreakdown[s.category] || 0) + 1;
      responsesByCategory[s.category] = (responsesByCategory[s.category] || 0) + s.responseCount;
      totalResponses += s.responseCount;
      if (s.status === 'active') activeSurveys++;
      if (s.status === 'closed') closedSurveys++;
    });

    return {
      totalSurveys: surveys.length,
      totalResponses,
      activeSurveys,
      closedSurveys,
      categoryBreakdown,
      responsesByCategory,
    };
  },
};
