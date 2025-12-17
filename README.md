# LINKompany

기업과 기업의 관계를 연결해 탐색하고, 뉴스/공시 기반으로 인사이트를 확인할 수 있는 **Next.js 프론트엔드**입니다.

## 주요 기능

- **홈**: 주요 기업 리스트/가격 정보
- **검색**: 뉴스/기업 통합 검색, 결과 탭(뉴스/기업)
- **기업 상세**
  - 기업 정보 및 관련 데이터 조회
  - **관계도(Network Graph)** 시각화 (IN/OUT/ALL 경로 선택)
  - **워드클라우드(Word Cloud)** 시각화
  - 공시(Announcement) / 연관 뉴스 이동
- **뉴스 상세**: 뉴스 본문/메타 정보 확인

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **UI**: Tailwind CSS, Radix UI(Tooltip), Sonner(toast)
- **Data Fetching/State**: @tanstack/react-query
- **Visualization**: reagraph(관계도), @visx/wordcloud(워드클라우드)
- **Package Manager**: pnpm

## 프로젝트 구조

```text
src/
  app/                    # Next.js App Router (route/page/layout)
    api/                  # Next.js API route(프록시/유틸 목적) 디렉토리
    company/[companyId]/  # 기업 상세 페이지
    news/[newsId]/        # 뉴스 상세 페이지
    search/               # 검색 페이지
  components/             # 재사용 컴포넌트(UI 포함)
  containers/             # 페이지 단위 컨테이너(서버/클라이언트 분리)
  hooks/                  # 커스텀 훅(React Query 등)
  service/                # API 호출(fetch) 모음
  types/                  # API/도메인 타입
  lib/                    # 유틸(포맷, 정렬, 검증 등)
```

## 환경 변수

이 프로젝트는 API Base URL을 환경변수로 주입받습니다.

- **`SERVICE_URL`**: 서버 컴포넌트/서버 측 fetch에서 사용하는 백엔드 Base URL
  - 예: `https://api.example.com/api/v1`
- **`NEXT_PUBLIC_SERVICE_URL`**: 브라우저(클라이언트)에서 사용하는 백엔드 Base URL
  - 예: `https://api.example.com/api/v1`

로컬 개발용 예시:

```bash
export SERVICE_URL="http://localhost:8080/api/v1"
export NEXT_PUBLIC_SERVICE_URL="http://localhost:8080/api/v1"
```

## 실행 방법 (로컬)

의존성 설치:

```bash
pnpm install
```

개발 서버 실행:

```bash
pnpm dev
```

프로덕션 빌드/실행:

```bash
pnpm build
pnpm start
```

## API 프록시(rewrites) 동작

`next.config.mjs`에서 **개발 환경(`NODE_ENV=development`)** 일 때만 아래 rewrite를 적용합니다.

- `GET /api/v1/:path*` → `${SERVICE_URL}/:path*`

즉, 개발 중에는 프론트에서 `/api/v1/...`로 호출하면 백엔드로 프록시될 수 있습니다.

## Docker 실행

이 레포는 멀티 스테이지 Dockerfile을 사용하며, 빌드 시점에 API URL을 `--build-arg`로 주입합니다.

빌드:

```bash
docker build \
  --build-arg SERVICE_URL="https://api.example.com/api/v1" \
  --build-arg NEXT_PUBLIC_SERVICE_URL="https://api.example.com/api/v1" \
  -t linkompany-frontend .
```

실행:

```bash
docker run --rm -p 3000:3000 linkompany-frontend
```

## 스크립트

- **`pnpm dev`**: 개발 서버 실행
- **`pnpm build`**: 프로덕션 빌드
- **`pnpm start`**: 프로덕션 실행
- **`pnpm lint`**: ESLint 실행
