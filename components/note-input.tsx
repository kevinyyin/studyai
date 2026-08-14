"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
    <Card>
      <CardHeader>
        <CardTitle>New deck</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">Deck title (optional)</Label>
            <Input
              id="title"
              placeholder="e.g. Cell Biology Ch. 4"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="notes">Paste your notes</Label>
            <Textarea
              id="notes"
              placeholder="Paste or type your notes here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={10}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Or upload files (PDF, image, .txt)</Label>
            <div
              className="border-border flex flex-col items-center justify-center gap-2 rounded-md border border-dashed p-6 text-center"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                addFiles(e.dataTransfer.files);
              }}
            >
              <p className="text-muted-foreground text-sm">
                Drag files here, or
              </p>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                Choose files
              </Button>
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
              <div className="flex flex-wrap gap-2 pt-1">
                {files.map((file, i) => (
                  <Badge key={`${file.name}-${i}`} variant="secondary" className="gap-1">
                    {file.name}
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="ml-1 opacity-70 hover:opacity-100"
                      aria-label={`Remove ${file.name}`}
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {error && <p className="text-destructive text-sm">{error}</p>}

          <Button type="submit" disabled={isGenerating}>
            {isGenerating ? "Generating flashcards..." : "Generate flashcards"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
