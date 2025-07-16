import { config } from 'dotenv';
config();

import '@/ai/flows/generate-answer.ts';
import '@/ai/flows/summarize-conversation.ts';
import '@/ai/flows/improve-prompt.ts';