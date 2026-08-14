import Link from "next/link";
import { NoteInput } from "@/components/note-input";
import { ThemeToggle } from "@/components/theme-toggle";

export default function NewDeckPage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-6 pt-12 pb-24 sm:pt-20">
      <div className="mb-10 flex items-start justify-between gap-6 sm:mb-14">
        <div>
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            ← Back
          </Link>
          <h1 className="font-display mt-3 text-[2.5rem] leading-[1.05] tracking-[-0.02em] text-foreground sm:text-[3rem]">
            New deck
          </h1>
        </div>
        <div className="pt-1">
          <ThemeToggle />
        </div>
      </div>
      <NoteInput />
    </main>
  );
}
