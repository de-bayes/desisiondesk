import Link from "next/link";

export default function Nav({ active }: { active: string }) {
  const links = [
    { href: "/", label: "Home" },
    { href: "/grades", label: "Grades" },
    { href: "/races", label: "Races" },
    { href: "/about", label: "About" },
    { href: "/methodology", label: "Methodology" },
  ];

  return (
    <header className="px-8 py-6 flex items-center justify-between max-w-5xl mx-auto w-full">
      <Link
        href="/"
        className="text-sm font-medium text-foreground hover:opacity-60 transition-opacity"
        style={{ fontFamily: "var(--font-display), Georgia, serif" }}
      >
        DecisionDesk.org
      </Link>
      <nav className="flex items-center gap-5 text-xs text-muted">
        {links.filter(l => l.href !== "/").map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`hover:text-foreground transition-colors ${
              active === link.href ? "text-foreground underline underline-offset-4" : ""
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
