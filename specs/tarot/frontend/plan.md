시니어 풀스택 개발자 관점에서 제공해주신 프론트엔드 Spec Kit 파일 5종(constitution.md, spec.md, plan.md, tasks.md, checklist.md)을 정밀 상호 검증(Cross-Checking)했습니다.

🔍 정밀 검토 결과 및 수정 사항
tasks.md와 checklist.md ID 및 내용 일치성 트래킹:

템플릿의 핵심 제약 사항인 "모든 검증 항목은 태스크 리스트와 1:1 대응 및 유기적 연동이 되어야 한다"는 규칙에 맞춰, 태스크 ID(T001~T033)와 체크리스트 ID(CHK-FE-001~CHK-FE-020)의 논리적 연결 고리를 명확히 매핑했습니다.

구조 일치화 (plan.md ↔ 실구현 아키텍처):

plan.md에 명시된 app/, pages/, components/ 등의 SPA 폴더 트리가 tasks.md 파일 경로 명세에 누락 없이 엄격하게 반영되도록 보완했습니다.

엣지 케이스 기술 사양 동기화:

spec.md 및 checklist.md에서 선언된 '공백 우회', 'Prompt Injection(Zod 활용 검증)', '삭제 실패 시 캐시 롤백 메커니즘'이 tasks.md에 명확한 태스크 단위(예: T011, T028)로 쪼개져 들어가 있는 것을 재확인하고 가다듬었습니다.

📂 Folder: specs/tarot/frontend
📄 specs/tarot/frontend/constitution.md
Markdown
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
📄 specs/tarot/frontend/spec.md
Markdown
# Feature Specification: AI Tarot Frontend Application

**Feature Branch**: `feat/tarot-frontend-core`
**Created**: 2026-05-19
**Status**: Draft
**Input**: AI 기반 맞춤형 타로 상담 서비스 기획서 v1.1

---

# User Scenarios & Testing

## User Story 1 - 첫 상담 및 코어 프로세스 (Priority: P1) 🎯 MVP
비로그인 유저는 로그인 페이지로 강제 리다이렉트되며, 로그인 완료 후 메인에서 고민 입력 ➔ 카드 선택 ➔ AI 결과 조회까지 이어지는 핵심 상담 비즈니스 플로우를 수행한다.

### Why this priority
서비스의 비즈니스 가치를 증명하는 가장 핵심적인 도메인이자 최소 기능 제품(MVP)의 필수 단위이다.

### Independent Test
로그인 토큰을 발급받은 유저 세션 환경에서 `/tarot/main` 페이지 진입 후 10자 이상의 테스트 문장을 입력하고 카드 3장을 클릭했을 때, 예외 없이 결과 화면(`/tarot/result/:id`)으로 데이터 바인딩 및 라우팅이 완료되는지 단독 검증한다.

### Acceptance Scenarios
1. **Given** 유저가 로그인 상태일 때, **When** `/tarot/main` 주소로 진입하면, **Then** 500자 제한을 가진 고민 입력창(TextArea)과 비활성화된 CTA 버튼이 화면에 안전하게 노출된다.
2. **Given** 유저가 입력창에 고민을 10자 이상 성실히 입력했을 때, **When** CTA 버튼을 누르면, **Then** 화면 갱신 없이 하단 타로 카드 셔플/선택 단계(Grid)로 매끄럽게 전환된다.
3. **Given** 카드 선택 스프레드 영역에서, **When** 임의의 카드 3장을 순서대로 터치/클릭하면, **Then** 각 카드에 과거(1), 현재(2), 미래(3) 배지가 맵핑되며 3장 충족 즉시 `/tarot/loading`으로 자동 이동한다.

---

## User Story 2 - AI 로딩 및 장애 대응 (Priority: P2)
AI 해석 서버가 RAG 검색 및 텍스트 생성을 수행하는 긴 대기 시간 동안 몰입감 있는 전용 로딩 인터랙션을 제공하고, 예외적인 서버 장애 상황에서는 유저 친화적인 에러 팝업 레이어를 제공하여 시스템 먹통 현상을 방지한다.

