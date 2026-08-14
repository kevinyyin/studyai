"use client";

import { useState } from "react";
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
      <p className="text-muted-foreground text-center text-sm">
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
    <div className="flex flex-col gap-4">
      <FlashcardView key={current.id} card={current} />
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={goPrev}>
          Previous
        </Button>
        <span className="text-muted-foreground text-sm">
          {index + 1} / {order.length}
        </span>
        <Button variant="outline" onClick={goNext}>
          Next
        </Button>
      </div>
      <Button variant="secondary" onClick={shuffle}>
        Shuffle
      </Button>
    </div>
  );
}
