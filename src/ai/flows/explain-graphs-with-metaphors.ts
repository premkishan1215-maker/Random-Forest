/**
 * @fileOverview A flow to generate one-line metaphors and hover tooltips for graphs.
 *
 * - explainGraphWithMetaphor - A function that handles the graph explanation process.
 * - ExplainGraphWithMetaphorInput - The input type for the explainGraphWithMetaphor function.
 * - ExplainGraphWithMetaphorOutput - The return type for the explainGraphWithMetaphor function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainGraphWithMetaphorInputSchema = z.object({
  graphType: z.string().describe('The type of the graph (e.g., scatter plot, histogram, pie chart).'),
  dataset: z.string().describe('A description of the dataset being visualized in the graph.'),
  algorithmConcept: z.string().describe('The specific machine learning algorithm concept the graph is illustrating.'),
  audience: z.enum(['Farmer', 'Doctor', 'Student']).describe('The target audience for the explanation.'),
});
export type ExplainGraphWithMetaphorInput = z.infer<typeof ExplainGraphWithMetaphorInputSchema>;

const ExplainGraphWithMetaphorOutputSchema = z.object({
  metaphor: z.string().describe('A one-line metaphor explaining the graph in simple terms.'),
  tooltip: z.string().describe('A concise tooltip providing additional context for the graph.'),
});
export type ExplainGraphWithMetaphorOutput = z.infer<typeof ExplainGraphWithMetaphorOutputSchema>;

export async function explainGraphWithMetaphor(input: ExplainGraphWithMetaphorInput): Promise<ExplainGraphWithMetaphorOutput> {
  return explainGraphWithMetaphorFlow(input);
}

const explainGraphPrompt = ai.definePrompt({
  name: 'explainGraphPrompt',
  input: {schema: ExplainGraphWithMetaphorInputSchema},
  output: {schema: ExplainGraphWithMetaphorOutputSchema},
  prompt: `You are an AI assistant that explains graphs using metaphors and tooltips tailored to a specific audience.

  Given the following information, generate a one-line metaphor and a concise tooltip to explain the graph:

  Graph Type: {{{graphType}}}
  Dataset: {{{dataset}}}
  Algorithm Concept: {{{algorithmConcept}}}
  Audience: {{{audience}}}

  Metaphor: A one-line metaphor that relates the graph to the audience's experience.
  Tooltip: A concise explanation providing additional context for the graph. The tooltip should be less than 20 words.

  Ensure the metaphor and tooltip are appropriate for the specified audience.`,
});

const explainGraphWithMetaphorFlow = ai.defineFlow(
  {
    name: 'explainGraphWithMetaphorFlow',
    inputSchema: ExplainGraphWithMetaphorInputSchema,
    outputSchema: ExplainGraphWithMetaphorOutputSchema,
  },
  async input => {
    const {output} = await explainGraphPrompt(input);
    return output!;
  }
);

