# Tasks: AI Tarot Backend Application

## Phase 1: Setup (Shared Infrastructure)
**Purpose**: 프로젝트 코어 프레임워크 초기화 및 Gradle 의존성 구성, 마이그레이션 도구 및 기본 인프라 환경 구축

- [ ] **T001** Java 21 및 Spring Boot 3.x 가이드 기반 기본 스켈레톤 아키텍처 구성 및 `build.gradle` 핵심 외부 패키지 명세 셋업 (`backend/build.gradle`)
- [ ] **T002** [P] MySQL 및 HikariCP 커넥션 풀 속성 인자, Redis 엔드포인트 포트 세션 동기화 환경 정보 구축 (`backend/src/main/resources/application.yml`)
- [ ] **T003** [P] JSR-380 스펙 대응을 위한 Spring Boot Starter Validation 및 컴파일러 보일러플레이트 제어용 롬복 플러그인 컴파일 연동 사양 구성
- [ ] **T004** io.jsonwebtoken 모듈 기반 JWT 토큰 클레임 파싱, 발급 및 복호화 유효 추적을 전담할 유틸 프로바이더 클래스 빌드 (`backend/src/main/java/com/mystic/tarot/app/security/JwtTokenProvider.java`)
- [ ] **T005** RedisTemplate 환경 구성 및 직렬화 팩토리 빈 등록 설정 클래스 구축 (`backend/src/main/java/com/mystic/tarot/app/config/RedisConfig.java`)
- [ ] **T006** 데이터베이스 형상 관리 자동화를 위한 Flyway 플러그인 환경 통합 설정 셋업

---

## Phase 2: Foundational & Security Authorization (의존성 모순 해결을 위한 Auth 선행 구성)
**Purpose**: 회원가입/로그인 및 인증 필터, 글로벌 예외 처리기, 공통 응답 구조 등 비즈니스 시나리오 가동을 위한 핵심 방어 레이어 완비

- [ ] **T007** 유저 엔티티 JPA 어노테이션 맵핑 및 초기 DDL Flyway 마이그레이션 스크립트 파일 작성 후 반영 (`backend/src/main/resources/db/migration/V1__init_user_table.sql`)
- [ ] **T008** 회원 관리 도메인을 담당할 회원가입 및 로그인, 토큰 재발급/로그아웃 비즈니스 서비스 계층 및 레포지토리 레이어 통합 구현 (`backend/src/main/java/com/mystic/tarot/auth/`)
- [ ] **T009** `/api/v1/auth/**` 라우터를 개설하여 인증 예외 처리가 확보된 계정 컨트롤러 및 DTO 통신 마감 (`backend/src/main/java/com/mystic/tarot/auth/controller/AuthController.java`)
- [ ] **T010** Spring Security 가드 인터페이스 체인 연동 및 인가 처리를 위한 전면 `JwtAuthenticationFilter` 게이트웨이 컴포넌트 개발 (`backend/src/main/java/com/mystic/tarot/app/security/JwtAuthenticationFilter.java`)
- [ ] **T011** `@RestControllerAdvice` 기반 통합 글로벌 에러 핸들러 구성 및 정형화된 JSON 성공/실패 공통 응답 래퍼 클래스 정의 (`backend/src/main/java/com/mystic/tarot/common/exception/GlobalExceptionHandler.java`)
- [ ] **T012** 인입 요청 쓰레드 로컬에 UUID 고유 식별 컨텍스트를 주입하고 해제하여 모니터링 가시성을 보장해주는 MDC 기반 Request ID 로깅 필터 구현 (`backend/src/main/java/com/mystic/tarot/common/util/MdcLoggingFilter.java`)

**Checkpoint**: 핵심 보안 인증 및 공통 파운데이션 인프라 완료. 이제 선행 모순 리스크 없이 도메인 비즈니스 태스크에 직접 착수할 수 있습니다.

---

## Phase 3: User Story 1 (P1) - 인증 기반 타로 상담 생성 🎯 MVP
**Goal**: 유저의 고민과 카드 명세를 받아 유효성을 판단하고 AI 통신 및 정상 영속 커밋을 관통하는 MVP 핵심 파이프라인 개설

