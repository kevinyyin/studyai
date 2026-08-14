"use client";

import { useState } from "react";
import { PenLineIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import type { Flashcard } from "@/lib/types";

function EditCardDialog({
  card,
  onSave,
}: {
  card: Flashcard;
  onSave: (front: string, back: string) => void;
}) {
  const [front, setFront] = useState(card.front);
  const [back, setBack] = useState(card.back);
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) {
          setFront(card.front);
          setBack(card.back);
        }
        setOpen(next);
      }}
    >
      <DialogTrigger render={<Button variant="ghost" size="icon-sm" />}>
        <PenLineIcon />
        <span className="sr-only">Edit card</span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit card</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2.5">
            <Label htmlFor={`front-${card.id}`}>Front</Label>
            <Textarea
              id={`front-${card.id}`}
              value={front}
              onChange={(e) => setFront(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex flex-col gap-2.5">
            <Label htmlFor={`back-${card.id}`}>Back</Label>
            <Textarea
              id={`back-${card.id}`}
              value={back}
              onChange={(e) => setBack(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              onSave(front, back);
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

export function DeckCardsEditor({
  cards,
  onUpdateCard,
  onDeleteCard,
}: {
  cards: Flashcard[];
  onUpdateCard: (id: string, front: string, back: string) => void;
  onDeleteCard: (id: string) => void;
}) {
  if (cards.length === 0) return null;

  return (
    <div className="mt-14 flex flex-col">
      <p className="kicker border-border border-t pt-6 pb-4">
        All cards — {cards.length}
      </p>
      {cards.map((card, i) => (
        <div
          key={card.id}
          className="border-border group flex items-start gap-4 border-b py-4 sm:gap-6"
        >
          <span className="kicker w-6 shrink-0 pt-0.5 text-right tabular-nums">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0 flex-1 text-sm">
            <p className="text-foreground">{card.front}</p>
            <p className="text-muted-foreground mt-1">{card.back}</p>
          </div>
          <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
            <EditCardDialog
              card={card}
              onSave={(front, back) => onUpdateCard(card.id, front, back)}
            />
            <AlertDialog>
              <AlertDialogTrigger render={<Button variant="ghost" size="icon-sm" />}>
                <Trash2Icon />
                <span className="sr-only">Delete card</span>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this card?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This can&apos;t be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDeleteCard(card.id)}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      ))}
    </div>
  );
}
