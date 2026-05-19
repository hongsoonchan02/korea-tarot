import { Link, Outlet } from 'react-router-dom';

const navigationItems = [
  { label: 'Home', to: '/tarot/main' },
  { label: 'My Consultations', to: '/mypage' },
];

export function BaseLayout() {
  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface">
      <header className="sticky top-0 z-50 border-b border-outline-variant/10 bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 w-full max-w-container-max items-center justify-between px-margin-mobile md:px-margin-desktop">
          <Link
            className="text-headline-md font-semibold text-primary transition-opacity hover:opacity-90"
            to="/"
          >
            Mystic AI Tarot
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            {navigationItems.map((item) => (
              <Link
                key={item.to}
                className="text-label-sm uppercase tracking-[0.18em] text-on-surface-variant transition-colors hover:text-primary"
                to={item.to}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="rounded-full border border-white/10 bg-surface-container/70 px-3 py-2 text-label-sm uppercase tracking-[0.18em] text-on-surface-variant">
            Account
          </div>
        </div>
      </header>

      <main className="mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-container-max flex-col px-margin-mobile py-12 md:px-margin-desktop">
        <Outlet />
      </main>

      <footer className="border-t border-outline-variant/10 bg-surface-container-lowest py-10">
        <div className="mx-auto flex w-full max-w-container-max flex-col items-center gap-4 px-margin-mobile text-center md:px-margin-desktop">
          <p className="text-headline-md font-semibold text-primary">
            Mystic AI Tarot
          </p>
          <p className="max-w-2xl text-body-md text-on-surface-variant">
            Immersive tarot reading experience scaffolded with a fixed 1200px
            content frame and shared dark theme shell.
          </p>
          <p className="text-label-sm uppercase tracking-[0.18em] text-on-surface-variant">
            For entertainment purposes only.
          </p>
        </div>
      </footer>
    </div>
  );
}
