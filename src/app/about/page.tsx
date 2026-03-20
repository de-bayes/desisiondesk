import Nav from "@/components/Nav";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Nav active="/about" />

      <main className="flex-1 px-8 max-w-5xl mx-auto w-full">
        <section className="pt-12 pb-10">
          <h1
            className="text-3xl sm:text-4xl font-medium text-foreground mb-3"
            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
          >
            About
          </h1>
        </section>

        <hr className="border-border" />

        <section className="py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
          <h2
            className="text-xl font-medium text-foreground"
            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
          >
            What We Do
          </h2>
          <div className="text-sm leading-relaxed text-muted space-y-4">
            <p>
              DecisionDesk tracks and grades the speed of election race
              calls across the three major decision desks — <strong className="text-foreground">VoteHub</strong>,{" "}
              <strong className="text-foreground">Decision Desk HQ</strong>, and the{" "}
              <strong className="text-foreground">Associated Press</strong>.
            </p>
            <p>
              Every time a political race is called, we record the exact
              timestamp from each desk and compare. We track which
              desk calls each race first and how long the others
              take to follow.
            </p>
          </div>
        </section>

        <hr className="border-border" />

        <section className="py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
          <h2
            className="text-xl font-medium text-foreground"
            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
          >
            Why It Matters
          </h2>
          <div className="text-sm leading-relaxed text-muted space-y-4">
            <p>
              Race calls drive the news cycle. Networks, campaigns, and
              voters all react to who gets called first. But not all
              calls are created equal — calling a safe seat fast is
              table stakes. The real test is competitive and toss-up
              races where the outcome is genuinely uncertain.
            </p>
            <p>
              We weight our grades accordingly, putting the most
              emphasis on the races that matter most.
            </p>
          </div>
        </section>

        <hr className="border-border" />

        <section className="py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
          <h2
            className="text-xl font-medium text-foreground"
            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
          >
            The Desks
          </h2>
          <div className="space-y-6">
            {[
              {
                name: "VoteHub",
                desc: "Election data and race call platform. Known for speed and algorithmic modeling.",
              },
              {
                name: "Decision Desk HQ",
                desc: "Independent election results and race call service. Used by major media outlets.",
              },
              {
                name: "Associated Press",
                desc: "The gold standard in election reporting. Most conservative in calling races, prioritizing certainty.",
              },
            ].map((desk) => (
              <div key={desk.name}>
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  {desk.name}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {desk.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-border" />

        <section className="py-12 grid grid-cols-1 md:grid-cols-2 gap-12">
          <h2
            className="text-xl font-medium text-foreground"
            style={{ fontFamily: "var(--font-display), Georgia, serif" }}
          >
            Data
          </h2>
          <p className="text-sm leading-relaxed text-muted">
            Data is collected and updated nightly. All times are
            measured from poll close to the moment a desk publicly
            announces a race call. Currently tracking 487 race calls
            across state, congressional, senate, and primary races.
          </p>
        </section>
      </main>

      <footer className="px-8 py-8 max-w-5xl mx-auto w-full flex items-center justify-between">
        <span className="text-xs text-muted/50">&copy; 2026 DecisionDesk</span>
        <span className="text-xs text-muted/50">Data updates nightly</span>
      </footer>
    </div>
  );
}
