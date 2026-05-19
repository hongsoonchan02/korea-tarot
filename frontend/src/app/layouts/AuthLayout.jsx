import { Link, Outlet } from 'react-router-dom';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-mystic-radial px-margin-mobile py-12 text-on-surface md:px-margin-desktop">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-container-max flex-col justify-center">
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
          <Link
            className="w-fit text-headline-md font-semibold text-primary transition-opacity hover:opacity-90"
            to="/"
          >
            Mystic AI Tarot
          </Link>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
