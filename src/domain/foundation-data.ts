export const navigationTabs = [
  { label: "메인페이지", shortLabel: "메인", href: "#main" },
  { label: "기사목록", shortLabel: "기사", href: "#workers" },
  { label: "기사구함", shortLabel: "구함", href: "#wanted" },
  { label: "사기꾼", shortLabel: "주의", href: "#scammer" },
  { label: "오류 및 건의사항", shortLabel: "건의", href: "#feedback" },
  { label: "설정", shortLabel: "설정", href: "#settings" },
] as const;

export const foundationStats = [
  { label: "공개 기사", value: "24" },
  { label: "오늘 인증글", value: "18" },
  { label: "기사구함 글", value: "7" },
  { label: "보류/이어하기", value: "3" },
] as const;

export const workerFilters = ["전체", "인증 가능", "장시간 가능", "새벽 가능", "후기 보유"] as const;

export const workerCards = [
  {
    id: "worker-aurora",
    name: "새벽기사",
    character: "루나 서버 / 281 비숍",
    summary: "30초 클립과 캡처 합성 인증을 기본으로 남기며, 장시간 진행은 중간 저장과 보류 기록을 같이 제공합니다.",
    intro: "조용한 장시간 진행과 회차별 인증 정리에 강한 기사입니다.",
    tags: ["인증 가능", "장시간 가능", "후기 128"],
    verified: true,
    rating: "4.9",
    completedJobs: "312",
    lastVerifiedAt: "2026-05-22 23:40",
    historyNote: "다른 작업물 · 쩔로그 인증 X",
  },
  {
    id: "worker-weekend",
    name: "주말기사",
    character: "스카니아 서버 / 277 나이트로드",
    summary: "주말과 야간 시간대가 넓고, 작업 시작 전 조건 확인과 종료 후 요약 게시글 작성을 우선합니다.",
    intro: "예약형 작업과 짧은 회차 진행에 맞춘 기사입니다.",
    tags: ["새벽 가능", "후기 보유", "예약 우선"],
    verified: true,
    rating: "4.7",
    completedJobs: "96",
    lastVerifiedAt: "2026-05-22 21:05",
    historyNote: "다른 작업물 · 쩔로그 인증 X",
  },
] as const;

export const promoPosts = [
  {
    id: "promo-2401",
    workerName: "새벽기사",
    title: "장시간 진행 인증 샘플",
    evidence: "30초 클립 2개 · 캡처 합성 4장 · 수동 저장 기록",
    publishedAt: "2026-05-22",
  },
  {
    id: "promo-2402",
    workerName: "주말기사",
    title: "예약 작업 종료 보고",
    evidence: "30초 클립 1개 · 시작/종료 캡처 · 손님 확인 링크",
    publishedAt: "2026-05-21",
  },
] as const;

export const wantedPosts = [
  {
    id: "wanted-1001",
    title: "오늘 밤 2시간 진행 기사 구합니다",
    server: "루나",
    budget: "협의",
    status: "모집중",
    visibility: "댓글은 로그인한 기사만 작성 가능",
    details: "손님은 원하는 시간, 서버, 캐릭터 조건만 공개합니다. 연락처와 외부 채팅 링크는 공개하지 않습니다.",
    comments: [
      { workerName: "새벽기사", body: "조건 확인했습니다. 인증 가능 시간대로 제안드립니다." },
      { workerName: "주말기사", body: "예약 가능 시간 안내를 남겼습니다." },
    ],
  },
  {
    id: "wanted-1002",
    title: "주말 오전 단기 진행 요청",
    server: "스카니아",
    budget: "협의",
    status: "검토중",
    visibility: "작성자와 승인된 기사만 상세 확인",
    details: "작업 조건은 게시글 상세에서 단계적으로 공개됩니다.",
    comments: [{ workerName: "주말기사", body: "가능 시간대 확인 후 댓글을 남겼습니다." }],
  },
] as const;
