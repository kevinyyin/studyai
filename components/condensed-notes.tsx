export function CondensedNotes({ summary }: { summary?: string }) {
  if (!summary) return null;

  return (
    <div className="border-border mt-14 border-t pt-6">
      <p className="kicker mb-4">Condensed notes</p>
      <p className="text-foreground whitespace-pre-line text-[0.9375rem] leading-relaxed">
        {summary}
      </p>
    </div>
  );
}
