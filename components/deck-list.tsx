"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        Rename
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

export function DeckList({ decks, onChange }: { decks: Deck[]; onChange: () => void }) {
  if (decks.length === 0) {
    return (
      <p className="text-muted-foreground text-center text-sm">
        No decks yet. Create one to get started.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {decks.map((deck) => (
        <Card key={deck.id}>
          <CardHeader>
            <CardTitle className="text-base">{deck.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              {deck.cards.length} card{deck.cards.length === 1 ? "" : "s"}
            </p>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2">
            <Button
              render={<Link href={`/decks/${deck.id}`} />}
              nativeButton={false}
              size="sm"
            >
              Study
            </Button>
            <RenameDeckDialog deck={deck} onRenamed={onChange} />
            <AlertDialog>
              <AlertDialogTrigger render={<Button variant="outline" size="sm" />}>
                Delete
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
                      onChange();
                    }}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
