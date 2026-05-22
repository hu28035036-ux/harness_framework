# Architecture Decision Records

## 철학
빠른 MVP를 우선하되, 배포, 인증, DB, 파일 스토리지, PC 앱, 녹화 엔진은 계약 뒤에 숨겨 추후 교체 비용을 낮춘다.

---

### ADR-001: Next.js + TypeScript strict 선택
**결정**: 웹과 API는 Next.js 15 App Router와 TypeScript strict mode로 구현하고 Vercel Pro에 배포한다.
**이유**: Supabase 연동과 API Route 운영이 단순하고, Vercel Pro 기준으로 프리뷰/운영 배포를 안정적으로 나눌 수 있다.
**트레이드오프**: 초기에는 Vercel 런타임 제약과 비용 구조를 고려해야 한다.

### ADR-002: Supabase Pro 기준 DB/Auth/Storage
**결정**: DB는 Supabase Postgres, 인증은 Supabase Auth, 1차 파일 저장은 Supabase Storage로 구현한다.
**이유**: MVP에서 인증, DB, 파일 저장, 운영 콘솔을 빠르게 확보할 수 있다.
**트레이드오프**: Supabase 권한/RLS/Storage 정책을 초기에 엄격히 설계해야 한다.

### ADR-003: Python + PySide6 PC 프로그램
**결정**: 기사 PC 프로그램은 Python + PySide6 + FFmpeg로 구현한다.
**이유**: Windows 데스크톱 도구, FFmpeg 실행, 로컬 파일 복구, 단축키 처리를 Python 생태계에서 빠르게 구현할 수 있다.
**트레이드오프**: 웹 UI 컴포넌트 재사용은 포기하고, API/타입 계약으로 웹과 PC를 연결한다.

### ADR-004: FFmpeg RecordingBackend 분리
**결정**: FFmpeg는 Python `RecordingBackend` 구현체로 격리한다.
**이유**: 녹화 명령, 대상 선택, 테스트 녹화를 PC 작업 흐름에서 분리해 추후 Windows Graphics Capture 등으로 교체할 수 있게 한다.
**트레이드오프**: 초기 인터페이스 설계와 테스트 더블이 필요하다.

### ADR-005: Supabase Storage 우선, R2 확장 가능
**결정**: 캡처/클립은 로컬 저장 후 1차로 Supabase Storage에 업로드한다. 대용량 영상 증가 시 `ObjectStorage` 계약으로 R2를 분리한다.
**이유**: MVP 운영은 Supabase 하나로 단순화하고, 영상 비용/트래픽이 커지면 저장소만 분리하기 위해서다.
**트레이드오프**: 파일 key, signed URL, metadata, lifecycle 정책을 저장소 독립적으로 설계해야 한다.

### ADR-006: 서버 정책 검증
**결정**: 권한, 홍보글 10분 제한, 게시 가능 상태, 평점 토큰은 서버에서 검증한다.
**이유**: UI 제한만으로는 정책 우회가 가능하다.
**트레이드오프**: API 테스트가 MVP 초반부터 필요하다.
