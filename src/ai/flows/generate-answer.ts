// This file is machine-generated - edit with care!
'use server';
/**
 * @fileOverview A chatbot that generates answers to user questions.
 *
 * - generateAnswer - A function that generates answers based on user questions.
 * - GenerateAnswerInput - The input type for the generateAnswer function.
 * - GenerateAnswerOutput - The return type for the generateAnswer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAnswerInputSchema = z.object({
  question: z.string().describe('The question to answer.'),
  topic: z.string().describe('The topic of the chatbot.'),
  chatHistory: z.string().describe('The chat history of the conversation.'),
  imageDataUri: z
    .string()
    .optional()
    .describe(
      "An optional image file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateAnswerInput = z.infer<typeof GenerateAnswerInputSchema>;

const GenerateAnswerOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
});
export type GenerateAnswerOutput = z.infer<typeof GenerateAnswerOutputSchema>;

export async function generateAnswer(input: GenerateAnswerInput): Promise<GenerateAnswerOutput> {
  return generateAnswerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAnswerPrompt',
  input: {schema: GenerateAnswerInputSchema},
  output: {schema: GenerateAnswerOutputSchema},
  prompt: `Eres un chatbot que responde preguntas sobre {{topic}}. Responde siempre en español.

  Aquí está el historial del chat:
  {{chatHistory}}

  {{#if imageDataUri}}
  Analiza la siguiente imagen y responde la pregunta.
  Image: {{media url=imageDataUri}}
  {{/if}}

  Responde la siguiente pregunta:
  {{question}}`,
});

const generateAnswerFlow = ai.defineFlow(
  {
    name: 'generateAnswerFlow',
    inputSchema: GenerateAnswerInputSchema,
    outputSchema: GenerateAnswerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
