# Feature Specification: AI Tarot Backend Application

**Feature Branch**: `feat/tarot-backend-core`
**Created**: 2026-05-19
**Status**: Draft
**Input**: AI 기반 맞춤형 타로 상담 서비스 기획서 v1.1

---

# User Scenarios & Testing

## User Story 1 - 인증 기반 타로 상담 생성 (Priority: P1) 🎯 MVP
정상적으로 인증 절차를 통과한 유저가 본인의 고민 스트링과 고유 타로 카드 ID 3종 배열을 서버로 넘기면 백엔드는 유효 검증을 마친 후 외부 AI 추론망과 안전 통신을 수행하여 생성된 결과 가이드를 데이터베이스에 영속화하고 직렬화 JSON 상태로 클라이언트에 리턴한다.

### Why this priority
핵심 비즈니스 밸류 체인의 가장 중추적인 도메인이자 최초 기동 MVP 스펙의 핵심 필수 단위이다.

### Independent Test
유효 인가 스탬프가 찍힌 JWT 액세스 토큰을 HTTP Authorization Bearer 헤더에 탑재한 후 `POST /api/v1/tarot/readings` 엔드포인트를 호출 시, 데이터베이스 `tarot_reading`, `tarot_reading_card` 테이블에 성공 세션 데이터가 롤백 없이 안전 영속화되며 성공 데이터 블록이 정상 수신되는지 독립 통합 검증한다.

### Acceptance Scenarios
1. **Given** 클라이언트 세션에 유효 발급 처리된 JWT 인가 토큰이 헤더에 첨부되어 있을 때, **When** `/api/v1/tarot/readings` 경로로 규격 DTO Body 패킷을 송신하면, **Then** AI 검색 엔진이 도출한 해석 텍스트 리딩 결과 데이터를 200 OK 코드와 함께 가독성 있게 반환한다.
2. **Given** 사용자가 기입한 고민 본문 내용이 원천 공백 상태이거나 순수 가독 문자 수가 10자 미만의 조건 미달을 일으킬 때, **When** 컨트롤러 단 진입 요청이 발생하면, **Then** 비즈니스 코어 스레드로 넘기지 않고 `400 Bad Request (Validation Error)` 표준 에러 JSON 구조를 리턴한다.

---

## User Story 2 - 장애 대응 및 요청 제한 (Priority: P2)
폭발적인 연속 API 부하 공격 상황에서 서비스 커넥션 자원을 사수하고, 외부 AI 시스템 연동 마비 상황에서도 유저 트랜잭션 먹통 전이 리스크를 완벽하게 차단한다.

### Acceptance Scenarios
1. **Given** 동일한 유저 고유 식별 컨텍스트가 1분 이내 주기에 이미 3회의 정상 상담 생성을 완료했을 때, **When** 추가적인 4번째 타로 리딩 요청 패킷을 인입시키면, **Then** 백엔드 코어 비즈니스를 수행하지 않고 인터셉터 레이어에서 즉시 `429 Too Many Requests` 상태 코드로 패킷을 즉각 드롭 차단한다.
2. **Given** 외부 AI 서비스의 서버 다운이나 망 혼잡으로 인해 연동 응답 지연이 발생할 때, **When** 규정된 서킷 가드 임계 타임아웃 시간(총 15초)을 초과하게 되면, **Then** 기존 트랜잭션을 전면 롤백하지 않고 레코드 상태 필드를 `FAIL`로 안전하게 퍼시스턴스 격리 적재한 후 사용자에게는 `503 Service Unavailable` 정제 예외 포맷을 반환한다.

---

## User Story 3 - 상담 이력 조회 및 삭제 (Priority: P3)
사용자는 과거 본인이 진행하였던 타로 리딩 상담 카드 목록 이력을 유연하게 페이지 단위로 열람할 수 있어야 하며, 개인의 사생활 보호를 위해 특정 히스토리 항목을 화면에서 보이지 않게 제거 제어할 수 있다.

### Acceptance Scenarios
1. **Given** 사용자가 마이페이지 상담 기록 페이지 조회를 트리거했을 때, **When** 페이지 번호 및 사이즈 세션 인자가 인입되면, **Then** 과거 삭제 처리(`deleted_at IS NOT NULL`)된 행을 완벽히 소거 필터링하고 오직 `deleted_at IS NULL` 상태인 정상 레코드만 최신 생성일자 순서로 페이징 슬라이스 규격에 맞춰 반환한다.
2. **Given** 특정 상담 이력 ID 지정 삭제(`DELETE /api/v1/tarot/readings/{id}`) 패킷을 수신했을 때, **When** 해당 데이터 엔티티 레코드의 유저 소유권 검증 레이어가 성공을 마크하면, **Then** 물리 행을 지우지 않고 `deleted_at` 컬럼에 실행 기점의 실시간 타임스탬프 일시 데이터를 안전하게 기입(Soft Delete) 갱신한다.

