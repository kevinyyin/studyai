"use client";

import { useState } from "react";
import type { Flashcard } from "@/lib/types";
import { cn } from "@/lib/utils";

export function FlashcardView({ card }: { card: Flashcard }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      className="[perspective:1200px] w-full"
      aria-label="Flip card"
    >
      <div
        className={cn(
          "relative h-64 w-full transition-transform duration-500 [transform-style:preserve-3d]",
          flipped && "[transform:rotateY(180deg)]",
        )}
      >
        <div className="bg-card text-card-foreground border-border absolute inset-0 flex items-center justify-center rounded-lg border p-8 text-center text-lg font-medium [backface-visibility:hidden]">
          {card.front}
        </div>
        <div className="bg-card text-card-foreground border-border absolute inset-0 flex items-center justify-center rounded-lg border p-8 text-center text-lg [backface-visibility:hidden] [transform:rotateY(180deg)]">
          {card.back}
        </div>
      </div>
      <p className="text-muted-foreground mt-2 text-center text-xs">
        Click the card to flip
      </p>
    </button>
  );
}
