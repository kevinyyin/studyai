export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export interface Deck {
  id: string;
  title: string;
  createdAt: string;
  cards: Flashcard[];
}
