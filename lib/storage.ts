import type { Deck } from "@/lib/types";

const STORAGE_KEY = "studyai:decks";

function readAll(): Deck[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Deck[]) : [];
  } catch {
    return [];
  }
}

function writeAll(decks: Deck[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(decks));
}

export function getDecks(): Deck[] {
  return readAll().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getDeck(id: string): Deck | undefined {
  return readAll().find((deck) => deck.id === id);
}

export function saveDeck(deck: Deck) {
  const decks = readAll();
  decks.push(deck);
  writeAll(decks);
}

export function updateDeck(id: string, updater: (deck: Deck) => Deck) {
  const decks = readAll();
  const index = decks.findIndex((deck) => deck.id === id);
  if (index === -1) return;
  decks[index] = updater(decks[index]);
  writeAll(decks);
}

export function deleteDeck(id: string) {
  writeAll(readAll().filter((deck) => deck.id !== id));
}
