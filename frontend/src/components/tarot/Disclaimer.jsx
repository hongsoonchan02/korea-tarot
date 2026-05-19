export function Disclaimer() {
  return (
    <section className="glass-panel border-white/10 px-6 py-6 md:px-10">
      <p className="text-label-sm uppercase tracking-[0.2em] text-primary">
        Disclaimer
      </p>
      <h2 className="mt-3 text-headline-lg text-on-surface">
        면책 고지
      </h2>
      <div className="mt-4 space-y-3 text-body-md text-on-surface-variant">
        <p>
          본 타로 상담 결과는 오락 및 자기 성찰 보조 목적의 콘텐츠입니다.
        </p>
        <p>
          결과 해석은 확정적 사실이나 전문 자문을 대체하지 않으며, 중요한 의사결정은
          별도의 전문 기관과 함께 검토해야 합니다.
        </p>
        <p>
          서비스 이용자는 결과를 참고용으로만 사용해야 하며, 운영사는 결과 활용에 따른
          직접적·간접적 손해에 대해 책임을 부담하지 않습니다.
        </p>
      </div>
    </section>
  );
}
