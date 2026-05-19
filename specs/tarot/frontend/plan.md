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