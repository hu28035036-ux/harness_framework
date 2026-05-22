import { AppShell } from "@/components/app-shell";
import { StatusBadge } from "@/components/status-badge";
import { foundationStats, promoPosts, wantedPosts, workerCards, workerFilters } from "@/domain/foundation-data";

export default function Home() {
  const featuredWorker = workerCards[0];
  const featuredWanted = wantedPosts[0];

  return (
    <AppShell>
      <div id="main" className="mx-auto grid max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[1.35fr_0.9fr]">
        <section className="space-y-6">
          <section className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <StatusBadge tone="success">Web MVP</StatusBadge>
                <h2 className="mt-3 text-xl font-semibold">검증 기록을 보고 기사를 찾는 쩔로그 마켓플레이스</h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 opacity-80">
                  손님은 공개 프로필, 인증 게시글, 후기와 이전 작업물을 한 화면에서 비교합니다. 기사는 외부 연락 버튼 없이
                  쩔로그 인증 흐름 안에서만 작업 조건을 제안합니다.
                </p>
              </div>
              <form className="flex min-w-0 gap-2" role="search">
                <input
                  aria-label="기사 또는 서버 검색"
                  className="min-w-0 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2"
                  placeholder="기사명, 서버 검색"
                />
                <button className="rounded-md bg-[var(--accent)] px-4 py-2 font-semibold text-white" type="submit">
                  찾기
                </button>
              </form>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {foundationStats.map((stat) => (
                <div className="rounded-md bg-[var(--surface-muted)] px-3 py-3" key={stat.label}>
                  <p className="text-xs opacity-70">{stat.label}</p>
                  <strong className="mt-1 block text-lg">{stat.value}</strong>
                </div>
              ))}
            </div>
          </section>

          <section id="workers" aria-labelledby="worker-list-title" className="space-y-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 id="worker-list-title" className="text-lg font-semibold">
                  기사목록
                </h2>
                <p className="mt-1 text-sm opacity-75">인증 가능 여부와 공개 후기 기준으로 탐색합니다.</p>
              </div>
              <fieldset className="flex flex-wrap gap-2">
                <legend className="sr-only">기사 목록 필터</legend>
                {workerFilters.map((filter, index) => (
                  <label
                    className="rounded-md border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm"
                    key={filter}
                  >
                    <input className="mr-2" defaultChecked={index === 0} name="worker-filter" type="radio" />
                    {filter}
                  </label>
                ))}
              </fieldset>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {workerCards.map((worker) => (
                <article className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4" key={worker.id}>
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
                  <dl className="mt-4 grid grid-cols-3 gap-2 text-sm">
                    <div className="rounded-md bg-[var(--surface-muted)] px-2 py-2">
                      <dt className="text-xs opacity-70">평점</dt>
                      <dd className="font-semibold">{worker.rating}</dd>
                    </div>
                    <div className="rounded-md bg-[var(--surface-muted)] px-2 py-2">
                      <dt className="text-xs opacity-70">완료</dt>
                      <dd className="font-semibold">{worker.completedJobs}</dd>
                    </div>
                    <div className="rounded-md bg-[var(--surface-muted)] px-2 py-2">
                      <dt className="text-xs opacity-70">최근 인증</dt>
                      <dd className="font-semibold">오늘</dd>
                    </div>
                  </dl>
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

          <section aria-labelledby="profile-title" className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <StatusBadge tone="success">공개 프로필</StatusBadge>
                <h2 id="profile-title" className="mt-3 text-lg font-semibold">
                  {featuredWorker.name}
                </h2>
                <p className="mt-2 text-sm leading-6 opacity-80">{featuredWorker.intro}</p>
              </div>
              <dl className="grid min-w-60 grid-cols-2 gap-2 text-sm">
                <div className="rounded-md bg-[var(--surface-muted)] px-3 py-2">
                  <dt className="text-xs opacity-70">인증 게시글</dt>
                  <dd className="font-semibold">42</dd>
                </div>
                <div className="rounded-md bg-[var(--surface-muted)] px-3 py-2">
                  <dt className="text-xs opacity-70">후기</dt>
                  <dd className="font-semibold">128</dd>
                </div>
              </dl>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <section className="rounded-md bg-[var(--surface-muted)] p-3">
                <h3 className="font-semibold">소개</h3>
                <p className="mt-2 text-sm leading-6 opacity-80">{featuredWorker.summary}</p>
              </section>
              <section className="rounded-md bg-[var(--surface-muted)] p-3">
                <h3 className="font-semibold">인증 게시글</h3>
                <p className="mt-2 text-sm leading-6 opacity-80">{promoPosts[0].evidence}</p>
              </section>
              <section className="rounded-md bg-[var(--surface-muted)] p-3">
                <h3 className="font-semibold">이전 작업물</h3>
                <p className="mt-2 text-sm leading-6 opacity-80">{featuredWorker.historyNote}</p>
              </section>
            </div>
          </section>

          <section aria-labelledby="promo-title" className="space-y-3">
            <h2 id="promo-title" className="text-lg font-semibold">
              작업 홍보 게시글
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {promoPosts.map((post) => (
                <article className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4" key={post.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{post.title}</h3>
                      <p className="mt-1 text-sm opacity-75">{post.workerName}</p>
                    </div>
                    <StatusBadge tone="neutral">{post.publishedAt}</StatusBadge>
                  </div>
                  <p className="mt-3 text-sm leading-6 opacity-80">{post.evidence}</p>
                </article>
              ))}
            </div>
          </section>
        </section>

        <aside className="space-y-4">
          <section id="wanted" className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">기사구함</h2>
                <p className="mt-1 text-sm opacity-75">목록, 작성, 상세, 댓글 권한 안내</p>
              </div>
              <StatusBadge tone="success">공개</StatusBadge>
            </div>
            <form className="mt-4 grid gap-3" aria-label="기사구함 작성 폼">
              <label className="grid gap-1 text-sm">
                제목
                <input className="rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2" placeholder="작업 요청 제목" />
              </label>
              <label className="grid gap-1 text-sm">
                서버
                <select className="rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2" defaultValue="루나">
                  <option>루나</option>
                  <option>스카니아</option>
                  <option>엘리시움</option>
                </select>
              </label>
              <label className="grid gap-1 text-sm">
                요청 내용
                <textarea
                  className="min-h-24 rounded-md border border-[var(--border)] bg-[var(--background)] px-3 py-2"
                  placeholder="시간, 조건, 공개 가능한 정보만 입력"
                />
              </label>
              <button className="rounded-md bg-[var(--accent)] px-4 py-2 font-semibold text-white" type="submit">
                기사구함 작성
              </button>
            </form>
            <div className="mt-5 grid gap-3">
              {wantedPosts.map((post) => (
                <article className="rounded-md bg-[var(--surface-muted)] p-3" key={post.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{post.title}</h3>
                      <p className="mt-1 text-sm opacity-75">
                        {post.server} · {post.budget}
                      </p>
                    </div>
                    <StatusBadge tone={post.status === "모집중" ? "success" : "warning"}>{post.status}</StatusBadge>
                  </div>
                  <p className="mt-3 text-sm leading-6 opacity-80">{post.details}</p>
                  <p className="mt-2 text-xs font-semibold text-[var(--accent-strong)]">{post.visibility}</p>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="wanted-detail-title" className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
            <h2 id="wanted-detail-title" className="font-semibold">
              기사구함 상세
            </h2>
            <p className="mt-2 text-sm leading-6 opacity-80">{featuredWanted.details}</p>
            <div className="mt-4 grid gap-2">
              {featuredWanted.comments.map((comment) => (
                <article className="rounded-md bg-[var(--surface-muted)] px-3 py-2" key={`${comment.workerName}-${comment.body}`}>
                  <h3 className="text-sm font-semibold">{comment.workerName}</h3>
                  <p className="mt-1 text-sm opacity-80">{comment.body}</p>
                </article>
              ))}
            </div>
            <p className="mt-3 rounded-md border border-[var(--border)] px-3 py-2 text-sm">
              댓글 작성은 로그인한 기사 계정만 가능합니다.
            </p>
          </section>

          <section id="settings" className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
            <h2 className="font-semibold">PC 프로그램 메뉴</h2>
            <ul className="mt-3 space-y-2 text-sm opacity-80">
              <li>대시보드, 업로드 대기 상태</li>
              <li>작업 시작, 녹화 미리보기, 3초 테스트</li>
              <li>인증 캡처, 수동 저장, 보류/이어하기</li>
              <li>인증 게시글 작성과 손님 확인 링크</li>
            </ul>
          </section>
          <section id="scammer" className="rounded-lg border border-[var(--border)] bg-[var(--surface)] p-4">
            <h2 className="font-semibold">주의 정보</h2>
            <p className="mt-3 text-sm leading-6 opacity-80">
              사기꾼 목록은 개인정보 없이 기사명, 캐릭터명, 유형, 상태만 공개합니다.
            </p>
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
