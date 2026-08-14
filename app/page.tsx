"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeckList } from "@/components/deck-list";
import { ThemeToggle } from "@/components/theme-toggle";
import { getDecks } from "@/lib/storage";
import type { Deck } from "@/lib/types";

export default function Home() {
  const [decks, setDecks] = useState<Deck[] | null>(null);

  useEffect(() => {
    // localStorage isn't available during SSR, so decks are hydrated after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDecks(getDecks());
  }, []);

  const cardTotal = decks?.reduce((sum, d) => sum + d.cards.length, 0) ?? 0;

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 pt-12 pb-24 sm:pt-20">
      <div className="mb-10 flex items-start justify-between gap-6 sm:mb-14">
        <div>
          <p className="kicker mb-3">StudyAI</p>
          <h1 className="font-display text-[2.5rem] leading-[1.05] tracking-[-0.02em] text-foreground sm:text-[3rem]">
            Your decks
          </h1>
          {decks && decks.length > 0 && (
            <p className="text-muted-foreground mt-2 font-mono text-xs tabular-nums">
              {decks.length} {decks.length === 1 ? "deck" : "decks"} · {cardTotal}{" "}
              {cardTotal === 1 ? "card" : "cards"}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 pt-1">
          <ThemeToggle />
          <Button render={<Link href="/decks/new" />} nativeButton={false}>
            <PlusIcon data-icon="inline-start" />
            New deck
          </Button>
        </div>
      </div>

      {decks && <DeckList decks={decks} onChange={() => setDecks(getDecks())} />}
    </main>
  );
}
