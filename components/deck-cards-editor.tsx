"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        Edit
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit card</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor={`front-${card.id}`}>Front</Label>
            <Textarea
              id={`front-${card.id}`}
              value={front}
              onChange={(e) => setFront(e.target.value)}
              rows={3}
            />
          </div>
          <div className="flex flex-col gap-2">
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
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-medium">All cards ({cards.length})</h2>
      {cards.map((card) => (
        <Card key={card.id}>
          <CardContent className="flex items-start justify-between gap-4 py-4">
            <div className="flex flex-1 flex-col gap-1 text-sm">
              <p className="font-medium">{card.front}</p>
              <p className="text-muted-foreground">{card.back}</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <EditCardDialog
                card={card}
                onSave={(front, back) => onUpdateCard(card.id, front, back)}
              />
              <AlertDialog>
                <AlertDialogTrigger render={<Button variant="outline" size="sm" />}>
                  Delete
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
