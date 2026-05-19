# Tasks: AI Tarot Frontend Application

## Phase 1: Setup (Shared Infrastructure)
**Purpose**: 프로젝트 뼈대 구성 및 다크모드 공통 스타일, 코어 클라이언트 베이스라인 구축

- [x] **T001** React 19 + Vite 6 환경 기반 프론트엔드 기본 스켈레톤 아키텍처 초기화 (`frontend/package.json`, `frontend/src/main.jsx`)
- [x] **T002** 딥 인디고 및 미스틱 퍼플 컬러 테마 사양 반영을 위한 Tailwind CSS 셋업 및 확장 구성 스크립트 작성 (`frontend/tailwind.config.js`, `frontend/src/styles/globals.css`)
- [x] **T003** 하드웨어 가속 기반 컴포넌트 애니메이션을 위한 Framer Motion 라이브러리 연동 및 스타일 클래스 최적화 검증
- [x] **T004** 15초 하드 타임아웃 기본 정책 및 글로벌 에러 인지 구조를 포함한 Axios 공통 클라이언트 인스턴스 모듈 구축 (`frontend/src/api/client.js`)
- [ ] **T005** React Router DOM v7을 활용한 SPA 클라이언트 페이지 라우터 명세 매핑 구성 (`frontend/src/app/router/index.jsx`)
- [ ] **T006** TanStack Query v5 데이터 동기화 프로바이더 선언 및 캐시 타임 옵션 초기 셋업 (`frontend/src/app/providers/QueryProvider.jsx`)
- [ ] **T007** Zustand를 이용한 인증(Auth) 및 타로 세션(TarotSession) 독립 상태 저장소 기본 세팅 (`frontend/src/store/useAuthStore.js`, `frontend/src/store/useTarotStore.js`)

---

## Phase 2: Foundational (Blocking Prerequisites)
**Purpose**: 인증 방어막, 글로벌 에러 바운더리, 폼 검증 스키마 등 코어 서비스 가동을 위한 필수 제어 기반 구축

- [ ] **T008** 전체 화면 1200px 격리 및 공통 다크 테마 유지를 위한 글로벌 Layout 컴포넌트 마운트 (`frontend/src/app/layouts/BaseLayout.jsx`)
- [ ] **T009** 비로그인 유저 접근 감지 시 `/login` 경로로 튕겨내는 프론트엔드 Protected Route 보안 인증 가드 컴포넌트 개발 (`frontend/src/app/router/ProtectedRoute.jsx`)
- [ ] **T010** 사용자 알림 피드백용 전역 가동형 공통 Toast 메시지 및 예외 처리 Modal 프레임워크 구현 (`frontend/src/components/common/Modal.jsx`, `frontend/src/components/common/Toast.jsx`)
- [ ] **T011** Axios Interceptor 기반 서버 4xx/5xx 에러 포착 후 전역 모달과 연결해주는 공통 에러 핸들링 파이프라인 개설 (`frontend/src/api/interceptors.js`)
- [ ] **T012** Zod 유효성 엔진을 기반으로 한 고민 문구 최소/최대 자수(10~500자) 검증 및 Prompt Injection 지시어 필터링 검증 스키마 설계 (`frontend/src/utils/validationSchema.js`)

---

## Phase 3: User Story 1 (P1) - 첫 상담 코어 프로세스 🎯 MVP
**Goal**: 유저가 고민을 입력하고 카드를 무결하게 골라 결과 창까지 안전하게 안착하는 핵심 여정의 컴포넌트 풀 완성

- [ ] **T013** Zod 스키마 연동 및 공백 우회 정규식 가드가 결합된 고민 입력 전용 커스텀 입력 검증 훅 개발 (`frontend/src/hooks/useTarotInput.js`)
- [ ] **T014** `/tarot/main` 경로에 대응하는 고민 입력 및 글자 수 실시간 트래킹 UI 화면 마운트 (`frontend/src/pages/tarot/main.jsx`)
- [ ] **T015** 78장/22장 풀 뒷면 그래픽 처리 및 Hover 시 미스틱 퍼플 발광 효과를 내포한 개별 TarotCard 원자 컴포넌트 설계 (`frontend/src/components/tarot/TarotCard.jsx`)
- [ ] **T016** Framer Motion을 이용하여 스프레드 형태의 22장 카드 Grid 시스템 컴포넌트 빌드 및 클릭 제어 처리 (`frontend/src/components/tarot/CardSpreadGrid.jsx`)
- [ ] **T017** Zustand TarotSessionStore와 결합하여 카드 3장의 순차 선택 제어 및 과거/현재/미래 숫자 배지 실시간 업데이트, 추가 선택 락(Lock) 로직 구현
- [ ] **T018** 최종 결과 페이지 라우터 마운트 및 과거/현재/미래 3열 카드 리버시블 배치 구조 레이아웃 설계 (`frontend/src/pages/tarot/result.jsx`)
- [ ] **T019** 법적 책임 제한 수호를 위한 정적 텍스트 기반 Disclaimer 면책 고지 컴포넌트 제작 및 결과 뷰 최하단 부착 (`frontend/src/components/tarot/Disclaimer.jsx`)

