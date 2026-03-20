import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <main className="max-w-lg text-center">
        <h1
          className="text-4xl sm:text-5xl font-medium leading-[0.9] text-foreground mb-8"
          style={{ fontFamily: "var(--font-display), Georgia, serif" }}
        >
          DecisionDesk.org
        </h1>

        <p className="text-sm leading-relaxed text-muted">
          We grade the speed of election race calls. We track{" "}
          <strong className="text-foreground">VoteHub</strong>,{" "}
          <strong className="text-foreground">Decision Desk HQ</strong>, and the{" "}
          <strong className="text-foreground">Associated Press</strong> across
          487 races — who calls it first, how fast, and how that changes over
          time. Data updates nightly.
        </p>

        <div className="mt-8 flex items-center justify-center gap-6 text-xs">
          <Link
            href="/grades"
            className="text-muted hover:text-foreground transition-colors underline underline-offset-4"
          >
            Grades
          </Link>
          <Link
            href="/races"
            className="text-muted hover:text-foreground transition-colors underline underline-offset-4"
          >
            Races
          </Link>
          <Link
            href="/about"
            className="text-muted hover:text-foreground transition-colors underline underline-offset-4"
          >
            About
          </Link>
          <Link
            href="/methodology"
            className="text-muted hover:text-foreground transition-colors underline underline-offset-4"
          >
            Methodology
          </Link>
        </div>

        <p className="mt-16 text-xs text-muted/50">
          &copy; 2026 DecisionDesk
        </p>
      </main>
    </div>
  );
}
