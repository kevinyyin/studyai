"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { StudyMode } from "@/components/study-mode";
import { DeckCardsEditor } from "@/components/deck-cards-editor";
import { ThemeToggle } from "@/components/theme-toggle";
import { deleteDeck, getDeck, updateDeck } from "@/lib/storage";
import type { Deck } from "@/lib/types";

export default function DeckPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [deck, setDeck] = useState<Deck | null | undefined>(undefined);

  useEffect(() => {
    // localStorage isn't available during SSR, so the deck is hydrated after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDeck(getDeck(id) ?? null);
  }, [id]);

  if (deck === undefined) return null;

  if (deck === null) {
    return (
      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-muted-foreground text-sm">Deck not found.</p>
        <Link href="/" className="text-sm hover:underline">
          ← Back to decks
        </Link>
      </main>
    );
  }

  function refresh() {
    setDeck(getDeck(id) ?? null);
  }

  function handleUpdateCard(cardId: string, front: string, back: string) {
    updateDeck(id, (d) => ({
      ...d,
      cards: d.cards.map((c) => (c.id === cardId ? { ...c, front, back } : c)),
    }));
    refresh();
  }

  function handleDeleteCard(cardId: string) {
    updateDeck(id, (d) => ({
      ...d,
      cards: d.cards.filter((c) => c.id !== cardId),
    }));
    refresh();
  }

  function handleDeleteDeck() {
    deleteDeck(id);
    router.push("/");
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 pt-12 pb-24 sm:pt-20">
      <div className="mb-10 flex items-start justify-between gap-6 sm:mb-14">
        <div className="min-w-0">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            ← Back
          </Link>
          <h1 className="font-display mt-3 text-[2.25rem] leading-[1.08] tracking-[-0.02em] text-foreground break-words sm:text-[2.75rem]">
            {deck.title}
          </h1>
        </div>
        <div className="flex shrink-0 items-center gap-1 pt-1">
          <ThemeToggle />
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="ghost" size="icon" />}>
              <Trash2Icon />
              <span className="sr-only">Delete deck</span>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete &quot;{deck.title}&quot;?</AlertDialogTitle>
                <AlertDialogDescription>
                  This deletes the deck and all its cards. This can&apos;t be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteDeck}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <StudyMode cards={deck.cards} />

      <DeckCardsEditor
        cards={deck.cards}
        onUpdateCard={handleUpdateCard}
        onDeleteCard={handleDeleteCard}
      />
    </main>
  );
}
