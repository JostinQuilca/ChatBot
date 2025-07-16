// This file is machine-generated - edit at your own risk.

'use server';

/**
 * @fileOverview Flow for improving user prompts to get better chatbot responses.
 *
 * - improvePrompt - Function to improve a user-provided prompt.
 * - ImprovePromptInput - Input type for the improvePrompt function.
 * - ImprovePromptOutput - Output type for the improvePrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImprovePromptInputSchema = z.object({
  prompt: z.string().describe('The original user prompt to be improved.'),
});
export type ImprovePromptInput = z.infer<typeof ImprovePromptInputSchema>;

const ImprovePromptOutputSchema = z.object({
  improvedPrompt: z.string().describe('The improved prompt for better chatbot responses.'),
});
export type ImprovePromptOutput = z.infer<typeof ImprovePromptOutputSchema>;

export async function improvePrompt(input: ImprovePromptInput): Promise<ImprovePromptOutput> {
  return improvePromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improvePromptPrompt',
  input: {schema: ImprovePromptInputSchema},
  output: {schema: ImprovePromptOutputSchema},
  prompt: `You are an AI prompt engineer. Your job is to take a user prompt and improve it so that it will get a better response from a chatbot.

Original Prompt: {{{prompt}}}

Improved Prompt: `,
});

const improvePromptFlow = ai.defineFlow(
  {
    name: 'improvePromptFlow',
    inputSchema: ImprovePromptInputSchema,
    outputSchema: ImprovePromptOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
