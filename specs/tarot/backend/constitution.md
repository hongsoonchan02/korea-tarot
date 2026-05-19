# Mystic AI Tarot Backend Constitution

## Core Principles

### I. Layered Responsibility & Isolation
모든 비즈니스 로직은 역할과 책임에 따라 다음 계층 구조로 엄격히 분리되어야 한다.
- **controller**: HTTP 요청 매핑, 데이터 바인딩 밸리데이션 및 정형 응답 반환
- **service**: 비즈니스 도메인 정책 캡슐화 및 단일 데이터베이스 트랜잭션 마감
- **repository**: 데이터베이스(MySQL) 직접 접근 및 인덱스 기반 쿼리 수행
- **domain**: 비즈니스 핵심 규칙 및 속성을 가진 순수 영속 엔티티 객체
- **infra**: Redis 제어 및 외부 서비스(AI 서버) 연동 등 타 도메인과의 인프라 결합 격리
트랜잭션과 도메인 정책은 Service 레이어에서만 전담 처리하며, 외부 AI 서버 통신 인터페이스는 `infra/client` 계층으로 완전히 밀폐 격리한다.

### II. Fault-Tolerant Transaction
외부 AI 서버의 네트워크 다운 및 연동 장애가 메인 관계형 데이터베이스(MySQL)의 트랜잭션 무결성을 절대 훼손해서는 안 된다. 
AI 서버 통신 실패 시:
- 메인 데이터베이스 전체 롤백 대신
- 해당 상담 세션 상태값을 `FAIL`로 안전하게 퍼시스턴스화
- MDC 기반 Request ID가 매핑된 장애 상세 로그 기록
- 사용자에게 시스템 다운 대신 비즈니스적으로 정제된 대체 안내 예외 반환
을 기본 불변 정책으로 고수한다. 일시적인 네트워크 튐 현상을 방어하기 위해 AI 통신 실패 시 전체 타임아웃 범위 내 최대 1회의 재시도(Retry)를 유연하게 허용한다.

### III. Proactive Resource Protection
악성 페이로드 및 서비스 거부 공격(DoS)으로부터 백엔드 코어 스레드 리소스를 보호하기 위해 모든 API 진입점은 아래 가드를 순차 통과해야 한다.
- **JWT 인증**: Spring Security 필터 단에서의 무상태 인가 토큰 검증
- **Rate Limit**: Redis 인메모리 카운터를 이용한 사용자당 분당 API 호출 제한 가드
- **Validation**: Spring Validation 플러그인을 활용한 자수 및 공백 검증
- **Prompt Injection 방어**: 유저 텍스트 내 시스템 초기화 지시어 무효화 필터링
부하 인지 인프라 확립을 위해 Redis 기반 분당 호출 제한 메커니즘을 기본 공통 정책으로 사용한다.

### IV. Safe Data Lifecycle
사용자의 상담 이력 및 작성 고민 데이터는 민감한 개인 정보로 엄격히 간주한다.
시스템 내에서 발생하는 모든 사용자 삭제 요청은 테이블 행을 직접 제거하는 행위를 원천 금지하며, 물리 삭제(Hard Delete) 대신 논리 삭제 상태를 마킹하는 **Soft Delete** 방식으로만 처리한다. 데이터 유출 및 버그 방지를 위해 모든 SELECT 이력 조회 쿼리는 데이터베이스 검색 조건 레벨에 `deleted_at IS NULL` 조건을 기본 포함해야 한다.

### V. Observability & Traceability
분산 컨텍스트 및 마이크로 서비스 추적성 확보를 위해 모든 API 요청은 최초 인입 시 발급되는 고유 고 식별자 **Request ID(UUID)** 기반으로 추적 가능해야 한다.
백엔드 엔진 시스템은 운영 추적 효율화를 위해 아래 명세를 필수로 통합 기록해야 한다.
- **구조화 로그(JSON)**: 중앙 집중형 로그 수집 레이어를 위한 정형 로그 구조
- **Error Trace**: 예외 발생 지점의 스택 트레이스 완벽 캡슐화
- **Response Time**: 해당 클라이언트 API 총 레이턴시 시간 기록
- **AI 요청 시간**: 순수 외부 LLM 응답 지연 속도 독립 계측 기록

---

## Technical Constraints
- Framework: Spring Boot 3.x (Spring Boot 3.2+ 최신 마이너 버전 가이드 사양)
- Language: Java 21 (ES2023 자바 표준 명세 연동 가독성 코딩 가이드)
- Build Tool: Gradle 8.x
- Database: MySQL 8 (Storage Engine: InnoDB)
- Cache: Redis 7
- Security: Spring Security + JWT (io.jsonwebtoken 라이브러리 사양)
- ORM: Spring Data JPA (하이버네이트 내장 규격)
- External Communication: WebClient (Spring Reactive Web 내장 블로킹 우회 활용)
- Logging: Logback + MDC (멀티스레드 고유 컨텍스트 라벨링)
- Validation: Spring Boot Starter Validation (JSR-380 명세 어노테이션 구조)

---

## Development Workflow
1. 데이터 원자성 확립을 위해 사전에 데이터 스키마 DDL 및 ERD 구조 정의서 작성을 완료한다.
2. 컴파일러 의존성 계층 구조에 기인하여 **Entity ➔ Repository ➔ Service ➔ Controller** 순서로 하부 조직부터 차례로 개발을 상향 확장한다.
3. 데이터 신뢰성과 회귀 버그 원천 차단을 위해 구현되는 모든 API 라우터는 최소 1개 이상의 통합 테스트 코드를 강제 빌드한다.
4. 예외 케이스 핸들링 무결성 스펙 달성을 위해 외부 AI 연동 아키텍처는 코드 배포 전 `MockWebServer` 기반 가상 장애 시뮬레이션 테스트를 무조건 우선 선행 통과해야 한다.

---

## Governance
본 문서는 AI Tarot Backend 프로젝트의 최상위 기술 규범이다. 
보안 인증 구조 아키텍처, 핵심 데이터베이스 DDL 스키마 레이아웃, 외부 AI 통신 연동 약정 정책 변경 시 반드시 관련 문서 정밀 업데이트 및 파트 거버넌스 승인을 획득해야 한다.

**Version**: 3.0.0 | **Ratified**: 2026-05-19 | **Last Amended**: 2026-05-19