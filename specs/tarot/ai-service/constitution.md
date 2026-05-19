# Mystic AI Tarot AI-Service Constitution

## Core Principles

### I. Deterministic RAG Execution
모든 RAG(Retrieval-Augmented Generation) 파이프라인은 예측 가능하고 결정론적으로 동작해야 한다.
시스템은 아래 정책을 철저히 유지한다.
- 신뢰 가능한 타로 원천 가이드 문서만 임베딩 데이터 셋으로 사용
- 입력 및 상징 텍스트의 정밀 의미 단위 Chunking 수행
- 데이터베이스 탐색 효율을 극대화한 Top-K Retrieval 수행
- Retrieval Context 영역 내부 정보에 한정된 LLM 생성 제한 가드
LLM은 내부 벡터 저장소에서 검색되지 않은 정보를 임의로 지어내거나 환각(Hallucination) 현상을 일으켜서는 안 된다.

### II. Absolute Prompt Isolation
사용자 입력 고민 본문 데이터는 시스템 고유의 지시 프롬프트를 변경하거나 오염시킬 수 없어야 한다.
모든 입력 패킷 데이터는 아래 과정을 순차적으로 필수 통과해야 한다.
- Input Sanitization (악성 태그 및 공백 정제)
- Prompt Injection Shield (지시어 무효화 정규식 필터링)
- Delimiter Isolation (특수 구분자를 통한 유저 입력 영역 원천 격리)
위 검증 레이어를 완벽히 통과한 이후에만 메인 프롬프트 컨텍스트 바인딩을 허용한다.

### III. High-Speed Async Inference
인프라 부하 최소화 및 고속 처리를 위해 모든 AI 추론 파이프라인은 아래 비동기 원칙 사양을 따른다.
- 아웃바운드 대기 성능 최적화를 위한 async/await 구문 일관성 유지
- 논블로킹(Non-blocking) 입출력(IO) 아키텍처 수립
- Async OpenAI Client 기반 멀티 LLM 세션 핸들링
메모리 내 벡터 검색을 전담하는 Vector Retrieval 역시 메인 이벤트를 방해하지 않는 경량 비동기 스레드 풀 구조를 유지해야 한다.

### IV. Safety & Output Validation
AI가 최종 도출해낸 모든 리딩 결과물은 클라이언트 전송 직전 단계에서 아래 명시된 위험 필터 가드레일 레이어를 무조건 통과해야 한다.
- 비속어 및 욕설 / 혐오 표현 검사
- 자해 유도 및 절망적 단정 표현 소거
- 극단적 표현 및 공포심 조장 문구 차단
- 의료 진단 / 법률 판단 / 투자 조언 오판 유도 차단
위 가드레일 검사 실패 시 백엔드로의 전송은 즉각 중단 및 격리된다.

### V. Observability & Traceability
시스템 전반의 인프라 가시성 확보 및 사후 품질 모니터링 분석을 위해 다음 메타데이터를 통합 보존 및 추적 가능해야 한다.
- `request_id` (클라이언트 추적용 고유 UUID)
- `prompt_version` (현재 사용된 프롬프트 버전 관리 식별자)
- `retrieval_context` (FAISS 검색을 통해 LLM에 실제 제공된 가이드 원문)
- `retrieval_score` (유사도 매칭 코사인 유사도 스코어 값)
- `response_time` (순수 AI 인프라 추론 생성 레이턴시 시간)
- `model_name` (추론에 실제 가동된 거대언어모델 명세)
상기 메타데이터를 포함한 모든 서버 로그는 수집 시스템 적재 효율화를 위해 `structlog` 기반의 Structured Logging(JSON) 형태로 기록한다.

---

## Technical Constraints
- Runtime: Python 3.11+
- Framework: FastAPI + Uvicorn
- LLM Model: gpt-5.4-mini
- Embedding Model: text-embedding-3-small
- RAG Framework: LangChain
- Vector Engine: FAISS (CPU 최적화 바이너리 환경)
- Vector Retrieval: Cosine Similarity Top-K Search
- Validation: Pydantic v2 (정형 입출력 객체 데이터 정합성 검증)
- Logging: structlog (구조화 정형 JSON 로깅 라이브러리)
- HTTP Client: httpx (비동기 아웃바운드 가속화 모듈)
- Environment: python-dotenv

---

## Development Workflow
1. 타로 원천 가이드 카드 문서를 최적 세그먼트 단위로 Chunking 후 text-embedding-3-small 모델을 이용해 Embedding 벡터를 생성한다.
2. 생성된 고차원 벡터 데이터를 로컬 FAISS Index 파일(`.index`) 형태로 보존 및 메모리 로드 셋업을 완료한다.
3. 구현되는 모든 추론 API 및 가드레일 로직은 `pytest` 및 `pytest-asyncio` 기반 비동기 통합 테스트 스크립트를 선행 통과해야 한다.
4. 시스템 및 기획적 사양 변경으로 인해 프롬프트 정책 변경 시, 반드시 내부 `prompt-spec.md` 명세 파일을 동기 갱신 관리해야 한다.
5. OpenAI 외부 원격 API 장애 및 레이턴시 폭발 상황에 대비하여 가상 Mock 기반의 예외 롤백 테스트를 필수 수행한다.

---

## Governance
LLM 추론 모델 체계, 프롬프트 운용 가이드라인 정책, 임베딩 차원수 정의 정책, Retrieval 구조 메커니즘 변경 시 반드시 본 문서를 업데이트하고 파트 내부 거버넌스 약정 승인을 획득해야 한다.

**Version**: 5.0.0 | **Ratified**: 2026-05-19 | **Last Amended**: 2026-05-19