import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  useLocation,
} from 'react-router-dom';

import { AuthLayout } from '../layouts/AuthLayout';
import { BaseLayout } from '../layouts/BaseLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { useAuthStore } from '../../store/useAuthStore';

function AppShell({ title, description }) {
  return (
    <section className="bg-mystic-radial py-4 text-on-background">
      <div className="flex flex-col gap-4">
        <span className="inline-flex w-fit rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-label-sm uppercase tracking-[0.2em] text-primary">
          Tarot Frontend
        </span>
        <section className="glass-panel px-6 py-8 md:px-10 md:py-12">
          <h1 className="text-display-lg-mobile text-on-surface md:text-display-lg">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-body-lg text-on-surface-variant">
            {description}
          </p>
        </section>
      </div>
    </section>
  );
}

function LoginPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();
  const from = location.state?.from;
  const postLoginTarget =
    typeof from === 'string' && from.startsWith('/') ? from : '/tarot/main';

  if (isAuthenticated) {
    return <Navigate replace to={postLoginTarget} />;
  }

  return (
    <AppShell
      title="Login route scaffold"
      description={`Authentication UI will land here after the protected-route and auth flow tasks are implemented.${postLoginTarget !== '/tarot/main' ? ` After login, return to ${postLoginTarget}.` : ''}`}
    />
  );
}

function TarotMainPage() {
  return (
    <AppShell
      title="Tarot main route scaffold"
      description="The concern input flow and card spread interaction will mount on this route."
    />
  );
}

function TarotLoadingPage() {
  return (
    <AppShell
      title="Tarot loading route scaffold"
      description="The animated loading scene and timeout handling will mount on this route."
    />
  );
}

function TarotResultPage() {
  return (
    <AppShell
      title="Tarot result route scaffold"
      description="The final reading result view and disclaimer area will mount on this route."
    />
  );
}

function MyPage() {
  return (
    <AppShell
      title="My page route scaffold"
      description="Reading history and optimistic deletion flow will mount on this route."
    />
  );
}

function NotFoundPage() {
  return (
    <AppShell
      title="Route not found"
      description="The requested page does not exist in the current SPA route map."
    />
  );
}

function RootRedirect() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return <Navigate replace to={isAuthenticated ? '/tarot/main' : '/login'} />;
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
    ],
  },
  {
    path: '/',
    element: <BaseLayout />,
    children: [
      {
        index: true,
        element: <RootRedirect />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'tarot/main',
            element: <TarotMainPage />,
          },
          {
            path: 'tarot/loading',
            element: <TarotLoadingPage />,
          },
          {
            path: 'tarot/result/:id',
            element: <TarotResultPage />,
          },
          {
            path: 'mypage',
            element: <MyPage />,
          },
        ],
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

export function AppRouterProvider() {
  return <RouterProvider router={router} />;
}

export { router };
