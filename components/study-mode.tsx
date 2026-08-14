"use client";

import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, ShuffleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FlashcardView } from "@/components/flashcard-view";
import type { Flashcard } from "@/lib/types";

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function StudyMode({ cards }: { cards: Flashcard[] }) {
  const [prevCards, setPrevCards] = useState(cards);
  const [order, setOrder] = useState<Flashcard[]>(cards);
  const [index, setIndex] = useState(0);

  if (cards !== prevCards) {
    setPrevCards(cards);
    setOrder(cards);
    setIndex(0);
  }

  if (cards.length === 0) {
    return (
      <p className="text-muted-foreground border-border border-t py-12 text-center text-sm">
        This deck has no cards yet.
      </p>
    );
  }

  const current = order[Math.min(index, order.length - 1)];

  function goNext() {
    setIndex((i) => (i + 1) % order.length);
  }

  function goPrev() {
    setIndex((i) => (i - 1 + order.length) % order.length);
  }

  function shuffle() {
    setOrder(shuffleArray(cards));
    setIndex(0);
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <p className="kicker">Study</p>
        <Button variant="ghost" size="sm" onClick={shuffle}>
          <ShuffleIcon data-icon="inline-start" />
          Shuffle
        </Button>
      </div>

      <FlashcardView key={current.id} card={current} index={index} total={order.length} />

      <div className="flex items-center justify-center gap-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={goPrev}
          aria-label="Previous card"
        >
          <ChevronLeftIcon />
        </Button>
        <span className="text-muted-foreground w-16 text-center font-mono text-xs tabular-nums">
          {String(index + 1).padStart(2, "0")} / {String(order.length).padStart(2, "0")}
        </span>
        <Button variant="ghost" size="icon" onClick={goNext} aria-label="Next card">
          <ChevronRightIcon />
        </Button>
      </div>
    </div>
  );
}