- [ ] **T013** 타로 영속 세션 관리를 위한 `tarot_reading`, `tarot_reading_card` 테이블 DDL 작성 및 플라이웨이 형상 추가 (`backend/src/main/resources/db/migration/V2__create_tarot_tables.sql`)
- [ ] **T014** JPA 영속성 어노테이션을 기반으로 한 `TarotReading` 및 `TarotReadingCard` 도메인 엔티티 관계 맵핑 및 Repository 구현 (`backend/src/main/java/com/mystic/tarot/tarot/domain/`)
- [ ] **T015** 10자 미만 및 공백, 프롬프트 인젝션 우회 문구를 정규식 기반으로 1차 필터 차단해주는 Zod 사양 대응 스프링 밸리데이션 데이터 요청 DTO 설계
- [ ] **T016** 개별 호출당 `7000ms` ReadTimeout 설정 조건이 내장된 비동기 기반 AI 통신 전용 WebClient 인프라 콤포넌트 구축 (`backend/src/main/java/com/mystic/tarot/infra/ai/AiServiceClient.java`)
- [ ] **T017** 수신된 고민 데이터 검증 후 AI 클라이언트 통신을 중개 완료하여 영속 락을 실행해주는 핵심 상담 생성 서비스 구현 (`backend/src/main/java/com/mystic/tarot/tarot/service/TarotService.java`)
- [ ] **T018** 인증 인가 보호막 사양이 탑재된 상담 생성 HTTP 라우터 개설 및 API 컨트롤러 마운트 완료 (`backend/src/main/java/com/mystic/tarot/tarot/controller/TarotController.java`)

**Checkpoint**: User Story 1 마감. MockWebServer 연동 통합 환경 테스트 수행을 위한 클라이언트 및 DB 구조 세팅 통과.

---

## Phase 4: User Story 2 (P2) - 장애 대응 및 요청 제한
**Goal**: 시스템 부하 분출 및 AI 추론 서버 붕괴 리스크 감지 시 트랜잭션 고갈을 보호할 Fail-safe 복구 로직 보완

- [ ] **T019** Redis Template 인메모리 `INCR` 가동 스크립트를 기반으로 특정 유저 키당 분당 3회 초과 접근 시 즉각 `429 Too Many Requests` 예외를 던지는 Rate Limit 인터셉터 구현 및 등록 (`backend/src/main/java/com/mystic/tarot/infra/redis/RedisRateLimitService.java`)
- [ ] **T020** WebClient 파이프라인 내부에 `.retryWhen()` 리액티브 선언 문구를 마운트하여 1차 네트워크 지연 및 순시 에러 발생 시 최대 1회 한정 지연 리트라이 정책 강제 구현
- [ ] **T021** 최종 누적 타임아웃 15초(`15000ms`)를 돌파할 경우, 전체 DB 롤백을 스킵하고 예외를 가로채어 해당 레코드 필드값을 `status = FAIL`로 강제 안전 커밋 갱신 마감하는 트랜잭션 복구 로직 구현
- [ ] **T022** 외부 연동 붕괴 확정 시 글로벌 핸들러와 연동하여 유저에게 최종 정제 포맷의 `503 Service Unavailable` JSON 객체를 전달하는 에러 응답 로직 마감

---

## Phase 5: User Story 3 (P3) - 상담 이력 조회 및 삭제
**Goal**: Soft Delete 매커니즘이 강제 포함된 데이터 목록 최적 인덱스 페이징 조회 및 소유권 확인 논리 삭제 API 마감

- [ ] **T023** `TarotReading` 도메인 엔티티 상단에 `@SQLRestriction("deleted_at IS NULL")` 하이버네이트 구문을 선언하여 모든 엔티티 쿼리 발생 시 삭제 행이 자동 배제되도록 조치
- [ ] **T024** 마이페이지용 `Pageable` 및 인덱스 쿼리를 수용하여 기획서 스펙 규격대로 최신순 정렬 리스트 데이터를 인출하는 Data JPA 레포지토리 쿼리 메서드 최적화 구현
- [ ] **T025** 특정 히스토리 단일 삭제 액션 요청 인입 시 토큰의 유저 ID 식별값과 해당 데이터의 소유권을 일치 확인한 뒤 `deleted_at = NOW()`로 변경해주는 Soft Delete 논리 삭제 로직 구현
- [ ] **T026** 마이페이지 이력 리스트 열람[GET] 및 단일 논리 삭제[DELETE] 라우터 엔드포인트를 개설하고 기존 TarotController 내부 하위 파트로 결합 마감

---

## Phase 6: Polish & Performance Optimization
**Purpose**: 영속성 탐색 스피드 향상을 위한 데이터베이스 튜닝 및 엔드투엔드 최종 아티팩트 빌드 검증

- [ ] **T027** 마이페이지 다량 조회 조건절 최적화를 위해 MySQL `user_id` 및 `created_at` 컬럼 레이아웃 기준의 복합 인덱스(Composite Index) 추가 마이개레이션 스크립트 빌드
- [ ] **T028** JUnit5 및 Mockito 프레임워크를 동작시켜 외부 인프라 타임아웃 붕괴 상황에 대비한 `MockWebServer` 가상 장애 주입 모킹 통합 테스트 코드 개발
- [ ] **T029** 로깅 포맷 가이드를 Logback 환경에 연동하여 JSON 형태의 구조화된 정형화 로그 포맷 셋업 완료 및 멀티스테이지 Dockerfile 빌드 스크립트를 통한 jar 아티팩트 가동 유무 검증