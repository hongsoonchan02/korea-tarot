import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { motion } from 'framer-motion';

import './styles/globals.css';

function AppBootstrap() {
  return (
    <main className="min-h-screen bg-mystic-radial px-margin-mobile py-16 text-on-background md:px-margin-desktop">
      <div className="mx-auto flex max-w-container-max flex-col gap-8">
        <motion.section
          className="glass-panel motion-gpu overflow-hidden px-6 py-8 md:px-10 md:py-12"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <motion.span
            className="inline-flex rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-label-sm uppercase tracking-[0.2em] text-primary"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
          >
            T003 Motion Base
          </motion.span>
          <div className="mt-6 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
            <motion.div
              className="max-w-3xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.16, ease: 'easeOut' }}
            >
              <h1 className="text-display-lg-mobile text-on-surface md:text-display-lg">
                Mystic AI Tarot
              </h1>
              <p className="mt-4 max-w-2xl text-body-lg text-on-surface-variant">
                Framer Motion is now wired into the frontend scaffold with a
                reusable GPU-friendly baseline for upcoming tarot interactions.
              </p>
            </motion.div>
            <motion.div
              className="card-orbit-shell motion-gpu justify-self-start lg:justify-self-end"
              initial={{ opacity: 0, scale: 0.92, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.6, delay: 0.22, ease: 'easeOut' }}
            >
              <motion.div
                className="tarot-motion-card tarot-motion-card-back"
                animate={{ y: [0, -10, 0], rotate: [-4, 0, -4] }}
                transition={{
                  duration: 6,
                  ease: 'easeInOut',
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />
              <motion.div
                className="tarot-motion-card tarot-motion-card-front"
                animate={{ y: [0, 12, 0], rotate: [5, 0, 5] }}
                transition={{
                  duration: 6.8,
                  ease: 'easeInOut',
                  repeat: Number.POSITIVE_INFINITY,
                }}
              />
            </motion.div>
          </div>
        </motion.section>
        <motion.section
          className="grid gap-4 md:grid-cols-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.28 }}
        >
          <motion.article
            className="glass-panel motion-gpu px-5 py-5"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.32, ease: 'easeOut' }}
          >
            <p className="text-label-sm uppercase tracking-[0.18em] text-primary">
              Motion
            </p>
            <h2 className="mt-3 text-headline-md text-on-surface">
              Framer Motion connected
            </h2>
            <p className="mt-2 text-body-md text-on-surface-variant">
              Entry transitions now run through motion primitives instead of
              static markup only.
            </p>
          </motion.article>
          <motion.article
            className="glass-panel motion-gpu px-5 py-5"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.38, ease: 'easeOut' }}
          >
            <p className="text-label-sm uppercase tracking-[0.18em] text-secondary">
              GPU
            </p>
            <h2 className="mt-3 text-headline-md text-on-surface">
              Hardware acceleration path
            </h2>
            <p className="mt-2 text-body-md text-on-surface-variant">
              Animated surfaces use transform and will-change oriented styles
              to match the performance constraints in the spec.
            </p>
          </motion.article>
          <motion.article
            className="glass-panel motion-gpu px-5 py-5"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.44, ease: 'easeOut' }}
          >
            <p className="text-label-sm uppercase tracking-[0.18em] text-tertiary">
              Scope
            </p>
            <h2 className="mt-3 text-headline-md text-on-surface">
              T003 baseline
            </h2>
            <p className="mt-2 text-body-md text-on-surface-variant">
              This establishes the shared motion baseline before tarot card
              spread and loading scenes are implemented in later tasks.
            </p>
          </motion.article>
        </motion.section>
      </div>
    </main>
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppBootstrap />
  </StrictMode>,
);
