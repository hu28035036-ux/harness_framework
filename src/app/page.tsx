import { AppShell } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { foundationStats, workerCards } from "@/domain/foundation-data";

export default function Home() {
  return (
    <AppShell>
      <div id="main" className="mx-auto grid max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[1.4fr_0.9fr]">
        <section className="space-y-6">
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <StatusBadge tone="success">Foundation</StatusBadge>
                <h2 className="mt-3 text-xl font-semibold">기사 탐색과 작업 인증을 한 화면에서 시작합니다</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 opacity-80">
                  이 화면은 MVP의 실제 앱 셸입니다. 손님은 기사와 인증게시글을 비교하고,
                  기사는 PC 프로그램에서 캡처와 30초 클립 기반 인증을 이어갑니다.
                </p>
              </div>
              <form className="flex min-w-0 gap-2" role="search">
                <input
                  aria-label="기사 또는 사냥터 검색"
                  className="min-w-0 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2"
                  placeholder="기사명, 사냥터 검색"
                />
                <button className="rounded-md bg-[var(--accent)] px-4 py-2 font-semibold text-white">찾기</button>
              </form>
            </div>
          </div>

          <section id="workers" aria-labelledby="worker-list-title" className="space-y-3">
            <h2 id="worker-list-title" className="text-lg font-semibold">
              기사 목록 뼈대
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {workerCards.map((worker) => (
                <article className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4" key={worker.name}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{worker.name}</h3>
                      <p className="mt-1 text-sm opacity-75">{worker.character}</p>
                    </div>
                    <StatusBadge tone={worker.verified ? "success" : "warning"}>
                      {worker.verified ? "인증 가능" : "준비 중"}
                    </StatusBadge>
                  </div>
                  <p className="mt-3 text-sm leading-6 opacity-80">{worker.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {worker.tags.map((tag) => (
                      <span className="rounded-md bg-[var(--surface-muted)] px-2 py-1 text-xs" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>

        <aside className="space-y-4">
          <section id="wanted" className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
            <h2 className="font-semibold">작업 상태</h2>
            <div className="mt-4 grid gap-3">
              {foundationStats.map((stat) => (
                <div className="flex items-center justify-between rounded-md bg-[var(--surface-muted)] px-3 py-2" key={stat.label}>
                  <span className="text-sm opacity-75">{stat.label}</span>
                  <strong>{stat.value}</strong>
                </div>
              ))}
            </div>
          </section>
          <section id="settings" className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
            <h2 className="font-semibold">PC 프로그램 메뉴</h2>
            <ul className="mt-3 space-y-2 text-sm opacity-80">
              <li>대시보드와 업로드 대기 상태</li>
              <li>작업 시작, 녹화 미리보기, 3초 테스트</li>
              <li>인증캡처, 수동저장, 보류/이어하기</li>
              <li>인증게시글 작성과 손님 확인 링크</li>
            </ul>
          </section>
          <section id="scammer" className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
            <h2 className="font-semibold">주의 정보</h2>
            <p className="mt-3 text-sm leading-6 opacity-80">사기꾼 목록은 개인정보 없이 기사명, 캐릭터명, 유형, 상태만 공개합니다.</p>
          </section>
          <section id="feedback" className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
            <h2 className="font-semibold">오류 및 건의사항</h2>
            <p className="mt-3 text-sm leading-6 opacity-80">오류 제보와 기능 건의 처리 상태를 확인하는 영역입니다.</p>
          </section>
        </aside>
      </div>
    </AppShell>
  );
}
