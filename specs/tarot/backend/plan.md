# Implementation Plan: AI Tarot Backend Application

**Branch**: `feat/tarot-backend-core`  
**Date**: 2026-05-19  
**Spec**: `/specs/tarot/backend/spec.md`

---

# Summary
본 프로젝트는 현대 엔터프라이즈 환경에 완벽 최적화된 Spring Boot 3.x 기틀과 Java 21 LTS 런타임을 코어 엔진으로 결합 배포하여, 안정적이고 선형 확장이 담보된 웹 서비스 애플리케이션 백엔드를 구축한다. 
Spring Security 및 무상태 JWT 토큰 아키텍처를 기반으로 기밀성 높은 분산 인증 방어벽을 설계하고, 비동기 리액티브 라이브러리인 WebClient를 활용한 Fail-safe 서킷 격리를 도입하여 외부 인프라 성능 가변 상황에서도 MySQL 코어 시스템의 고가용성 및 무결 데이터 보존 구조를 완벽하게 정착시키는 것을 핵심 메인 비전으로 수립한다.

---

# Technical Context

**Language/Version**:
Java 21 (Record 클래스 문법 적극 활용 및 모던 스트림 파이프라인 아키텍처 표준화 가이드)

**Primary Dependencies**:
Spring Boot 3.x, Spring Security, Spring Data JPA, Spring Boot Starter Validation, Spring Cloud OpenFeign 또는 WebClient (Spring WebFlux), Spring Boot Starter Data Redis, io.jsonwebtoken (JWT v0.12+), Flyway, Lombok

**Storage**:
MySQL 8 (Storage Engine: InnoDB / 메인 가용 영속 데이터 보존고), Redis 7 (분당 부하 제어 및 만료 관리용 초고속 인메모리 스토어)

**Testing**:
JUnit5, Mockito, AssertJ, SpringBootTest (통합 엔드포인트 검증 및 레이어 아키텍처 고립 슬라이스 테스트 프레임워크)

**Target Platform**:
Linux Ubuntu OS 베이스 컨테이너라이제이션 Docker 웹 서버 환경

**Project Type**:
REST API Backend Web Service

**Performance Goals**:
Redis 필터 타임 5ms 이내 수렴, 단일 로컬 데이터베이스 딜레이 커밋 50ms 미만 사수, 복합 인덱스 설정을 통한 페이징 목록 서칭 처리 속도 10ms 한계점 제어

**Constraints**:
AI 인터페이스 통신 한계 임계 시간 15000ms 하드 락 제어 (ReadTimeout 7000ms 분할 후 최대 1회 Retry 유기적 가동), 전 테이블 Soft Delete 전면 필수 아키텍처 제약 조건 할당

---

# Constitution Check
- 모든 WebClient AI 외부 연동 파이프라인에 익셉션 가치 가드 앤 `TarotStatus.FAIL` 갱신 로직 반영 완료 계획 점검 (Constitution I, II 통과)
- 스프링 시큐리티 인증 필터 체인 직후 및 MVC 인터셉터 레이어 단에 Redis `INCR` 횟수 빈도 계측 모듈 인프라 배치 구조 확인 (Constitution III 통과)
- 하이버네이트 어노테이션 명세를 기반으로 한 글로벌 `deleted_at IS NULL` 자동 소거 쿼리 인젝션 가이드 확인 (Constitution IV 통과)
- Logback 파일 연동 인터셉터를 이용한 쓰레드 로컬 Request ID MDC 컨텍스트 파이프라인 정착 유무 파악 (Constitution V 통과)

---

# Project Structure

```text
backend/
├── build.gradle                 # 애플리케이션 코어 라이브러리 및 빌드 형상 명세 파일
└── src/
    ├── main/
    │   ├── java/com/mystic/tarot/
    │   │   ├── app/
    │   │   │   ├── config/      # Redis, Data JPA Audit, Security 전반 기술 인프라 환경 설정 명세
    │   │   │   └── security/    # JWT 프로바이더 유틸 및 커스텀 인증 엔트리포인트 가드 체인
    │   │   ├── common/
    │   │   │   ├── exception/   # 글로벌 전역 예외 처리 컨트롤러 어드바이스 및 비즈니스 에러 셋
    │   │   │   ├── response/    # API 표준 포맷 선언 전용 정형 데이터 래퍼 클래스 패키지
    │   │   │   └── util/        # 문자열 정제, 콤마 파싱 및 Request ID 라벨링 컴포넌트
    │   │   ├── auth/            # [회원 관리 독립 도메인 패키지]
    │   │   │   ├── controller/
    │   │   │   ├── service/
    │   │   │   ├── repository/
    │   │   │   ├── domain/      # User 엔티티 배치 영역
    │   │   │   └── dto/
    │   │   ├── tarot/           # [타로 상담 코어 도메인 패키지 - 기획 응집도 향상을 위해 히스토리 도메인 통합 반영]
    │   │   │   ├── controller/  # Tarot 및 History API 통합 컨트롤 영역
    │   │   │   ├── service/     # 생성, 페이징 이력 조회, Soft Delete 통합 비즈니스 레이어
    │   │   │   ├── repository/  # TarotReading, TarotReadingCard JPA CRUD 레포지토리
    │   │   │   ├── domain/      # TarotReading, TarotReadingCard 엔티티 배치 영역
    │   │   │   ├── dto/         # Request, Response, History Paging 용 통합 DTO 스펙트럼
    │   │   │   └── enums/       # TarotStatus 이넘 명세 관리 컴포넌트
    │   │   └── infra/           # [외부 시스템 연동 결합 격리 하부 패키지]
    │   │       ├── ai/          # MockWebServer 대비 WebClient 인프라 통신 클라이언트 정의
    │   │       └── redis/       # RedisTemplate 직접 튜닝 기반 Rate Limit 인메모리 관리 유닛
    │   └── resources/
    │       ├── application.yml  # 데이터베이스 URL 자격 증명 및 타임아웃 환경 사양 설정 캡슐화 명세
    │       └── db/migration/     # Flyway 버전 제어용 초기화 DDL 형상 관리 저장고