---

## Phase 4: User Story 2 (P2) - AI 로딩 및 장애 대응
**Goal**: LLM 생성 딜레이 시간 동안 유저 경험을 보호하고, 이탈 방지 경고 및 타임아웃 예외 사양을 제어

- [ ] **T020** 3장의 카드가 입체 삼각형 대형으로 허공에 부유하며 회전하는 다크 모드 맞춤형 로딩 페이지 컴포넌트 구현 (`frontend/src/pages/tarot/loading.tsx`)
- [ ] **T021** AI 해석 서버 전송용 TanStack Query 커스텀 Mutation 정의 및 생성 지연 대비 클라이언트 자체 15초 하드 타임아웃 타이머 로직 설계 (`frontend/src/query/useTarotMutation.js`)
- [ ] **T022** 대기 화면 유지 도중 사용자의 돌발적인 뒤로가기/새로고침을 제어하기 위한 브라우저 `beforeunload` 네이티브 창 가로채기 훅 바인딩
- [ ] **T023** AI 서버 타임아웃 오버 혹은 내부 망 붕괴(503) 시 구동을 즉각 중지시키고 인프라 장애 대응 팝업을 연는 예외 모달 처리 레이어 통합

---

## Phase 5: User Story 3 (P3) - 마이페이지 이력 관리
**Goal**: 과거 상담 기록 리스트를 유연하게 스크롤 열람하고, 낙관적 업데이트 기반의 초고속 이력 삭제 시스템을 완성

- [ ] **T024** 상담 이력 아이템 요약 카드(날짜, 20자 요약 본문, 선택 카드 미니 썸네일 구조 포함) 컴포넌트화 (`frontend/src/components/tarot/HistoryCard.jsx`)
- [ ] **T025** 마이페이지 라우터 경로 매핑 및 TanStack Query `useInfiniteQuery` 기반 최신순 렌더링 무한 스크롤 페이징 목록 UI 화면 구현 (`frontend/src/pages/mypage/index.jsx`)
- [ ] **T026** 마이페이지 목록 내부 아이템 선택 시 과거 시점 최종 결과 뷰 상태 그대로 오버레이 렌더링해주는 상담 상세 보기 컴포넌트 연동
- [ ] **T027** 백엔드 Soft Delete 서버 API 연동용 단독 Mutation 모듈 작성 (`frontend/src/query/useDeleteHistory.js`)
- [ ] **T028** 삭제 'X' 확인 액션 발동 즉시 서버 응답 전에 로컬 캐시 노드를 강제 제거하는 **낙관적 업데이트(Optimistic Update)** 및 실패 시 원복(Rollback) 로직 정밀 구현

---

## Phase 6: Polish (Cross-Cutting Concerns)
**Purpose**: 완성된 도메인 컴포넌트들의 디바이스 접근성 개선 및 LightHouse 타겟 정밀 최적화 수행

- [ ] **T029** 360px 모바일 환경부터 대화면 PC까지 여백 및 폰트 유동성을 잡아주는 Tailwind CSS 모바일 반응형 미세 조정 및 레이아웃 폴리싱
- [ ] **T030** GPU 가속 강제 전이 구조 점검 및 Framer Motion 옵션 튜닝을 통한 난수 셔플 가속 연출 성능 최적화
- [ ] **T031** 다크 모드 텍스트 컬러 명도 대비 점검 및 시각 장애인용 기본 웹 접근성(A11y) 가이드 보완
- [ ] **T032** 배포 프로덕션 빌드 후 실제 구글 LightHouse 구동을 통한 성능/접근성 영역 **90점 이상** 데이터 지표 도출 및 최종 스크린 분석 완료
- [ ] **T033** Zustand Selector 전역 오염 코드 검증, 미사용 임포트 구문 정리 및 전체적인 소스 리팩토링 코드 가감 검토
