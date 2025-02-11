import { NextResponse } from "next/server";
import OpenAI from 'openai';

export async function POST(request: Request) {
  const { parent1, parent2, firstLetter, culturalBackground, gender } = await request.json();

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  let prompt = `Generate 10 unique baby names that capture a similar style and cultural feeling to ${parent1} and ${parent2}, but aren't directly similar sounding. The names should feel like they belong to the same family without being variations of the parents' names.`;

  if (firstLetter) {
    prompt += ` All names should start with the letter "${firstLetter}".`;
  }

  if (culturalBackground) {
    prompt += ` The names should reflect ${culturalBackground} cultural or national heritage.`;
  }

  if (gender) {
    switch (gender) {
      case 'boy':
        prompt += ` Please suggest only traditionally masculine names.`;
        break;
      case 'girl':
        prompt += ` Please suggest only traditionally feminine names.`;
        break;
      case 'neutral':
        prompt += ` Please suggest only gender-neutral names.`;
        break;
    }
  }

  prompt += " Return only the names, one per line.";

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
  });

  const names = completion.choices[0].message.content?.split('\n')
    .filter(Boolean)
    .map(name => name.trim());

  return NextResponse.json({
    names: names?.map(name => name.replace(/^[0-9]+\.\s*/, ''))
  });
} 