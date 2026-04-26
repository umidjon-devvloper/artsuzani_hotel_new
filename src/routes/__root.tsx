import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";


function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="absolute inset-0 eastern-pattern opacity-40" aria-hidden="true" />
      <div className="relative max-w-md text-center">
        <p className="eyebrow">Lost in the courtyard</p>
        <h1 className="mt-4 font-serif text-8xl font-medium leading-none text-foreground">404</h1>
        <h2 className="mt-4 font-serif text-3xl text-foreground">Page not found</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          The page you're looking for has wandered off down a side street of old Bukhara.
        </p>
        <div className="mt-7">
          <Link to="/" className="btn-gold">
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Artsuzani Hotel · Luxury Boutique Stay in Historic Bukhara" },
      {
        name: "description",
        content:
          "Artsuzani Hotel — a refined boutique hotel in the heart of historic Bukhara. Suzani textures, courtyard calm, and Silk Road hospitality.",
      },
      { name: "author", content: "Artsuzani Hotel" },
      { property: "og:title", content: "Artsuzani Hotel · Luxury Boutique Stay in Bukhara" },
      {
        property: "og:description",
        content: "Boutique hotel inspired by old Bukhara courtyards, madrasas, and golden Silk Road hospitality.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#1d1612" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=Inter:wght@300;400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