### Independent Test
Axios Mock Adapter 또는 서버 지연 설정을 5초 및 15초(타임아웃 임계치)로 각각 트리거하여 로딩 인디케이터가 프레임 드롭 없이 유지되는지 확인하고, 15초 초과 시 에러 복구 모달이 정확히 화면을 방어하는지 단독 테스트한다.

### Acceptance Scenarios
1. **Given** AI 백엔드로 요청 프로토콜이 전송된 상태일 때, **When** `/tarot/loading` 페이지에 진입하면, **Then** 카드가 입체적으로 회전하는 다크 모드 맞춤형 애니메이션과 안내 텍스트가 끊김 없이 지속 노출된다.
2. **Given** 백엔드 응답이 15초 이상 지연되어 시스템 타임아웃이 발생하면, **When** 무한 로딩 상태가 감지되기 직전에, **Then** 즉시 생성 요청을 중단하고 경고 에러 모달을 출력한 뒤 확인 버튼을 누르면 메인 화면으로 돌려보낸다.

---

## User Story 3 - 마이페이지 이력 관리 (Priority: P3)
사용자는 과거에 자신이 진행했던 타로 상담 전체 이력을 마이페이지 목록에서 직관적으로 파악할 수 있으며, 불필요한 기록은 즉시 삭제할 수 있다.

### Independent Test
마이페이지 삭제 액션 발생 시, 네트워크 통신 완료를 대기하지 않고 UI 노드 목록에서 해당 기록 아이템을 즉각 지우는 낙관적 업데이트(Optimistic Update) 흐름이 정상 작동하는지 확인한다.

### Acceptance Scenarios
1. **Given** 사용자가 마이페이지 `/mypage` 경로로 진입 시, **When** DB에 유효한 과거 상담 데이터가 누적되어 있다면, **Then** 최신 생성 일시 순서대로 정렬된 리스트(상담 일자, 고민 요약, 선택 카드 이미지 썸네일)를 컴포넌트에 출력한다.
2. **Given** 목록 내 특정 이력 카드의 우측 상단 'X' 버튼을 클릭했을 때, **When** 모달을 통해 최종 삭제 의사를 확인받으면, **Then** 클라이언트 리스트에서 즉시 카드를 제거하고 백엔드로 Soft Delete API 요청을 전송한다.

---

# Edge Cases
- **공백 및 줄바꿈 우회**: 유저가 공백 문자(Space) 및 줄바꿈(Enter)만 연타하여 10자 제약을 우회하려고 시도할 경우 정규식 `\S` 필터링 레이어가 이를 완벽히 포착해 버튼 제출을 차단해야 한다.
- **분석 중 임의 이탈**: AI 로딩 페이지 도중 사용자가 무심코 뒤로가기 버튼이나 브라우저 새로고침을 시도할 경우 `beforeunload` 이벤트를 인터셉트하여 데이터가 유실될 수 있음을 알리는 경고창을 띄워야 한다.
- **카드 오버 셀렉션**: 카드 3장 선택 스텝 완료 즉시 클릭 핸들러 내부 상태를 `locked`로 전환하여 4장 이상 추가 선택되는 비정상 패킷 송신을 원천 차단해야 한다.
- **네트워크 단절 먹통 방지**: API 통신 실패 및 대기 제한 오버 시 로딩 컴포넌트가 무한으로 도는 버그를 차단하기 위해 Axios Interceptor 단에서 전역 예외 처리 로직이 바인딩되어야 한다.

---

# Requirements

## Functional Requirements
- **FR-FE-001**: 비로그인 사용자는 `/tarot/*`을 포함한 인증 필수 모든 경로 진입 시 세션 체크를 거쳐 `/login`으로 강제 리다이렉트 처리되어야 한다.
- **FR-FE-002**: 고민 입력 폼(TextArea) 컴포넌트는 유저가 글자를 입력할 때마다 실시간으로 바뀐 글자 수를 화면 우측 하단에 가시화해야 한다.
- **FR-FE-003**: 한 번 셔플되어 스프레드된 카드 풀에서는 중복 선택을 완전히 금지하며, 이미 선택된 카드를 재지정하면 취소 처리가 되어야 한다.
- **FR-FE-004**: 결과 화면 컴포넌트 최하단 영역에는 법적 서비스 책임을 방어하기 위한 면책 고지문(Disclaimer)이 상시 정적 배치되어야 한다.
- **FR-FE-005**: 전체 애플리케이션 라우팅 아키텍처는 페이지 전체 새로고침(Full Reload)이 발생하지 않는 React Router v7 기반 클라이언트 사이드 라우팅(SPA) 구조로 일관되어야 한다.
- **FR-FE-006**: Axios Interceptor 통신 모듈을 기반으로 서버 에러코드 수신 시 글로벌 Toast 또는 공통 예외 처리 모달 시스템과 자동 싱크되어야 한다.

