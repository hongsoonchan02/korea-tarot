import { useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';

import { Disclaimer } from '../../components/tarot/Disclaimer';
import { TarotCard } from '../../components/tarot/TarotCard';
import { useTarotStore } from '../../store/useTarotStore';

const RESULT_COLUMNS = [
  { key: 'past', label: 'Past', description: '과거의 흐름' },
  { key: 'present', label: 'Present', description: '현재의 흐름' },
  { key: 'future', label: 'Future', description: '미래의 흐름' },
];

function getFallbackCardId(index) {
  return index + 1;
}

export function TarotResultPage() {
  const { id } = useParams();
  const selectedCardIds = useTarotStore((state) => state.selectedCardIds);
  const userContent = useTarotStore((state) => state.userContent);
  const setCurrentStep = useTarotStore((state) => state.setCurrentStep);

  useEffect(() => {
    setCurrentStep('RESULT');
  }, [setCurrentStep]);

  const resultCardIds = useMemo(() => {
    return RESULT_COLUMNS.map((column, index) => ({
      ...column,
      cardId: selectedCardIds[index] ?? getFallbackCardId(index),
      selectionOrder: index + 1,
    }));
  }, [selectedCardIds]);

  return (
    <section className="grid gap-8 pb-8">
      <div className="glass-panel border-primary/20 bg-surface-container/80 px-6 py-8 md:px-10 md:py-10">
        <div className="flex flex-col gap-4">
          <p className="inline-flex w-fit rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-label-sm uppercase tracking-[0.2em] text-primary">
            Tarot Result
          </p>
          <div className="space-y-3">
            <h1 className="text-display-lg-mobile text-on-surface md:text-display-lg">
              리딩 결과 #{id}
            </h1>
            <p className="max-w-3xl text-body-lg text-on-surface-variant">
              선택된 3장의 카드가 과거, 현재, 미래의 흐름으로 리버시블 배치되어 있습니다. 현재 단계는
              `RESULT`이며, 후속 단계에서 상세 해석과 면책 고지를 확장합니다.
            </p>
          </div>
        </div>
      </div>

      {selectedCardIds.length < 3 ? (
        <div className="glass-panel px-6 py-8 md:px-10">
          <p className="text-body-lg text-on-surface-variant">
            결과를 표시할 카드가 아직 충분하지 않습니다. 카드 3장을 먼저 선택해 주세요.
          </p>
          <Link
            className="mt-4 inline-flex items-center rounded-full bg-primary px-5 py-3 text-label-md font-semibold text-surface transition-colors hover:bg-primary/90"
            to="/tarot/main"
          >
            메인으로 이동
          </Link>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-3">
        {resultCardIds.map(({ key, label, description, cardId, selectionOrder }) => (
          <article
            key={key}
            className="glass-panel flex flex-col gap-4 border-white/10 px-6 py-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-label-sm uppercase tracking-[0.2em] text-primary">
                  {label}
                </p>
                <h2 className="mt-1 text-headline-lg text-on-surface">{description}</h2>
              </div>
              <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-label-sm uppercase tracking-[0.18em] text-primary">
                #{selectionOrder}
              </span>
            </div>

            <div className="relative flex justify-center py-4">
              <TarotCard
                ariaLabel={`${label} result card ${cardId}`}
                className="w-52 rotate-180 shadow-[0_28px_70px_rgba(11,13,27,0.45)]"
                deckSize={78}
                selected
                selectionOrder={selectionOrder}
              />
            </div>

            <div className="rounded-2xl border border-white/10 bg-surface-container-lowest/60 px-4 py-4 text-body-md text-on-surface-variant">
              <p className="font-semibold text-on-surface">{userContent || '입력된 고민 없음'}</p>
              <p className="mt-2">{label} 카드 해석 영역은 다음 단계에서 상세 텍스트로 확장됩니다.</p>
            </div>
          </article>
        ))}
      </div>

      <Disclaimer />
    </section>
  );
}
