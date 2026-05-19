# Tasks: AI Tarot AI-Service

## Phase 1: Setup (Shared Infrastructure)
**Purpose**: 파이썬 의존성 환경 셋업, FastAPI ASGI 인프라 구축 및 환경 변수 시큐어 로더 셋업

- [ ] **T001** Python 3.11+ 환경 및 FastAPI, LangChain, FAISS 핵심 패키지 기반의 `requirements.txt` 아키텍처 기본 명세 구성 정의 (`ai-service/requirements.txt`)
- [ ] **T002** [P] Pydantic Settings 확장 클래스를 구동하여 외부 `.env` 파일 내부 자격 증명을 안전하게 동기화 주입해주는 구성 모듈 구축 (`ai-service/src/app/config.py`)
- [ ] **T003** 전역 CORS 방어 정책 및 API 엔드포인트 통합 뼈대를 구성하는 메인 애플리케이션 진입점 완성 (`ai-service/src/app/main.py`)

---

## Phase 2: Vector Pipeline & RAG Indexing (Core Prerequisites)
**Purpose**: 타로 문서 청킹 가공, OpenAI 임베딩 변환 및 FAISS 로컬 벡터 영속화 인덱스 빌드 완료

- [ ] **T004** 78장 타로 카드의 메이저/마이너 상징성 정의 원천 텍스트 데이터를 수집 가공하여 구조화된 정형 소스 데이터 셋 적재 (`ai-service/src/data/tarot_documents.json`)
- [ ] **T005** 원천 문서를 고유 의미 단위 세그먼트로 분할해주는 최적 청킹(Chunking) 전략 함수 설계 (`ai-service/src/scripts/build_index.py`)
- [ ] **T006** text-embedding-3-small 모델 API를 경유하여 고차원 임베딩 벡터값으로 일괄 변환 처리하는 파이프라인 개발
- [ ] **T007** 변환 완료된 고차원 벡터 데이터 셋을 로컬 CPU 구동형 FAISS 인덱스 바이너리 파일(`.index`) 형태로 파일 저장소에 포워딩 적재 마감
- [ ] **T008** 초기 기동 타이밍에 로컬 바이너리 파일을 고속 인메모리 로딩하고 코사인 유사도(Cosine Similarity) 연산 기반의 Top-K(=3) 매칭 검색을 수행하는 벡터 탐색 서비스 구현 (`ai-service/src/services/retrieval_service.py`)

**Checkpoint**: 핵심 RAG 벡터 엔진 빌드 마감 및 메모리 로더 완성. 이제 LLM 인터페이스 및 비동기 추론 비즈니스 레이어에 직접 착수할 수 있습니다.

---

## Phase 3: RAG Inference & Structured Output (P1) - 첫 상담 코어 프로세스 🎯 MVP
**Goal**: prompt-spec.md 사양에 완벽 정합하는 4단 분할 구조 JSON 출력을 LangChain 파이프라인으로 관통 구현

- [ ] **T009** [P] `prompt-spec.md` 내 Output Schema 사양과 10~500자 제약 한계 사양이 완벽 투영된 분할형 Pydantic 입출력 데이터 규격 스키마 정의 (`ai-service/src/schemas/`)
- [ ] **T010** [P] 타로 상담가 정체성(v5.0.0 정책) 및 단정적 조언 차단 지침이 내포된 선언형 마스터 프롬프트 템플릿 컴포넌트 마운트 (`ai-service/src/core/prompts/`)
- [ ] **T011** FAISS 유사 검색 결과로 도출된 지식 컨텍스트 본문 조각을 마스터 프롬프트 하단 영역에 격리 안전 주입해주는 RAG 컨텍스트 결합 로직 작성
- [ ] **T012** `gpt-5.4-mini` 비동기 세션을 획득하고 네트워크 순시 튐 대비 Exponential Backoff (기본 3회 임계치 설정) 기반 자동 비동기 리트라이 정책이 바인딩된 OpenAI 코어 클라이언트 모듈 개발 (`ai-service/src/infra/openai/`)
- [ ] **T013** **LangChain Structured Output / JSON Parser** 메커니즘을 파이프라인 종단에 결합하여 LLM 응답이 4단 구조(`past`, `present`, `future`, `summary`) 외의 불량 포맷을 내지 못하도록 강제 락 처리 (`ai-service/src/services/rag_service.py`)
- [ ] **T014** `/api/v1/ai/generate` 엔드포인트 비동기 라우터를 완전 개설하고 핵심 RAG 서비스 인터페이스와 데이터 바인딩 바인딩 마감 (`ai-service/src/api/routes/`)

**Checkpoint**: User Story 1 마감. 4단 구조화 JSON 추론 파이프라인 가동 확인 및 독립 통합 규격 테스트 수행 상태 도출.

---

## Phase 4: Security Shield & Safety Guardrail (P2)
**Purpose**: 악성 입력에 의한 시스템 프롬프트 유출을 차단하고 전문 분야 오판 문장 유출을 최종 가드

- [ ] **T015** 유저 입력 데이터 경계면에 특수 문자 구분자 격벽 가드를 주입하고, 입력값 내 유해 HTML 요소를 정제하는 세니타이징 함수 구현 (`ai-service/src/core/security/`)
- [ ] **T016** 고민 본문 문구 내부에 프롬프트 공개 요구나 강제 역할 변경 등 악성 가이드 탈취 키워드가 포착 시 `400 Bad Request` 에러를 터트려주는 프롬프트 인젝션 쉴드 레이어 개발
- [ ] **T017** 추론 완결 직후 시점에 4단 JSON 분할 본문 내부에 비속어, 자해 문구 및 의료/투자/법률 전문 진단 권고 오판 표현이 발각 시 최종 반환을 강제 제어하는 세이프티 아웃풋 가드레일 서비스 완성 (`ai-service/src/services/safety_service.py`)

---

## Phase 5: Observability & Automated Testing
**Purpose**: structlog 기반 구조화 로그 적재 아키텍처 완성 및 pytest 비동기 자동화 검증 프레임워크 셋업

- [ ] **T018** UUID Request ID 추적 미들웨어를 개설하고 모든 추론 호출 시점의 레이턴시 및 코사인 유사도 스코어 로그를 정형 JSON 형태로 콘솔 출력해주는 `structlog` 모듈 빌드 (`ai-service/src/core/logging/`)
- [ ] **T019** `pytest-asyncio` 및 `httpx` 비동기 테스트 모듈을 빌드하여 정상 RAG 출력 정합성 및 422 바인딩 예외를 정밀 자동 검증하는 슬라이스 테스트 스크립트 작성 (`ai-service/src/tests/`)
- [ ] **T020** `python:3.11-slim` 기반의 멀티스테이지 컨테이너 Dockerfile 스크립트를 작성하고 로컬 이미지 빌드를 통해 아티팩트 가동 신뢰성 검증 완료