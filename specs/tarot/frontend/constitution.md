# Mystic AI Tarot Frontend Constitution

## Core Principles

### I. UX-First Resilience
모든 UI 요소는 네트워크 레이턴시 및 서버 장애 상황에서도 사용자 이탈을 방지하도록 설계되어야 한다. 
모든 비동기 요청 구간에는 아래 항목이 반드시 포함되어야 한다.
- Loading State (스켈레톤 및 프로그레시브 모션)
- Skeleton UI / Loading Indicator
- Error Handling (상위 글로벌 에러 바운더리 인터셉트)
- Retry Strategy (TanStack Query 내 기본 재시도 정책 활용)
빈 화면(Empty State)과 레이아웃 깜빡임(Flicker)은 어떠한 경우에도 허용하지 않는다.

### II. Animation Optimization
타로 카드 셔플, 플립(Flip), 확대 인터랙션은 모바일 및 웹 환경 모두에서 60fps 이상을 유지해야 한다.
모든 애니메이션은 아래 기술 제약을 따른다.
- GPU 기반 transform/opacity 레이어 속성 사용
- 브라우저 렌더링 최적화를 위한 CSS will-change 활용
- Framer Motion 기반 선언형 인터랙션 구현

### III. Strict Validation Layer
모든 사용자 입력은 서버 요청 전에 프론트엔드 검증 레이어를 완벽히 통과해야 한다.
검증 대상:
- 고민 입력 길이 (최소 10자 ~ 최대 500자)
- 공백 문자 우회 (정규식 필터링)
- Prompt Injection 위험 문구 (프롬프트 내 탈취 지시어 사전 블랙리스트 검사)
- 카드 중복 선택 (배열 상태값 내 고유성 검증)
클라이언트 단 검증 실패 시 백엔드 API 요청은 즉각 차단된다.

### IV. Isolated State Architecture
전역 상태는 도메인 역할별로 완전히 분리하여 선언한다.
구분:
- 인증 상태 (Auth Store)
- 타로 진행 상태 (Tarot Session Store)
- UI 상태 (Layout / Modal / Toast Store)
- API 캐시 (Server State)
특정 상태 변경이 시스템 전체의 불필요한 리렌더링을 유발하지 않도록, 모든 컴포넌트는 Zustand Selector 기반 구조를 사용하여 필요한 원자 데이터 구조만 구독한다.

---

## Technical Constraints
- Framework: React 19 + Vite 6
- Language: JavaScript (ES2023)
- Routing: React Router DOM v7 (SPA architecture)
- Styling: Tailwind CSS + Framer Motion
- State Management: Zustand
- Server State: TanStack Query v5
- HTTP Client: Axios
- Validation: Zod (인젝션 가드 및 폼 데이터 유효성 정규식 처리)
- Package Manager: npm

---

## Development Workflow
1. 모든 UI 컴포넌트는 Mock Data 기반으로 우선 독립 개발한다.
2. API 실제 연결 전, 에러/로딩 상황에 대한 단독 UI 스트레스 테스트를 완료해야 한다.
3. 로딩/에러/예외 상태를 완벽히 구현하지 않은 API 연동 컴포넌트는 개발 완료(Done) 상태로 인정하지 않는다.
4. 모든 비즈니스 도메인 로직은 컴포넌트 내부(View 계층)가 아닌 custom hooks 및 store 계층으로 분리한다.

---

## Governance
본 문서는 AI Tarot Frontend 프로젝트의 최상위 개발 규칙이다. 
아키텍처 변경, 상태 관리 엔진 교체, 핵심 외부 라이브러리 도입 시 반드시 문서 업데이트 및 파트원 전체 합의를 수행해야 한다.

**Version**: 2.0.0 | **Ratified**: 2026-05-19 | **Last Amended**: 2026-05-19