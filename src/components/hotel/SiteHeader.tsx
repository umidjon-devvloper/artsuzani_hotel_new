import { Link } from "@tanstack/react-router";
import { Menu, UserRound, X, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/rooms", label: "Rooms" },
  { to: "/gallery", label: "Gallery" },
  { to: "/account", label: "Account" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled
            ? "glass-nav py-0 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.18)]"
            : "border-b border-transparent bg-background/30 backdrop-blur-md"
        }`}
      >
        <nav
          className={`mx-auto flex max-w-7xl items-center justify-between px-5 transition-all duration-500 md:px-8 ${
            scrolled ? "h-16" : "h-20"
          }`}
        >
          {/* Logo */}
          <Link to="/" className="group flex items-center gap-3" aria-label="Artsuzani Hotel home">
            <img
              src="https://8npyms8qz2.ufs.sh/f/tLZsXxIXMCJ32RNJl1QqM6OtfBkRePmcFj9JUE1HVuQZpoLz"
              alt="Artsuzani Hotel logo"
              className=" h-75 w-auto transition-transform duration-300 group-hover:rotate-6"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-10 text-[0.78rem] font-medium uppercase tracking-[0.26em] text-muted-foreground md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                activeProps={{ className: "text-gold-deep" }}
                activeOptions={{ exact: link.to === "/" }}
                className="relative transition-colors hover:text-foreground"
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    <span
                      className={`absolute -bottom-1.5 left-1/2 h-px bg-gold transition-all duration-300 ${
                        isActive ? "w-6 -translate-x-1/2" : "w-0 -translate-x-1/2"
                      }`}
                    />
                  </>
                )}
              </Link>
            ))}
          </div>

          {/* CTA + mobile toggle */}
          <div className="flex items-center gap-3">
            <Link to="/account" className="btn-ghost hidden md:inline-flex">
              <UserRound className="size-4" />
              <span className="text-sm">My bookings</span>
            </Link>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="grid size-11 place-items-center rounded-full border border-border bg-card transition-colors hover:bg-secondary md:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-500 md:hidden ${
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileOpen(false)}
      >
        <div className="absolute inset-0 bg-primary/85 backdrop-blur-md" />
        <div
          className={`absolute inset-x-4 top-24 rounded-2xl border border-gold/30 bg-card p-6 shadow-royal transition-transform duration-500 ${
            mobileOpen ? "translate-y-0" : "-translate-y-6"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <p className="eyebrow">Navigate</p>
          <div className="mt-5 grid gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between rounded-xl border border-transparent px-4 py-4 font-serif text-2xl text-foreground transition-all hover:border-gold/30 hover:bg-secondary/60"
                activeProps={{ className: "border-gold/40 bg-secondary/60 text-gold-deep" }}
                activeOptions={{ exact: link.to === "/" }}
              >
                {link.label}
                <span className="text-gold">→</span>
              </Link>
            ))}
          </div>
          <Link to="/account" onClick={() => setMobileOpen(false)} className="btn-gold mt-5 w-full">
            <UserRound className="size-4" /> My bookings
          </Link>
        </div>
      </div>
    </>
  );
}
