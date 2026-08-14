import { google } from "@ai-sdk/google";
import { generateText, NoObjectGeneratedError, Output } from "ai";
import { NextResponse } from "next/server";
import { z } from "zod";

export const maxDuration = 60;

const flashcardsSchema = z.object({
  cards: z
    .array(
      z.object({
        front: z.string().describe("The question or prompt side of the flashcard"),
        back: z.string().describe("The answer side of the flashcard"),
      }),
    )
    .describe("A list of flashcards covering the key concepts in the notes"),
});

export async function POST(request: Request) {
  const formData = await request.formData();
  const notes = (formData.get("notes") as string | null)?.trim() ?? "";
  const files = formData.getAll("files").filter((f): f is File => f instanceof File);

  if (!notes && files.length === 0) {
    return NextResponse.json(
      { error: "Provide some notes text or at least one file." },
      { status: 400 },
    );
  }

  const content: Array<
    | { type: "text"; text: string }
    | { type: "file"; data: Uint8Array; mediaType: string }
  > = [
    {
      type: "text",
      text:
        "You are a study assistant. Read the following notes (and any attached files) and generate " +
        "a set of high-quality flashcards covering the key concepts, definitions, and facts. " +
        "Keep the front of each card short (a question or term) and the back concise but complete. " +
        "Generate as many cards as the material warrants, typically 5-20." +
        (notes ? `\n\nNotes:\n${notes}` : ""),
    },
  ];

  for (const file of files) {
    const buffer = new Uint8Array(await file.arrayBuffer());
    content.push({
      type: "file",
      data: buffer,
      mediaType: file.type || "application/octet-stream",
    });
  }

  try {
    const { output } = await generateText({
      model: google("gemini-flash-latest"),
      output: Output.object({ schema: flashcardsSchema }),
      messages: [{ role: "user", content }],
    });

    return NextResponse.json(output);
  } catch (error) {
    if (NoObjectGeneratedError.isInstance(error)) {
      return NextResponse.json(
        { error: "The AI couldn't generate flashcards from that input. Try adding more detail." },
        { status: 422 },
      );
    }
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong generating flashcards." },
      { status: 500 },
    );
  }
}
