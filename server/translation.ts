import OpenAI from 'openai';
import { extractJSON } from './utils';

const getPrompt = (
  locale: string,
  document: string
) => `The following JSON represents a document in Sanity, written in en-US.
Translate all of the text content (i.e. the values for 'text' and 'title') into ${locale}, so that the translated document is valid JSON with the same structure (and keys) as the original.
Return just the JSON string in plain text - no formatting, no introductory message or explanation.\n${document}`;

// Uses process.env.OPENAI_API_KEY
const openai = new OpenAI();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const translate = async (document: any, locale: string) => {
  console.log(`Translating ${document.slug.current} to ${locale}...`);

  const prompt = getPrompt(locale, JSON.stringify(document));

  const response = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'gpt-3.5-turbo',
  });

  return extractJSON(response.choices[0].message.content);
};
