// use server'
'use server';

/**
 * @fileOverview Provides AI-powered suggestions for CV content based on the chosen career path.
 *
 * - getCvSuggestions - A function that takes a career path as input and returns suggested points for a CV.
 * - CvSuggestionsInput - The input type for the getCvSuggestions function.
 * - CvSuggestionsOutput - The return type for the getCvSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CvSuggestionsInputSchema = z.object({
  careerPath: z
    .string()
    .describe('The desired career path for which to generate CV suggestions.'),
});
export type CvSuggestionsInput = z.infer<typeof CvSuggestionsInputSchema>;

const CvSuggestionsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe(
      'A list of suggested points to include in the CV, tailored to the specified career path.'
    ),
});
export type CvSuggestionsOutput = z.infer<typeof CvSuggestionsOutputSchema>;

export async function getCvSuggestions(input: CvSuggestionsInput): Promise<CvSuggestionsOutput> {
  return cvSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cvSuggestionsPrompt',
  input: {schema: CvSuggestionsInputSchema},
  output: {schema: CvSuggestionsOutputSchema},
  prompt: `You are an expert career advisor, specializing in helping students craft effective CVs.

  Based on the student's desired career path, suggest relevant points they should include in their CV to make it more appealing to potential employers.
  Focus on skills, experiences, and projects that align with the career path. Provide the output as a list of bullet points.

  Career Path: {{{careerPath}}}`,
});

const cvSuggestionsFlow = ai.defineFlow(
  {
    name: 'cvSuggestionsFlow',
    inputSchema: CvSuggestionsInputSchema,
    outputSchema: CvSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
