import {
  LocationIcon,
  OrganizationIcon,
  LinkIcon,
  CalendarIcon,
} from "@primer/octicons-react";

type User = {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  followers: number;
  following: number;
  public_repos: number;
  location: string | null;
  blog: string | null;
  company: string | null;
  html_url: string;
  created_at: string;
};

function fmt(n: number) {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k`;
  return n.toLocaleString();
}

function MetaItem({
  icon,
  children,
  href,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  href?: string;
}) {
  const content = (
    <>
      <span className="meta-icon">{icon}</span>
      <span className="meta-text">{children}</span>
    </>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="meta-item meta-link">
        {content}
      </a>
    );
  }

  return <div className="meta-item">{content}</div>;
}

export default function ProfileCard({ user }: { user: User }) {
  const year = new Date(user.created_at).getFullYear();

  return (
    <section className="profile-card">
      <div className="profile-top">
        <img
          src={user.avatar_url}
          alt={user.login}
          width={88}
          height={88}
          className="profile-avatar"
        />

        <div style={{ flex: 1, minWidth: 220 }}>
          <div className="profile-name">{user.name || user.login}</div>
          <div className="profile-login">@{user.login}</div>

          {user.bio && <div className="profile-bio">{user.bio}</div>}

          <div className="profile-meta">
            {user.location && (
              <MetaItem icon={<LocationIcon size={16} />}>
                {user.location}
              </MetaItem>
            )}

            {user.company && (
              <MetaItem icon={<OrganizationIcon size={16} />}>
                {user.company}
              </MetaItem>
            )}

            {user.blog && (
              <MetaItem
                href={user.blog.startsWith("http") ? user.blog : `https://${user.blog}`}
                icon={<LinkIcon size={16} />}
              >
                {user.blog}
              </MetaItem>
            )}

            <MetaItem icon={<CalendarIcon size={16} />}>
              Member since {year}
            </MetaItem>
          </div>
        </div>
      </div>

      <div className="profile-stats">
        {[
          { label: "Repos", value: user.public_repos },
          { label: "Followers", value: user.followers },
          { label: "Following", value: user.following },
        ].map(({ label, value }) => (
          <div className="stat-box" key={label}>
            <div className="stat-value">{fmt(value)}</div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      <div className="profile-cta">
        <a href={user.html_url} target="_blank" rel="noopener noreferrer">
          View full profile on GitHub →
        </a>
      </div>
    </section>
  );
}