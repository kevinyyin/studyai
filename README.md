# StudyAI

A web app that turns your notes into a flashcard deck and a condensed summary.

## The problem

Writing flashcards by hand from a page of notes or a textbook chapter is slow.

## What it does

- Paste notes, upload files (PDF, PNG, JPG, WebP or .txt), or both.
- One call to Google's Gemini model returns a set of flashcards and a condensed rewrite of the notes in a few short paragraphs. The prompt asks for roughly 5 to 20 cards, depending on how much material there is.
- Study a deck by flipping cards, stepping forward and back, or shuffling.
- Edit or delete individual cards, and rename or delete whole decks.
- Light and dark themes.

## How it works

1. `components/note-input.tsx` posts the notes and files as `FormData` to `app/api/generate-flashcards/route.ts`, the only API route.
2. The route sends the text and files to `gemini-flash-latest` through the Vercel AI SDK (`generateText` with `Output.object()` and a Zod schema). The response comes back as validated JSON: `{ summary, cards: [{ front, back }] }`. If the model can't produce an object that matches the schema, the route returns a 422 asking for more detail.
3. The browser wraps the result in a `Deck`, saves it to `localStorage` through `lib/storage.ts`, and opens `/decks/[id]`.

There is no database and no login. Decks live in the browser that created them.

| Route | Page |
| --- | --- |
| `/` | Deck list |
| `/decks/new` | Notes and files in, flashcards out |
| `/decks/[id]` | Study mode, condensed notes, card editor |

## Tech stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, shadcn/ui components built on Base UI, the Vercel AI SDK with the Google provider, Zod, and next-themes.

## Setup

You need Node.js 20 or newer and a Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey).

```bash
npm install
echo "GOOGLE_GENERATIVE_AI_API_KEY=your-key" > .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Without the key, generating a deck shows an error, but browsing and studying saved decks still works.

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | Type-check |

## Status

A small working app with no automated tests. Decks are stored only in `localStorage`, so they don't sync between devices, and clearing site data deletes them. The model id is hardcoded in the API route. If generation starts failing with a model-not-found error, update it there.
