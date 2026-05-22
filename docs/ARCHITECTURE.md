# 아키텍처

## 시스템 구조
```text
손님 웹 클라이언트
  -> Next.js API 서버 on Vercel Pro
  -> Supabase Pro (Postgres/Auth/Storage)

기사 Python + PySide6 프로그램
  -> Next.js API 서버
  -> 로컬 저장소
  -> RecordingBackend
  -> FFmpeg
  -> Supabase Storage

추후 영상 증가 시
  -> ObjectStorage 계약 유지
  -> 대용량 영상만 Cloudflare R2 bucket으로 분리
```

## 디렉터리 구조
```text
src/
  app/                 # 페이지와 API 라우트
  components/          # 재사용 UI
  domain/              # 상태 전이, 정책, 순수 도메인 규칙
  server/              # Supabase 서버 클라이언트, 인증, 업로드, 서버 전용 서비스
  storage/             # Supabase Storage/R2 전환용 ObjectStorage 계약
  types/               # 공유 타입
  test/                # 테스트 유틸
supabase/
  migrations/          # Supabase SQL migrations
desktop/
  zzallog/             # Python + PySide6 PC 프로그램
  tests/               # pytest 기반 PC 프로그램 테스트
phases/
  */step*.md           # 하네스 구현 단계
```

## 데이터 흐름
- 웹 탐색: 사용자 입력 -> 페이지/컴포넌트 -> API Route -> 서버 서비스 -> Supabase Postgres/Auth/Storage -> UI.
- 작업 시작: PySide6 입력 -> API 세션 생성 -> 로컬 `session.json` 생성 -> 시작 클립 녹화 -> 업로드 큐.
- 인증캡처: F8/버튼 -> 캡처 + 오버레이 합성 -> 로컬 저장 -> Supabase Storage 업로드 큐 -> 임시 인증게시글 반영.
- 최종 게시: 필수 자료 검증 -> 업로드 실패 여부 확인 -> 인증게시글 게시 -> 손님 링크 생성.
- 복구: 프로그램 실행 -> `recovery_state.json`와 `upload_queue.json` 로드 -> 미게시 작업/업로드 대기 복구.
- 저장소 확장: `ObjectStorage` 구현체를 `SupabaseObjectStorage`에서 `R2ObjectStorage` 또는 하이브리드 라우터로 교체한다.

## 상태값
- 세션: `draft`, `recording_start`, `in_progress`, `paused`, `held`, `resumed`, `completed`, `cancelled`, `deleted`.
- 인증게시글: `draft`, `assets_uploading`, `ready_to_publish`, `published`, `rating_pending`, `rated`, `deleted`.
- 파일: `none`, `recording`, `uploading`, `uploaded`, `failed`, `local_saved`, `retry_pending`.
- 기사: `pending`, `approved`, `rejected`, `suspended`.

## 공용 인터페이스
- `RecordingBackend.record_clip(session_id, clip_type, target, duration_sec, output_path)`.
- `CaptureService.captureWithOverlay(session, source, outputPath)`.
- `UploadQueue.enqueue(asset)`, `retryPending()`, `restoreFromDisk()`.
- `ObjectStorage.putObject(bucket, key, file, metadata)`, `createSignedUrl(bucket, key, expiresIn)`, `deleteObject(bucket, key)`.
- `SupabaseServerClient.forServiceRole()`, `SupabaseBrowserClient.forAnonSession()`.
- `UpdateService.checkVersion()`, `canStartWork()`, `canPublish()`.

## API 초안
- `POST /api/auth/register`, `POST /api/auth/login`
- `GET/PUT /api/worker-profile/me`
- `POST /api/promo-posts`
- `GET/POST /api/wanted-posts`, `POST /api/wanted-posts/{id}/comments`
- `POST /api/sessions/start`, `POST /api/sessions/{id}/pause|hold|resume|complete`
- `POST /api/sessions/{id}/captures`, `POST /api/sessions/{id}/clips`
- `POST /api/verification-posts/{id}/publish`
- `POST /api/verification-posts/{token}/rating`
- `GET/POST /api/scammer-reports`, `GET /api/scammer-entries`
- `GET /api/app-version`
