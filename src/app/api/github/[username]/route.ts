import { NextResponse } from "next/server";

const BASE = "https://api.github.com";

function getHeaders() {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "github-profile-viewer",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  return headers;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const headers = getHeaders();

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`${BASE}/users/${username}`, { headers, next: { revalidate: 300 } }),
      fetch(`${BASE}/users/${username}/repos?per_page=100&sort=updated`, {
        headers,
        next: { revalidate: 300 },
      }),
    ]);

    if (userRes.status === 404) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (userRes.status === 403) {
      return NextResponse.json({ error: "GitHub rate limit exceeded, try again later" }, { status: 403 });
    }
    if (!userRes.ok) {
      return NextResponse.json({ error: "Error consulting GitHub" }, { status: 500 });
    }

    const user = await userRes.json();
    const repos = reposRes.ok ? await reposRes.json() : [];

    const sortedRepos = [...repos]
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 12)
      .map((r) => ({
        id: r.id,
        name: r.name,
        description: r.description,
        html_url: r.html_url,
        stargazers_count: r.stargazers_count,
        forks_count: r.forks_count,
        language: r.language,
        updated_at: r.updated_at,
        topics: r.topics ?? [],
      }));

    return NextResponse.json({
      user: {
        login: user.login,
        name: user.name,
        avatar_url: user.avatar_url,
        bio: user.bio,
        followers: user.followers,
        following: user.following,
        public_repos: user.public_repos,
        location: user.location,
        blog: user.blog,
        company: user.company,
        html_url: user.html_url,
        created_at: user.created_at,
      },
      repos: sortedRepos,
    });
  } catch {
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}