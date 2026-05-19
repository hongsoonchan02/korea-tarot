import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { TarotCard } from './TarotCard';

const TOTAL_SPREAD_CARDS = 22;

function createCardLayout(index, totalCards) {
  const centerIndex = (totalCards - 1) / 2;
  const normalizedOffset = (index - centerIndex) / centerIndex;
  const horizontalSpread = 18;
  const verticalSpread = 10;
  const rotationSpread = 9;

  return {
    x: normalizedOffset * horizontalSpread,
    y: Math.abs(normalizedOffset) * verticalSpread * -0.4,
    rotate: normalizedOffset * rotationSpread,
    scale: 1 - Math.abs(normalizedOffset) * 0.06,
    zIndex: totalCards - Math.round(Math.abs(normalizedOffset) * 10),
  };
}

function buildSpreadCards(totalCards) {
  return Array.from({ length: totalCards }, (_, index) => ({
    id: index + 1,
    layout: createCardLayout(index, totalCards),
  }));
}

export function CardSpreadGrid({
  onCardSelect,
  selectedCardIds = [],
  locked = false,
  totalCards = TOTAL_SPREAD_CARDS,
  className = '',
}) {
  const spreadCards = useMemo(() => buildSpreadCards(totalCards), [totalCards]);

  return (
    <section className={['space-y-6', className].filter(Boolean).join(' ')}>
      <div className="flex flex-col gap-2">
        <p className="text-label-sm uppercase tracking-[0.2em] text-primary">
          Card spread
        </p>
        <h2 className="text-headline-lg text-on-surface">
          22장 스프레드 카드 풀
        </h2>
        <p className="max-w-3xl text-body-md text-on-surface-variant">
          가운데를 중심으로 퍼지는 오라 형태로 배치된 카드 그리드입니다. 선택 제어는 상위 상태에서
          전달받아 처리하고, 현재 컴포넌트는 프리젠테이션과 클릭 트리거만 담당합니다.
        </p>
      </div>

      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-surface-container-lowest/40 px-3 py-10 md:px-6 md:py-12">
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-40 -translate-y-1/2 bg-[radial-gradient(circle,rgba(168,85,247,0.14),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_16%,transparent_84%,rgba(255,255,255,0.02))]" />

        <div className="relative flex min-h-[26rem] items-center justify-center">
          <div className="relative h-[23rem] w-full max-w-6xl">
            {spreadCards.map(({ id, layout }) => {
              const selectedOrder = selectedCardIds.indexOf(id) + 1;
              const isSelected = selectedOrder > 0;
              const isLocked = locked && !isSelected;
              const canClick = typeof onCardSelect === 'function';

              return (
                <motion.div
                  key={id}
                  animate={layout}
                  className="absolute left-1/2 top-1/2"
                  initial={false}
                  style={{
                    zIndex: layout.zIndex,
                    width: 'clamp(6.5rem, 9vw, 8.5rem)',
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 120,
                    damping: 16,
                  }}
                >
                  <div
                    className="origin-center"
                    style={{
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <TarotCard
                      ariaLabel={`Tarot card ${id}`}
                      className="shadow-2xl"
                      deckSize={78}
                      disabled={isLocked}
                      onClick={canClick ? () => onCardSelect(id) : undefined}
                      selected={isSelected}
                      selectionOrder={selectedOrder || undefined}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-surface-container-high/50 px-5 py-4 text-label-sm text-on-surface-variant">
        <span>{selectedCardIds.length} / 3 cards selected</span>
        <span>{locked ? 'Selection locked' : 'Selection available'}</span>
      </div>
    </section>
  );
}
