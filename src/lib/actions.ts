'use server';

import { getCvSuggestions } from '@/ai/flows/ai-cv-suggestions';
import { z } from 'zod';

const suggestionSchema = z.object({
  careerPath: z.string().min(3, 'Please enter a career path.'),
});

interface SuggestionState {
  suggestions?: string;
  error?: string;
}

export async function generateSuggestions(
  prevState: SuggestionState,
  formData: FormData
): Promise<SuggestionState> {
  const validatedFields = suggestionSchema.safeParse({
    careerPath: formData.get('careerPath'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.careerPath?.[0],
    };
  }

  try {
    const result = await getCvSuggestions({ careerPath: validatedFields.data.careerPath });
    if (!result?.suggestions) {
       return { error: 'Could not generate suggestions. Please try again.' };
    }
    return { suggestions: result.suggestions };
  } catch (error) {
    console.error(error);
    return { error: 'An unexpected error occurred. Please try again later.' };
  }
}
