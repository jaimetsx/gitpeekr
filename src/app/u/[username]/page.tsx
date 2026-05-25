import { notFound } from "next/navigation";
import Link from "next/link";
import ProfileCard from "@/components/ProfileCard";
import RepoCard from "@/components/RepoCard";
import SearchBar from "@/components/SearchBar";
import ContributionHeatmap from "@/components/ContributionHeatmap";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  return {
    title: `${username} — GitPeekr`,
  };
}

export default async function UserPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const [profileRes, contribRes] = await Promise.all([
    fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/github/${username}`,
      { next: { revalidate: 300 } }
    ),
    fetch(`https://github-contributions-api.jogruber.de/v4/${username}?y=all`, {
      next: { revalidate: 3600 },
    }),
  ]);

  if (profileRes.status === 404) notFound();

  const data = await profileRes.json();
  const contributionData = contribRes.ok ? await contribRes.json() : { total: {}, contributions: [] };

  if (data.error) {
    return (
      <main className="user-page">
        <div
          style={{
            minHeight: "70vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <p style={{ color: "var(--text-muted)" }}>{data.error}</p>
          <Link href="/" className="back-link">
            Back to search
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="user-page">
      <div className="user-container">
        <div className="user-topbar anim-fade-up">
          <Link href="/" className="back-link">
            ← Back
          </Link>

          <div className="search-wrap-sm">
            <SearchBar defaultValue={username} />
          </div>
        </div>

        <div className="anim-fade-up-1">
          <ProfileCard user={data.user} />
        </div>

        <div className="anim-fade-up-1">
          <ContributionHeatmap username={username} data={contributionData} />
        </div>

        <div className="anim-fade-up-2">
          <div className="section-header">
            <span className="section-title">Top repositories</span>
            <span className="section-line" />
            <span className="section-sub">Sorted by stars</span>
          </div>

          <div className="repo-grid">
            {data.repos.map((repo: Parameters<typeof RepoCard>[0]["repo"]) => (
              <RepoCard key={repo.id} repo={repo} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}