---

## Key Entities

### TarotSessionState
현재 사용자가 상호작용하고 있는 타로 리딩 단일 세션 상태 정보 엔티티
- `userContent`: string (사용자가 입력한 고민 원문)
- `selectedCardIds`: number[] (선택된 타로 카드 인덱스 고유 ID 배열, 최대 길이 3)
- `currentStep`: 'INPUT' | 'SELECT' | 'LOADING' | 'RESULT' (현재 컴포넌트 라이프사이클 단계)

### HistoryCardItem
마이페이지 상에서 과거 타로 히스토리 카드를 요약 렌더링하기 위한 데이터 명세 객체
- `readingId`: number (MySQL 저장 고유 식별 PK ID)
- `createdAt`: string (상담이 일어난 날짜 시간 데이터 문자열)
- `contentSummary`: string (고민 내용 중 앞부분만 추출한 요약본 문구)
- `cardThumbnails`: string[] (선택했던 카드 에셋 파일 경로 썸네일 리스트 3종)

---

## Success Criteria

## Measurable Outcomes
- **SC-FE-001**: 카드 이동, 뒤집기, 확대 모션 연출 시 저사양 기기 환경(Mobile 환경 포함)에서도 프레임 저하 없이 일관된 **60fps** 인터랙션을 유지해야 한다.
- **SC-FE-002**: 카드 3장 마킹 선택이 종료된 후 대기 상태 로딩 뷰 화면(`/tarot/loading`)으로 화면 스위칭 및 이동하는 데 소요되는 시간은 내부 자바스크립트 연산 기준 **100ms** 이하여야 한다.
- **SC-FE-003**: 마이페이지 기록 삭제 이벤트 핸들러는 TanStack Query 캐시 조작 기법(낙관적 업데이트)을 사용하여 사용자가 삭제 확인을 누르는 즉시 지연 시간(**0ms**)으로 화면에서 사라져야 한다.
- **SC-FE-004**: 프로덕션 빌드 후 배포 환경에서 구글 LightHouse 오딧(Audit) 측정 시 성능(Performance) 및 접근성(Accessibility) 지표 모두 **90점 이상**을 기록해야 한다.

---

## Assumptions
- 사용자는 최소 크롬, 사파리, 엣지 등 최신 모던 웹 표준 브라우저 환경을 구동하고 있다.
- 실시간 API 통신이 유지되는 최소한의 인터넷 연결 상태가 지속적으로 제공된다고 가정한다.
- 타로 카드 고화질 카드 덱 앞/뒷면 그래픽 소스는 고속 멀티 캐싱 CDN망 또는 로컬 빌드 정적 에셋 풀 내에 온전히 내장되어 있다.
- 디바이스 해상도 360px 모바일 규격부터 1920px 데스크톱 규격까지 완벽한 유동적 반응형 미디어 쿼리 레이아웃 적용이 기본 스코프에 잡혀 있다.
📄 specs/tarot/frontend/plan.md
Markdown
# Implementation Plan: AI Tarot Frontend Application

**Branch**: `feat/tarot-frontend-core`  
**Date**: 2026-05-19  
**Spec**: `/specs/tarot/frontend/spec.md`

---

