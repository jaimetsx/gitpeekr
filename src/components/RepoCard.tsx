const LANG_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  "C#": "#178600",
  "C++": "#f34b7d",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Shell: "#89e051",
  Kotlin: "#A97BFF",
  Swift: "#F05138",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Vue: "#41b883",
  Svelte: "#ff3e00",
};

type Repo = {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
  topics: string[];
};

function timeAgo(d: string) {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days}d ago`;
  const m = Math.floor(days / 30);
  return m < 12 ? `${m}mo ago` : `${Math.floor(m / 12)}y ago`;
}

function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

export default function RepoCard({ repo }: { repo: Repo }) {
  const lc = repo.language ? (LANG_COLORS[repo.language] ?? "#777") : null;

  return (
    <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="repo-card">
      <div className="repo-name">{repo.name}</div>
      <div className="repo-desc">{repo.description || "No description provided."}</div>

      {repo.topics.length > 0 && (
        <div className="repo-topics">
          {repo.topics.slice(0, 3).map((t) => (
            <span key={t} className="repo-topic">
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="repo-footer">
        {lc && (
          <>
            <span className="lang-dot" style={{ background: lc }} />
            <span className="lang-name">{repo.language}</span>
          </>
        )}
        <span>{fmt(repo.stargazers_count)} stars</span>
        <span className="repo-footer-right">{timeAgo(repo.updated_at)}</span>
      </div>
    </a>
  );
}