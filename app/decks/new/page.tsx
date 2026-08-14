import Link from "next/link";
import { NoteInput } from "@/components/note-input";

export default function NewDeckPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <Link href="/" className="text-muted-foreground text-sm hover:underline">
          ← Back
        </Link>
      </div>
      <NoteInput />
    </main>
  );
}