# Summary
본 프로젝트는 현대적 프론트엔드 표준 명세인 React 19와 Vite 6 번들러 환경을 활용하여 가볍고 견고한 싱글 페이지 애플리케이션(SPA) 웹 서비스를 구축한다. 
유저의 감성을 자극할 Framer Motion 기반 고성능 인터랙션 모션 시스템과 비동기 LLM 데이터의 원할한 제어를 도울 TanStack Query 아키텍처를 결합하여, 기획 v1.1에 부합하는 몰입감 있는 AI 타로 리딩 솔루션을 프론트엔드 단에 완벽히 구현해내는 것을 골자로 한다.

---

# Technical Context

**Language/Version**:
JavaScript (ES2023 사양 준수 코딩 표준)

**Primary Dependencies**:
React 19, Vite 6, React Router DOM v7, Tailwind CSS, Framer Motion v11, Zustand, TanStack Query v5, Axios, Zod

**Storage**:
LocalStorage (인증 토큰 보존 및 비정상 앱 종료 시 세션 상태 임시 복구용)

**Testing**:
Jest + React Testing Library (비즈니스 훅 유효성 검사 위주)

**Target Platform**:
Desktop / Mobile Web Browser Cross Responsive View

**Project Type**:
SPA (Single Page Application) Web Application

**Performance Goals**:
인터랙션 구동 프레임 60fps 사수, 라우터 스위칭 레이턴시 100ms 미만, LightHouse 핵심 지표 90점 이상 스코어링

**Constraints**:
AI 생성 오케스트레이션 타임아웃 15초 하드 리밋 가드, 웹 대 화면 격리를 위한 전체 레이아웃 맥스 가로폭 1200px 중앙 정렬 스펙 격리

---

# Constitution Check
- 모든 비동기 API 요청 파트(Axios Layer)에 독립 로딩 스피너 및 에러 바운더리 핸들러 매핑 여부 확인 (Constitution I 검증 통과)
- 모든 동적 카드 인터랙션 컴포넌트에 GPU 가속 속성(`transform`, `will-change`) 배치 계획 반영 여부 확인 (Constitution II 검증 통과)
- Zod 스키마 엔진을 이용한 고민 글자 수 및 악성 문자 입력 차단 검증 아키텍처 수립 여부 확인 (Constitution III 검증 통과)
- Zustand 독립 스토어 구조 분할 및 셀렉터 방식 상태 참조 가이드 설계 확인 (Constitution IV 검증 통과)

---

# Project Structure

```text
frontend/
├── public/
├── src/
│   ├── app/
│   │   ├── router/          # React Router DOM v7 라우팅 정의 및 가드 트랙
│   │   ├── providers/       # QueryClientProvider, 전역 컨텍스트 프로바이더 집합
│   │   └── layouts/         # Max-width 1200px 가드 및 글로벌 다크 테마 레이아웃
│   ├── pages/
│   │   ├── auth/            # 서비스 접근용 로그인 및 계정 관리 뷰
│   │   ├── tarot/           # 고민 입력(main), 대기(loading), 결과(result) 서브 뷰
│   │   └── mypage/          # 상담 내역 조회 및 삭제 처리 뷰
│   ├── components/
│   │   ├── common/          # Button, Modal, Toast 등 독립형 원자 공통 UI
│   │   ├── layout/          # 글로벌 헤더 및 고지문 포함 푸터 컴포넌트
│   │   └── tarot/           # TarotCard, CardSpreadGrid, ResultSection 등 도메인 컴포넌트
│   ├── hooks/               # 입력 검증 및 브라우저 이벤트 제어용 독립 훅스 계층
│   ├── api/                 # Axios 인스턴스 초기화 및 Interceptor 공통 정의 모듈
│   ├── query/               # TanStack Query용 커스텀 Query/Mutation 가동부
│   ├── store/               # Zustand 스토어 정의 (Auth, TarotSession 격리 구조)
│   ├── styles/              # Tailwind 유틸리티 및 모션 전용 글로벌 CSS 명세
│   ├── utils/               # 정규식 필터링 및 요약 변환 전용 유틸 함수
│   ├── constants/           # 글자 제약 수(10~500), 타임아웃(15000ms) 상수 풀
│   ├── assets/              # 타로 카드 뒷면/앞면 기본 에셋 리소스 이미지
│   └── main.jsx             # 애플리케이션 진입 최상위 마운트 스크립트