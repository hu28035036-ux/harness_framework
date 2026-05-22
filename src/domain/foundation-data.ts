export const navigationTabs = [
  { label: "메인페이지", shortLabel: "메인", href: "#main" },
  { label: "기사목록", shortLabel: "기사", href: "#workers" },
  { label: "기사구함", shortLabel: "구함", href: "#wanted" },
  { label: "사기꾼", shortLabel: "주의", href: "#scammer" },
  { label: "오류 및 건의사항", shortLabel: "건의", href: "#feedback" },
  { label: "설정", shortLabel: "설정", href: "#settings" },
] as const;

export const foundationStats = [
  { label: "작성 중 인증게시글", value: "0" },
  { label: "업로드 대기 파일", value: "0" },
  { label: "최근 인증게시글", value: "준비" },
  { label: "업데이트 상태", value: "최신" },
] as const;

export const workerCards = [
  {
    name: "새벽기사",
    character: "대표 캐릭터 준비 중",
    summary: "가능 사냥터, 평점, 인증게시글 수가 들어갈 기사 카드 뼈대입니다.",
    tags: ["사냥터 직접 입력", "30초 클립", "후기"],
    verified: true,
  },
  {
    name: "주말기사",
    character: "프로필 승인 대기",
    summary: "오픈카톡/디스코드 버튼은 등록된 연락 수단이 있을 때만 노출됩니다.",
    tags: ["장시간 모드", "보류/이어하기", "수동저장"],
    verified: false,
  },
] as const;
