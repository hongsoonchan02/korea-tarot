# Implementation Plan: AI Tarot AI-Service

**Branch**: `feat/tarot-ai-core`  
**Date**: 2026-05-19  
**Spec**: `/specs/tarot/ai-service/spec.md`

---

# Summary
본 프로젝트는 현대 비동기 파이썬 에코시스템의 고성능 표준인 FastAPI 기틀 위에 가볍고 견고한 AI 추론 전용 마이크로서비스 엔진을 구축한다. 
LangChain RAG 프레임워크와 메모리 내 바이너리 구조로 직접 연동되는 CPU 최적화 FAISS 로컬 벡터 스토어를 결합하여 외부 네트워크 홉 지연이 배제된 초고속 유사도 검색 컨텍스트 아키텍처를 수립한다. `prompt-spec.md` 버전 v5.0.0 명세 지침에 완벽히 정합하는 4단 분할 구조화 JSON 데이터 직렬화 파이프라인을 관통 구현하여 고품질의 안전한 타로 리딩 결과를 정형 공급하는 것을 마스터 비전으로 선언한다.

---

# Technical Context

## Runtime
Python 3.11+ / 3.12 런타임 환경 (비동기 루프 및 스레드 풀 가속화 버전 프로파일)

## Primary Dependencies
FastAPI, Uvicorn, langchain, faiss-cpu, openai (v1.x 이상 비동기 사양), pydantic (v2.x 사양 표준), python-dotenv, numpy, tiktoken, structlog, httpx

## OpenAI Stack
- **LLM 추론 엔진**: gpt-5.4-mini (구조화 정형 JSON 출력 최적 대응 사양)
- **Embedding 벡터 엔진**: text-embedding-3-small (1536 차원 구조)

## Vector Pipeline
원천 JSON 가이드 문서화 ➔ 데이터 청킹(Chunking) ➔ OpenAI 임베딩 변환 ➔ 로컬 FAISS 바이너리 인덱싱 빌드 ➔ 카드 ID 대응 코사인 유사도 Top-K Retrieval ➔ 구조화 JSON 프롬프트 어셈블리 ➔ LLM 분할 추론 및 파싱 ➔ 가드레일 유효성 최종 출력

## Storage
로컬 정적 영속화 파일 기반 FAISS Vector Index (`.index`), 데이터 원천 보존고인 Local Tarot Documents JSON

## Testing
pytest, pytest-asyncio, httpx 비동기 테스트 클라이언트 모듈

## Performance Goals
FAISS 로컬 컨텍스트 유사 매칭 2ms 이하 수렴, Zod 사양 대응 Pydantic 스키마 가드 밸리데이션 처리 레이턴시 10ms 이하 마감 사수

---

# Project Structure

```text
ai-service/
├── requirements.txt             # 파이썬 가상환경 빌드용 코어 의존성 패키지 명세
├── .env.template                # OpenAI 자격 토큰 은닉 파라미터 구성 템플릿
└── src/
    ├── app/
    │   ├── main.py              # FastAPI 웹 앱 초기화 및 ASGI 데몬 엔트리포인트
    │   ├── config.py            # Pydantic BaseSettings 연동 환경 변수 인프라 주입 모듈
    │   └── middleware/          # UUID Request ID 라벨링 및 로깅 연동 미들웨어 파트
    ├── api/
    │   └── routes/              # 생성 엔드포인트 `/api/v1/ai/generate` 바인딩 라우터
    ├── schemas/                 # 4단 분할 JSON 사양이 반영된 입출력 Pydantic 모델 명세
    ├── services/
    │   ├── rag_service.py       # LangChain 파이프라인 제어 및 RAG 비즈니스 총괄 서비스
    │   ├── prompt_service.py    # prompt-spec.md 연동 프롬프트 조립 컴포넌트
    │   ├── retrieval_service.py # FAISS 바이너리 기반 코사인 유사도 연산 탐색 서비스
    │   └── safety_service.py    # 비속어 및 전문 권고 오판 추적 소거 가드레일 서비스
    ├── core/
    │   ├── prompts/             # 불변 선언형 시스템 프롬프트 파일 저장소 (v5.0.0 사양)
    │   ├── security/            # Prompt Injection 차단 정규식 및 입력 세니타이징 쉴드
    │   └── logging/             # structlog 기반 JSON 구조화 로깅 환경 명세 클래스
    ├── infra/
    │   ├── openai/              # AsyncOpenAI 클라이언트 선언 및 백오프 재시도 설정 모듈
    │   ├── vector/              # 로컬 `.index` 바이너리 파일 I/O 디바이스 로더
    │   └── cache/               # 중복 추론 성능 방어용 경량 인메모리 캐싱 파트
    ├── data/                    # 78장 타로 가이드 원천 데이터 셋 보존 폴더
    ├── tests/                   # 비동기 pytest 스크립트 및 MockWebServer 모킹 테스팅 풀
    └── scripts/
        └── build_index.py       # 원천 소스 최초 가공 벡터 인덱싱 생성 자동화 유틸 스크립트