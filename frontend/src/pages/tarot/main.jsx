import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { CardSpreadGrid } from '../../components/tarot/CardSpreadGrid';
import { useTarotInput } from '../../hooks/useTarotInput';
import { useTarotStore } from '../../store/useTarotStore';

function getProgressColor(isValid, characterCount, minLength) {
  if (isValid) {
    return 'text-emerald-300';
  }

  if (characterCount === 0) {
    return 'text-on-surface-variant';
  }

  if (characterCount < minLength) {
    return 'text-amber-300';
  }

  return 'text-rose-300';
}

export function TarotMainPage() {
  const navigate = useNavigate();
  const savedContent = useTarotStore((state) => state.userContent);
  const selectedCardIds = useTarotStore((state) => state.selectedCardIds);
  const setUserContent = useTarotStore((state) => state.setUserContent);
  const setCurrentStep = useTarotStore((state) => state.setCurrentStep);
  const setSelectedCardIds = useTarotStore((state) => state.setSelectedCardIds);
  const tarotInput = useTarotInput(savedContent);
  const isSelectionLocked = selectedCardIds.length >= 3;

  const progressLabel = useMemo(() => {
    if (tarotInput.characterCount === 0) {
      return '0 / 500';
    }

    return `${tarotInput.characterCount} / ${tarotInput.maxLength}`;
  }, [tarotInput.characterCount, tarotInput.maxLength]);

  function handleContentChange(event) {
    tarotInput.handleChange(event);
    setUserContent(event.target.value);
    setCurrentStep('INPUT');
    setSelectedCardIds([]);
  }

  function handleStartSelection() {
    if (!tarotInput.isValid) {
      tarotInput.handleBlur();
      return;
    }

    setUserContent(tarotInput.userContent);
    setCurrentStep('SELECT');
  }

  function handleCardSelect(cardId) {
    if (isSelectionLocked || selectedCardIds.includes(cardId)) {
      return;
    }

    const nextSelectedCardIds = [...selectedCardIds, cardId];
    setSelectedCardIds(nextSelectedCardIds);

    if (nextSelectedCardIds.length >= 3) {
      setCurrentStep('LOADING');
      navigate('/tarot/loading');
      return;
    }

    setCurrentStep('SELECT');
  }

  return (
    <section className="grid gap-6 pb-8">
      <div className="glass-panel border-primary/20 bg-surface-container/80 px-6 py-8 md:px-10 md:py-10">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <p className="inline-flex w-fit rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-label-sm uppercase tracking-[0.2em] text-primary">
              Tarot Session
            </p>
            <div className="space-y-3">
              <h1 className="text-display-lg-mobile text-on-surface md:text-display-lg">
                지금 고민을 입력해 주세요
              </h1>
              <p className="max-w-2xl text-body-lg text-on-surface-variant">
                10자 이상 입력하면 카드 선택 단계로 이어질 준비가 됩니다. 500자까지 입력할 수 있고,
                입력 내용은 세션 상태에 동기화됩니다.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-surface-container-high/60 px-4 py-3 text-right">
            <p className="text-label-sm uppercase tracking-[0.18em] text-on-surface-variant">
              Live count
            </p>
            <p className="mt-1 text-display-sm text-primary">{progressLabel}</p>
            <p
              className={`mt-1 text-label-sm ${getProgressColor(
                tarotInput.isValid,
                tarotInput.characterCount,
                tarotInput.minLength,
              )}`}
            >
              {tarotInput.hasPromptInjection
                ? '차단된 표현이 감지되었습니다.'
                : tarotInput.hasWhitespaceOnly
                  ? '공백만으로는 진행할 수 없습니다.'
                  : tarotInput.trimmedCharacterCount < tarotInput.minLength
                    ? `공백 제외 ${tarotInput.minLength}자 이상 필요합니다.`
                    : '입력 조건을 충족했습니다.'}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <label className="flex flex-col gap-3">
            <span className="text-label-md uppercase tracking-[0.18em] text-on-surface-variant">
              고민 문구
            </span>
            <textarea
              className="min-h-52 w-full resize-none rounded-2xl border border-white/10 bg-surface-container-lowest/80 px-5 py-4 text-body-lg text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/60 focus:border-primary/60 focus:ring-2 focus:ring-primary/20"
              maxLength={tarotInput.maxLength}
              onBlur={tarotInput.handleBlur}
              onChange={handleContentChange}
              placeholder="예: 최근에 진로를 바꿔야 할지 계속 고민하고 있어요."
              value={tarotInput.userContent}
            />
            <div className="flex flex-wrap items-center justify-between gap-3 text-label-sm text-on-surface-variant">
              <span>
                {tarotInput.characterCount} / {tarotInput.maxLength} characters
              </span>
              <span>{tarotInput.trimmedCharacterCount} non-whitespace characters</span>
            </div>
            {tarotInput.errorMessage ? (
              <p className="text-label-md text-rose-300">{tarotInput.errorMessage}</p>
            ) : null}
          </label>

          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-surface-container-high/40 p-5">
            <div className="space-y-3">
              <p className="text-label-md uppercase tracking-[0.18em] text-on-surface-variant">
                Next step
              </p>
              <p className="text-body-md text-on-surface-variant">
                버튼을 누르면 카드 선택 상태로 전환되고, 다음 작업에서 스프레드가 연결됩니다.
              </p>
            </div>
            <button
              className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-label-md font-semibold text-surface transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary/30"
              disabled={!tarotInput.isValid}
              onClick={handleStartSelection}
              type="button"
            >
              카드 선택 시작
            </button>
            <div className="rounded-xl border border-dashed border-white/10 bg-surface-container-lowest/60 px-4 py-4 text-label-sm text-on-surface-variant">
              <p>현재 단계: {isSelectionLocked ? 'LOCKED' : 'SELECT'}</p>
              <p className="mt-1">카드 3장 선택 완료 시 /tarot/loading 으로 자동 이동합니다.</p>
            </div>
          </div>
        </div>
      </div>

      <CardSpreadGrid
        locked={isSelectionLocked}
        onCardSelect={handleCardSelect}
        selectedCardIds={selectedCardIds}
      />
    </section>
  );
}
