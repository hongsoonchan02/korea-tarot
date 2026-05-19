# Feature Specification: AI Tarot AI-Service

**Feature Branch**: `feat/tarot-ai-core`
**Created**: 2026-05-19
**Status**: Draft
**Input**: AI 기반 맞춤형 타로 상담 서비스 기획서 v1.1 및 프롬프트 명세서 v5.0.0

---

# User Scenarios & Testing

## User Story 1 - RAG 기반 4단 구조화 타로 리딩 생성 (Priority: P1) 🎯 MVP
사용자의 고민 데이터 페이로드와 선택 카드 고유 ID 3개 정보를 전달받으면, AI 서비스는 로컬 FAISS 벡터 저장소에서 관련 타로 상징 가이드를 고속 인출하여 프롬프트를 조립한 뒤, `gpt-5.4-mini` 추론망을 통해 과거/현재/미래/총평 구조를 완벽히 충족하는 4단 구조화 JSON 데이터를 리턴한다.

### Why this priority
`prompt-spec.md`가 강제하는 정형화된 리딩 구조를 엄격히 준수하여 백엔드 파싱 에러를 미연에 방지하고 고품질 타로 콘텐츠를 정시 보장하기 위한 코어 MVP 스펙이다.

### Independent Test
앱 구동 환경에서 인메모리 FAISS 로드가 완료된 상태를 가정한 후 `POST /api/v1/ai/generate` 엔드포인트로 테스트민 텍스트를 인입 시, OpenAI API를 거쳐 `prompt-spec.md`에 명시된 4단 출력 규격 JSON 객체가 무결하게 도출되는지 독립 통합 검증한다.

### Acceptance Scenarios
1. **Given** 타로 인덱스 벡터 파일이 메모리에 성공적으로 상주하고 있을 때, **When** 유효 규격의 카드 ID 3개 및 고민 스트링이 전송되면, **Then** Retrieval Context 지식 정보에 기반하여 작성된 4단 구조(`past`, `present`, `future`, `summary`) 응답 포맷 데이터를 200 OK 코드와 함께 반환한다.
2. **Given** Pydantic 검증 레이어 판단 하에, **When** 유효 범위를 탈탈 벗어난 불량 카드 ID나 자수 부족 상태의 폼 데이터가 주입되면, **Then** 외부 원격 OpenAI 컴포넌트를 호출하기 전에 즉각 트랙을 차단하고 `422 Unprocessable Entity` 에러 응답을 반환한다.

---

## User Story 2 - Prompt Injection & Safety (Priority: P2)
사용자가 주입하는 악성 프롬프트 탈취/변조 명령어를 선제 디펜스하고, 생성 완료 단계에서 발생할 수 있는 금지 표현 유출 리스크를 완벽하게 차단한다.

### Acceptance Scenarios
1. **Given** 고민 입력 본문 내부에 시스템 지시 내역 무시 및 프롬프트 소스 공개를 유도하는 악성 주입 문자열 패턴이 포함되어 있을 때, **When** Security 쉴드 레이어로 인입되면, **Then** LLM 추론 영역으로 연동을 차단하고 `400 Bad Request` 에러 코드로 패킷을 강제 드롭한다.
2. **Given** LLM 추론 마감 시점에 정형 응답 텍스트 블록이 도출되었을 때, **When** Output Guardrail 검사 스크립트가 비속어나 의료/투자/법률적 오판 유도 금지 정책 위반 요소를 발견하면, **Then** 즉시 결과를 유저에게 내보내지 않고 차단 처리한 뒤 가드레일 차단 예외 코드를 발생시킨다.

---

# Functional Requirements
- **FR-AI-001**: 시스템은 어플리케이션 부팅 및 초기화 라이프사이클 단계에서 사전에 빌드 가공된 FAISS Index 바이너리를 메모리에 고속 로드해야 한다.
- **FR-AI-002**: 외부 통신 커넥션 고갈을 보호하고 고속 처리를 유지하기 위해 개설되는 모든 추론 관련 API 핸들러 아키텍처는 `async` 비동기 기반 루프로 일관되어야 한다.
- **FR-AI-003**: 수신되는 모든 JSON 데이터 패킷은 Pydantic v2 가이드 스키마 유효성 검사 모듈을 필수 통과해야 한다.
- **FR-AI-004**: 사용자의 순수 입력 텍스트 데이터의 경계면 처리를 위해 특수 구분자 가드레일을 주입하는 Prompt Injection Shield 정책을 전면 적용해야 한다.
- **FR-AI-005**: 생성 완료된 리딩 결과물 텍스트는 최종 반환 직전 단계에서 비속어 및 자해, 전문 전문 분야 권고 오판 방지를 처리하는 Safety Filter 검사를 통과해야 한다.
- **FR-AI-006**: 모든 성공 결과 반환 JSON 규격 상위 노드에는 사후 데이터 추적용 프롬프트 버전 선언 구문(`prompt_version`)을 필수로 바인딩 포함해야 한다.
- **FR-AI-007**: 타로 카드의 문장 유사도 비교 처리를 위해 OpenAI text-embedding-3-small 규격 API 임베딩 생성 인프라를 사용해야 한다.
- **FR-AI-008**: 벡터 스토어 컨텍스트 검색 매커니즘은 코사인 유사도(Cosine Similarity) 연산 기반의 Top-K 알고리즘을 기본 채택하여 구동해야 한다.
- **FR-AI-009**: 원격 OpenAI API 일시 장애 및 순시 네트워크 단절 대응 목적에 기인하여 Exponential Backoff 메커니즘 기반의 비동기 자동 Retry 정책을 구현해야 한다.
- **FR-AI-010**: 프롬프트 명세 가이드라인에 의거하여, 검색 노출된 Retrieval Context 외의 정보를 임의로 지어내어 확장하지 않는 정보 생성 최소화 정책을 철저히 유지해야 한다.

---

# Key Entities (Data Schema Integration)

## TarotGenerateRequest (Pydantic 입력 스펙)
```json
{
  "user_content": "String (최소 10자, 최대 500자 제약 검증)",
  "cards": [15, 3, 21] // 정확히 length 3의 배열 구성 가드, 요소 범위 1 ~ 78
}

