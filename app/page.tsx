"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DeckList } from "@/components/deck-list";
import { getDecks } from "@/lib/storage";
import type { Deck } from "@/lib/types";

export default function Home() {
  const [decks, setDecks] = useState<Deck[] | null>(null);

  useEffect(() => {
    // localStorage isn't available during SSR, so decks are hydrated after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDecks(getDecks());
  }, []);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">StudyAI</h1>
          <p className="text-muted-foreground text-sm">
            Turn your notes into flashcards.
          </p>
        </div>
        <Button render={<Link href="/decks/new" />} nativeButton={false}>
          New deck
        </Button>
      </div>

      {decks && <DeckList decks={decks} onChange={() => setDecks(getDecks())} />}
    </main>
  );
}