---

# Functional Requirements
- **FR-BE-001**: 시스템은 모든 코어 웹 라우터 전면에 Spring Security 및 JWT 디코딩 필터 가드를 바인딩하여 무상태 인증 보안 체계를 상시 유지해야 한다.
- **FR-BE-002**: 타로 생성 엔드포인트 진입 직전 단계에서 Redis 인메모리 스토어의 `INCR` 연산 및 TTL 만료 스크립트를 결합 활용하여 유저 ID별 분당 최대 3회로 제어되는 Rate Limit 정책을 적용해야 한다.
- **FR-BE-003**: 사용자의 입인 고민 문구 밸리데이션 검증은 Spring Validation 어노테이션 컴포넌트를 이용해 글자 수 유효 제한 가드를 철저히 적용해야 한다.
- **FR-BE-004**: AI 외부 연동 통신의 최종 차단 임계 타임아웃 한계 시간은 최대 **15000ms**로 강제 제한하며, 개별 시도당 ReadTimeout 속성은 **7000ms** 단위로 쪼개어 구성한다.
- **FR-BE-005**: 영속 데이터 라이프사이클 보호 정책에 기인하여 모든 상담 취소 및 제거 명세는 하이버네이트 레벨의 `@SQLRestriction` 글로벌 필터 기반 Soft Delete 아키텍처를 강제 적용해야 한다.
- **FR-BE-006**: AI 통신 네트워크 단절 및 일시적 5xx 서버 에러 발생 시, WebClient 내부 팩토리를 통해 최대 1회에 한정된 지연 재시도(Retry) 매커니즘을 동기 수행해야 한다.
- **FR-BE-007**: 인프라 가시성 확보 목적에 의거하여 모든 클라이언트 인입 API 요청 쓰레드에는 MDC 필터를 거쳐 Request ID(UUID) 가 라벨링된 로그 추적 레이어가 상시 구동되어야 한다.

---

# Key Entities (Database Schema Mapping)

## User (회원 코어 테이블)
- `user_id` (BIGINT, PK, Auto Increment)
- `email` (VARCHAR(100), NOT NULL, Unique)
- `password` (VARCHAR(255), NOT NULL)
- `nickname` (VARCHAR(50), NOT NULL)
- `created_at` (TIMESTAMP, NOT NULL)
- `updated_at` (TIMESTAMP, NOT NULL)

## TarotReading (타로 리딩 세션 테이블)
- `reading_id` (BIGINT, PK, Auto Increment)
- `user_id` (BIGINT, NOT NULL, FK 매핑 및 단독 검색 성능 향상용 단일 인덱스 부여)
- `user_content` (VARCHAR(500), NOT NULL)
- `ai_response` (TEXT, NULL 허용 - 생성 실패 케이스 가드 전용)
- `status` (VARCHAR(20), NOT NULL) -> `TarotStatus` 이넘 규격 바인딩
- `prompt_version` (VARCHAR(20), NOT NULL) -> AI 프롬프트 트래킹용 버전 명세
- `response_time` (INT) -> 밀리세컨드 단위 백엔드 레이턴시 로깅 스펙
- `created_at` (TIMESTAMP, NOT NULL)
- `updated_at` (TIMESTAMP, NOT NULL)
- `deleted_at` (TIMESTAMP, NULL 허용 - Soft Delete 연동 필드)

## TarotReadingCard (상담 세션별 선택 카드 매핑 교차 테이블)
- `id` (BIGINT, PK, Auto Increment)
- `reading_id` (BIGINT, NOT NULL, FK) -> 복합 인덱스 설정 클러스터링 가이드
- `card_id` (INT, NOT NULL) -> 고유 카드 식별 넘버 (1 ~ 78)
- `card_order` (INT, NOT NULL) -> 선택 순서 인덱스 (1: 과거, 2: 현재, 3: 미래)

## TarotStatus (상담 영속 상태 상태값 명세)
```java
public enum TarotStatus {
    PROCESSING, // LLM 분석 스레드 생성 대기 상태
    SUCCESS,    // AI 리딩 텍스트 무결 수신 및 복구 저장 완료
    FAIL        // 타임아웃 및 AI 인프라 붕괴 격리 처리 상태
}