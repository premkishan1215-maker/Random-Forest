
'use server';

import { explainGraphWithMetaphor, type ExplainGraphWithMetaphorInput } from '@/ai/flows/explain-graphs-with-metaphors';

export async function getGraphExplanation(input: ExplainGraphWithMetaphorInput) {
  try {
    const result = await explainGraphWithMetaphor(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error getting graph explanation:', error);
    return { success: false, error: 'Failed to generate explanation.' };
  }
}
