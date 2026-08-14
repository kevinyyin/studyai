"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { saveDeck } from "@/lib/storage";
import type { Deck, Flashcard } from "@/lib/types";

const ACCEPTED_TYPES = ".pdf,.txt,.png,.jpg,.jpeg,.webp";

export function NoteInput() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function addFiles(newFiles: FileList | null) {
    if (!newFiles) return;
    setFiles((prev) => [...prev, ...Array.from(newFiles)]);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!notes.trim() && files.length === 0) {
      setError("Paste some notes or upload a file first.");
      return;
    }

    setIsGenerating(true);
    try {
      const formData = new FormData();
      formData.set("notes", notes);
      for (const file of files) formData.append("files", file);

      const res = await fetch("/api/generate-flashcards", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to generate flashcards.");
      }

      const cards: Flashcard[] = data.cards.map((card: { front: string; back: string }) => ({
        id: crypto.randomUUID(),
        front: card.front,
        back: card.back,
      }));

      const deck: Deck = {
        id: crypto.randomUUID(),
        title: title.trim() || notes.slice(0, 40).trim() || files[0]?.name || "Untitled deck",
        createdAt: new Date().toISOString(),
        cards,
        summary: typeof data.summary === "string" ? data.summary : undefined,
      };

      saveDeck(deck);
      router.push(`/decks/${deck.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      <div className="flex flex-col gap-2.5">
        <Label htmlFor="title">Deck title — optional</Label>
        <Input
          id="title"
          placeholder="e.g. Cell Biology Ch. 4"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2.5">
        <Label htmlFor="notes">Your notes</Label>
        <Textarea
          id="notes"
          placeholder="Paste or type your notes here…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={9}
          className="text-[0.9375rem] leading-relaxed"
        />
      </div>

      <div className="flex flex-col gap-2.5">
        <Label>Files — PDF, image, or .txt</Label>
        <div
          className="border-border flex items-center justify-between gap-3 border border-dashed py-4 pl-0.5"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            addFiles(e.dataTransfer.files);
          }}
        >
          <p className="text-muted-foreground pl-4 text-sm">Drag files here</p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-brand mr-4 shrink-0 cursor-pointer text-sm underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current"
          >
            Choose files
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept={ACCEPTED_TYPES}
            className="hidden"
            onChange={(e) => addFiles(e.target.files)}
          />
        </div>
        {files.length > 0 && (
          <ul className="mt-1 flex flex-col gap-1.5">
            {files.map((file, i) => (
              <li
                key={`${file.name}-${i}`}
                className="text-muted-foreground flex items-center justify-between gap-3 font-mono text-xs"
              >
                <span className="truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeFile(i)}
                  className="hover:text-foreground shrink-0 transition-colors"
                  aria-label={`Remove ${file.name}`}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && <p className="text-destructive text-sm">{error}</p>}

      <div>
        <Button type="submit" disabled={isGenerating} size="lg">
          {isGenerating ? "Generating flashcards…" : "Generate flashcards"}
        </Button>
      </div>
    </form>
  );
}
