"use client";

import { useState } from "react";
import Link from "next/link";
import { PenLineIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import type { Deck } from "@/lib/types";
import { deleteDeck, updateDeck } from "@/lib/storage";

const dateFormatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

function RenameDeckDialog({ deck, onRenamed }: { deck: Deck; onRenamed: () => void }) {
  const [title, setTitle] = useState(deck.title);
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) setTitle(deck.title);
        setOpen(next);
      }}
    >
      <DialogTrigger render={<Button variant="ghost" size="icon-sm" />}>
        <PenLineIcon />
        <span className="sr-only">Rename &quot;{deck.title}&quot;</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename deck</DialogTitle>
        </DialogHeader>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        <DialogFooter>
          <Button
            onClick={() => {
              const trimmed = title.trim();
              if (trimmed) {
                updateDeck(deck.id, (d) => ({ ...d, title: trimmed }));
                onRenamed();
              }
              setOpen(false);
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteDeckAction({ deck, onDeleted }: { deck: Deck; onDeleted: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="ghost" size="icon-sm" />}>
        <Trash2Icon />
        <span className="sr-only">Delete &quot;{deck.title}&quot;</span>
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
          <AlertDialogAction
            onClick={() => {
              deleteDeck(deck.id);
              onDeleted();
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function DeckList({ decks, onChange }: { decks: Deck[]; onChange: () => void }) {
  if (decks.length === 0) {
    return (
      <div className="border-border border-t py-16 text-center">
        <p className="text-muted-foreground text-sm">
          Your catalog is empty. Create a deck to begin.
        </p>
      </div>
    );
  }

  return (
    <div className="border-border border-t">
      {decks.map((deck, index) => (
        <div
          key={deck.id}
          className="border-border group flex items-center gap-4 border-b py-4 sm:gap-6"
        >
          <span className="kicker w-6 shrink-0 text-right tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>

          <Link href={`/decks/${deck.id}`} className="min-w-0 flex-1 py-1">
            <p className="font-display group-hover:text-brand truncate text-[1.0625rem] tracking-tight text-foreground transition-colors">
              {deck.title}
            </p>
            <p className="text-muted-foreground mt-0.5 font-mono text-xs tabular-nums">
              {deck.cards.length} {deck.cards.length === 1 ? "card" : "cards"} ·{" "}
              {dateFormatter.format(new Date(deck.createdAt))}
            </p>
          </Link>

          <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
            <RenameDeckDialog deck={deck} onRenamed={onChange} />
            <DeleteDeckAction deck={deck} onDeleted={onChange} />
          </div>
        </div>
      ))}
    </div>
  );
}
