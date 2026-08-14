"use client";

import { useState } from "react";
import type { Flashcard } from "@/lib/types";
import { cn } from "@/lib/utils";

export function FlashcardView({
  card,
  index,
  total,
}: {
  card: Flashcard;
  index: number;
  total: number;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      className="w-full cursor-pointer [perspective:1400px]"
      aria-label="Flip card"
    >
      <div
        className={cn(
          "relative h-72 w-full transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] [transform-style:preserve-3d] sm:h-80",
          flipped && "[transform:rotateY(180deg)]",
        )}
      >
        <div className="bg-card border-border absolute inset-0 flex flex-col rounded-2xl border p-8 text-left [backface-visibility:hidden] sm:p-10">
          <span className="catalog-num text-xs">
            N°{String(index + 1).padStart(2, "0")}
            <span className="text-muted-foreground"> / {String(total).padStart(2, "0")}</span>
          </span>
          <span className="font-display flex flex-1 items-center text-[1.5rem] leading-[1.25] tracking-[-0.01em] text-foreground sm:text-[1.75rem]">
            {card.front}
          </span>
        </div>
        <div className="bg-card border-border absolute inset-0 flex flex-col rounded-2xl border p-8 text-left [backface-visibility:hidden] [transform:rotateY(180deg)] sm:p-10">
          <span className="kicker text-xs">Answer</span>
          <span className="flex flex-1 items-center text-[1.0625rem] leading-relaxed text-foreground">
            {card.back}
          </span>
        </div>
      </div>
      <p className="kicker mt-3 text-center">Tap to reveal</p>
    </button>
  );
}
