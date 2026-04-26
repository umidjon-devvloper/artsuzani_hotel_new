import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, MoonStar, Sparkles, Check } from "lucide-react";
import { SiteHeader } from "@/components/hotel/SiteHeader";
import { PatternDivider } from "@/components/hotel/PatternDivider";
import { galleryImages } from "@/lib/hotel";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery · Artsuzani Hotel" },
      {
        name: "description",
        content:
          "Explore the beauty of Artsuzani Hotel and historic Bukhara through our curated gallery.",
      },
      { property: "og:title", content: "Artsuzani Hotel Gallery" },
      {
        property: "og:description",
        content: "Discover the authentic charm of Bukhara and our hotel's stunning spaces.",
      },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    if (selected === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const open = (i: number) => {
    setSelected(i);
    document.body.style.overflow = "hidden";
  };
  const close = () => {
    setSelected(null);
    document.body.style.overflow = "unset";
  };
  const next = () => {
    if (selected !== null) setSelected((selected + 1) % galleryImages.length);
  };
  const prev = () => {
    if (selected !== null)
      setSelected(selected === 0 ? galleryImages.length - 1 : selected - 1);
  };

  return (
    <main className="min-h-screen bg-background pb-20 pt-28 text-foreground">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden px-5 pb-10 md:px-8">
        <div className="absolute inset-0 eastern-pattern opacity-50" aria-hidden="true" />
        <div className="absolute -left-20 top-10 h-[400px] w-[400px] rounded-full bg-gold/10 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl text-center">
          <p className="eyebrow justify-center">Visual journey</p>
          <h1 className="soft-reveal mt-4 font-serif text-5xl font-light leading-[0.95] md:text-8xl">
            Discover <span className="italic text-gold">Artsuzani.</span>
          </h1>
          <p className="soft-reveal-delay-1 mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Step into the heart of Bukhara's heritage. Every corner tells a story of ancient Silk
            Road splendour, handcrafted details, and warm hospitality.
          </p>
          <PatternDivider />
        </div>
      </section>

      {/* Masonry-style grid */}
      <section className="px-5 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {galleryImages.map((image, index) => {
              // Variable spans for visual interest
              const isFeatured = index === 0 || index === 4;
              const isTall = index === 2 || index === 7;
              return (
                <button
                  key={index}
                  onClick={() => open(index)}
                  className={`image-frame group relative aspect-[4/3] overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:shadow-glow ${
                    isFeatured ? "md:col-span-2 md:row-span-2 md:aspect-square" : ""
                  } ${isTall ? "md:row-span-2 md:aspect-[3/4]" : ""}`}
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <img
                    src={image.src as string}
                    alt={image.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute bottom-0 left-0 right-0 translate-y-full p-5 text-left transition-transform duration-500 group-hover:translate-y-0">
                    <p className="text-sm font-medium text-primary-foreground">{image.alt}</p>
                  </div>
                  <span className="floating-badge absolute right-3 top-3 grid size-9 place-items-center rounded-full opacity-0 transition-opacity group-hover:opacity-100">
                    <Sparkles className="size-4 text-gold" />
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured story */}
      <section className="mt-20 px-5 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="luxe-card relative overflow-hidden p-8 md:p-14">
            <div className="absolute inset-0 suzani-pattern opacity-30" aria-hidden="true" />
            <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-gold-deep">
                  <MoonStar className="size-3.5" /> Experience the magic
                </div>
                <h2 className="mt-5 font-serif text-4xl font-light leading-tight md:text-6xl">
                  Where history <span className="italic text-gold">meets comfort.</span>
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                  Our hotel is nestled in the historic heart of Bukhara, surrounded by ancient
                  madrasas, bustling bazaars, and architectural marvels that have stood for
                  centuries.
                </p>
                <ul className="mt-7 space-y-3">
                  {[
                    "Traditional Uzbek architecture with modern amenities",
                    "Handcrafted suzani textiles and local ceramics",
                    "Peaceful courtyards and garden views",
                    "Walking distance to historic sites",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-gold/40 bg-gold/15 text-gold-deep">
                        <Check className="size-3.5" strokeWidth={2.5} />
                      </span>
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <img
                  src={galleryImages[0]?.src as string}
                  alt="Courtyard view"
                  className="aspect-[3/4] rounded-xl object-cover shadow-eastern"
                />
                <img
                  src={galleryImages[1]?.src as string}
                  alt="Minaret view"
                  className="mt-10 aspect-[3/4] rounded-xl object-cover shadow-eastern"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selected !== null && (
        <div
          className="animate-scale-in fixed inset-0 z-[60] flex items-center justify-center bg-primary/95 p-4 backdrop-blur-md"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <button
            onClick={close}
            className="absolute right-5 top-5 z-10 grid size-12 place-items-center rounded-full border border-gold/40 bg-card/20 text-primary-foreground backdrop-blur-md transition-all hover:bg-gold hover:text-primary"
            aria-label="Close lightbox"
          >
            <X className="size-5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-5 top-1/2 z-10 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-gold/40 bg-card/20 text-primary-foreground backdrop-blur-md transition-all hover:bg-gold hover:text-primary"
            aria-label="Previous image"
          >
            <ChevronLeft className="size-5" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-5 top-1/2 z-10 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-gold/40 bg-card/20 text-primary-foreground backdrop-blur-md transition-all hover:bg-gold hover:text-primary"
            aria-label="Next image"
          >
            <ChevronRight className="size-5" />
          </button>

          <div
            className="relative max-h-[90vh] max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={galleryImages[selected]?.src as string}
              alt={galleryImages[selected]?.alt}
              className="max-h-[88vh] w-auto rounded-xl object-contain shadow-royal"
            />
            <div className="mt-4 flex items-center justify-between text-sm text-primary-foreground/80">
              <span>{galleryImages[selected]?.alt}</span>
              <span className="text-xs uppercase tracking-[0.22em]">
                {selected + 1} / {galleryImages.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
