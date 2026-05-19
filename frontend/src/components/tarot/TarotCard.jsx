const DECK_THEME = {
  22: {
    accent: 'from-amber-200/35 via-amber-300/20 to-violet-300/10',
    border: 'border-amber-200/35',
    glow: 'group-hover:shadow-[0_0_30px_rgba(245,158,11,0.28)]',
    label: 'Major Arcana',
  },
  78: {
    accent: 'from-violet-200/30 via-fuchsia-300/18 to-indigo-300/10',
    border: 'border-violet-200/30',
    glow: 'group-hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]',
    label: 'Full Deck',
  },
};

function getDeckTheme(deckSize) {
  return DECK_THEME[deckSize] ?? DECK_THEME[78];
}

export function TarotCard({
  deckSize = 78,
  className = '',
  onClick,
  selected = false,
  disabled = false,
  selectionOrder,
  ariaLabel,
}) {
  const isInteractive = typeof onClick === 'function';
  const theme = getDeckTheme(deckSize);
  const Component = isInteractive ? 'button' : 'div';

  return (
    <Component
      aria-label={ariaLabel ?? `${theme.label} tarot card back`}
      className={[
        'group relative aspect-[5/8] w-full overflow-hidden rounded-[1.75rem] border bg-surface-container-lowest text-left transition-all duration-300 motion-gpu',
        theme.border,
        theme.glow,
        selected ? 'scale-[1.02] ring-2 ring-primary/60' : 'hover:-translate-y-1',
        disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      disabled={isInteractive ? disabled : undefined}
      onClick={onClick}
      type={isInteractive ? 'button' : undefined}
    >
      <div
        className={[
          'absolute inset-0 bg-gradient-to-br opacity-95 transition-opacity duration-300',
          theme.accent,
        ].join(' ')}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.14),transparent_22%),radial-gradient(circle_at_80%_25%,rgba(255,255,255,0.08),transparent_24%),radial-gradient(circle_at_50%_85%,rgba(255,255,255,0.06),transparent_28%)]" />
      <div className="absolute inset-0 border border-white/10" />

      <div className="absolute inset-0 flex flex-col justify-between p-4 text-surface">
        <div className="flex items-center justify-between text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-white/80">
          <span>{theme.label}</span>
          <span>{deckSize}</span>
        </div>

        <div className="relative mx-auto flex h-28 w-20 items-center justify-center rounded-[1.35rem] border border-white/20 bg-surface/10 backdrop-blur-sm">
          <div className="absolute inset-2 rounded-[1rem] border border-white/20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.25),transparent_45%)]" />
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/25 bg-white/10">
            <div className="h-7 w-7 rounded-full border border-white/35" />
            <span className="absolute left-1/2 top-1/2 h-px w-8 -translate-x-1/2 -translate-y-1/2 bg-white/60" />
            <span className="absolute left-1/2 top-1/2 h-8 w-px -translate-x-1/2 -translate-y-1/2 bg-white/60" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          <div className="flex items-center justify-between text-[0.65rem] uppercase tracking-[0.22em] text-white/75">
            <span>{selected ? 'Selected' : 'Hover to reveal'}</span>
            <span>{selectionOrder ? `#${selectionOrder}` : 'Back'}</span>
          </div>
        </div>
      </div>

      <div className="absolute inset-0 rounded-[1.75rem] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)] transition-opacity duration-300 group-hover:opacity-0" />
    </Component>
  );
}
