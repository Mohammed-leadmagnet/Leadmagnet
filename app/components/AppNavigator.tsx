"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode, SVGProps } from "react";

type IconProps = {
  name: string;
  size?: number;
};

type AppNavigatorProps = {
  leadCandidates?: number;
  completedRadarRuns?: number;
  averageLeadScore?: number;
};

function formatNumber(value: number | undefined | null) {
  return new Intl.NumberFormat("en-US").format(Number(value) || 0);
}

const navGroups = [
  {
    label: "Main",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: "analytics" },
      { label: "Campaigns", href: "/campaigns", icon: "campaign" },
      { label: "All Leads", href: "/leads", icon: "leads", hasBadge: true },
      { label: "Analytics", href: "/analytics", icon: "chart" },
    ],
  },
  {
    label: "Platforms",
    items: [
      { label: "LinkedIn", href: "/linkedin", icon: "linkedin" },
      { label: "Instagram", href: "/instagram", icon: "instagram" },
      { label: "Gmail", href: "/gmail", icon: "mail" },
    ],
  },
  {
    label: "Agency",
    items: [
      { label: "Client Manager", href: "/agency", icon: "client" },
      { label: "Lead Radar", href: "/agency/lead-radar", icon: "radar" },
    ],
  },
  {
    label: "Resources",
    items: [{ label: "Blog", href: "/blog", icon: "blog" }],
  },
  {
    label: "Account",
    items: [
      { label: "Settings", href: "/settings", icon: "settings" },
      { label: "Billing", href: "/pricing", icon: "billing" },
      { label: "Support", href: "/contact", icon: "support" },
    ],
  },
];

function Icon({ name, size = 22 }: IconProps) {
  const common: SVGProps<SVGSVGElement> = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  const icons: Record<string, ReactNode> = {
    campaign: (
      <svg {...common}>
        <path d="M4 5h16v14H4z" />
        <path d="M8 9h8" />
        <path d="M8 13h5" />
        <path d="M16 17l3 3" />
      </svg>
    ),
    analytics: (
      <svg {...common}>
        <path d="M3 3v18h18" />
        <path d="M7 14l3-3 3 2 5-6" />
      </svg>
    ),
    chart: (
      <svg {...common}>
        <path d="M3 3v18h18" />
        <path d="M7 15V9" />
        <path d="M12 15V5" />
        <path d="M17 15v-7" />
      </svg>
    ),
    leads: (
      <svg {...common}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    mail: (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 7l9 6 9-6" />
      </svg>
    ),
    client: (
      <svg {...common}>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M7 8h10" />
        <path d="M7 12h6" />
        <path d="M7 16h8" />
      </svg>
    ),
    radar: (
      <svg {...common}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 12l6-3" />
        <path d="M12 3v3" />
        <path d="M21 12h-3" />
        <path d="M12 21v-3" />
        <path d="M3 12h3" />
      </svg>
    ),
    linkedin: (
      <svg {...common}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
    instagram: (
      <svg {...common}>
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <path d="M17.5 6.5h.01" />
      </svg>
    ),
    blog: (
      <svg {...common}>
        <path d="M4 4h16v16H4z" />
        <path d="M8 8h8" />
        <path d="M8 12h8" />
        <path d="M8 16h5" />
      </svg>
    ),
    settings: (
      <svg {...common}>
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3" />
        <path d="M12 19v3" />
        <path d="M2 12h3" />
        <path d="M19 12h3" />
        <path d="m4.93 4.93 2.12 2.12" />
        <path d="m16.95 16.95 2.12 2.12" />
        <path d="m19.07 4.93-2.12 2.12" />
        <path d="m7.05 16.95-2.12 2.12" />
      </svg>
    ),
    billing: (
      <svg {...common}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18" />
      </svg>
    ),
    support: (
      <svg {...common}>
        <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
      </svg>
    ),
  };

  return icons[name] || null;
}

export default function AppNavigator({
  leadCandidates = 0,
  completedRadarRuns = 0,
  averageLeadScore = 0,
}: AppNavigatorProps) {
  const pathname = usePathname();

  function isActiveRoute(href: string) {
    if (href === "/agency") {
      return pathname === "/agency";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <aside className="appnav-sidebar">
      <style>{`
        .appnav-sidebar {
          width: 290px;
          min-height: 100vh;
          background: rgba(255,255,255,0.76);
          backdrop-filter: blur(18px);
          border-right: 1px solid rgba(23,56,56,0.08);
          padding: 1.25rem;
          position: sticky;
          top: 0;
          align-self: start;
          box-shadow: 14px 0 36px rgba(23,56,56,0.04);
          flex-shrink: 0;
        }

        .appnav-logo {
          display: flex;
          align-items: center;
          gap: 0.62rem;
          text-decoration: none;
          margin-bottom: 1.5rem;
          padding: 0.5rem 0.35rem;
        }

        .appnav-brand-mark {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: conic-gradient(from -12deg,#ff7f67 0 44%,transparent 44% 51%,#8fc8c1 51% 86%,transparent 86% 100%);
          position: relative;
          flex: 0 0 auto;
        }

        .appnav-brand-mark:after {
          content: "";
          position: absolute;
          inset: 8px;
          border-radius: 50%;
          background: #ffffff;
        }

        .appnav-brand-name {
          font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
          font-size: 1.06rem;
          font-weight: 900;
          letter-spacing: -0.035em;
          color: #173838;
          line-height: 1;
        }

        .appnav-brand-name .appnav-lead {
          color: #ff7f67;
        }

        .appnav-brand-name .appnav-magnet {
          color: #8fc8c1;
        }

        .appnav-group {
          margin-bottom: 1.35rem;
        }

        .appnav-label {
          color: #819693;
          font-family: 'Inter', sans-serif;
          font-size: 0.68rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          margin: 0 0 0.55rem 0.5rem;
        }

        .appnav-list {
          display: grid;
          gap: 0.35rem;
        }

        .appnav-item {
          min-height: 46px;
          display: flex;
          align-items: center;
          gap: 0.72rem;
          color: #5f7774;
          text-decoration: none;
          border: 1px solid transparent;
          border-radius: 14px;
          padding: 0 0.8rem;
          font-family: 'Inter', sans-serif;
          font-size: 0.88rem;
          font-weight: 800;
          transition: all 0.15s ease;
        }

        .appnav-item:hover {
          color: #ff7f67;
          background: rgba(255,127,103,0.08);
          border-color: rgba(255,127,103,0.18);
        }

        .appnav-item.active {
          color: #173838;
          background: #ff7f67;
          border-color: rgba(255,127,103,0.18);
          box-shadow: 0 12px 26px rgba(255,127,103,0.22);
        }

        .appnav-icon {
          width: 22px;
          height: 22px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex: 0 0 auto;
        }

        .appnav-badge {
          margin-left: auto;
          min-width: 22px;
          height: 22px;
          border-radius: 100px;
          background: rgba(255,127,103,0.12);
          color: #ff7f67;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 0.72rem;
          font-weight: 900;
        }

        .appnav-item.active .appnav-badge {
          background: rgba(255,255,255,0.34);
          color: #173838;
        }

        .appnav-card {
          margin-top: 1.4rem;
          background: linear-gradient(145deg,#ffffff,#f8fbfa);
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 20px;
          padding: 1rem;
          box-shadow: 0 16px 38px rgba(23,56,56,0.06);
        }

        .appnav-card-title {
          color: #173838;
          font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
          font-size: 0.86rem;
          font-weight: 900;
          margin-bottom: 0.35rem;
        }

        .appnav-card-copy {
          color: #5f7774;
          font-family: 'Inter', sans-serif;
          font-size: 0.78rem;
          line-height: 1.55;
          margin-bottom: 0.85rem;
        }

        .appnav-card-btn {
          width: 100%;
          min-height: 40px;
          border: 0;
          border-radius: 12px;
          background: #ff7f67;
          color: #173838;
          font-family: 'Inter', sans-serif;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 0 10px 22px rgba(255,127,103,0.22);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
        }

        @media(max-width: 1150px) {
          .appnav-sidebar {
            width: 100%;
            position: relative;
            min-height: auto;
            border-right: 0;
            border-bottom: 1px solid rgba(23,56,56,0.08);
          }

          .appnav-group {
            margin-bottom: 1rem;
          }

          .appnav-list {
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          }

          .appnav-card {
            display: none;
          }
        }
      `}</style>

      <Link href="/" className="appnav-logo">
        <span className="appnav-brand-mark" />
        <span className="appnav-brand-name">
          <span className="appnav-lead">lead</span>
          <span className="appnav-magnet">magnet</span> inc
        </span>
      </Link>

      {navGroups.map((group) => (
        <div className="appnav-group" key={group.label}>
          <div className="appnav-label">{group.label}</div>

          <nav className="appnav-list">
            {group.items.map((item) => (
              <Link
                href={item.href}
                className={`appnav-item ${isActiveRoute(item.href) ? "active" : ""}`}
                key={item.label}
              >
                <span className="appnav-icon">
                  <Icon name={item.icon} size={20} />
                </span>

                <span>{item.label}</span>

                {item.hasBadge && (
                  <span className="appnav-badge">{formatNumber(leadCandidates)}</span>
                )}
              </Link>
            ))}
          </nav>
        </div>
      ))}

      <div className="appnav-card">
        <div className="appnav-card-title">Lead Radar is ready</div>
        <p className="appnav-card-copy">
          {formatNumber(completedRadarRuns)} completed runs · Avg score{" "}
          {formatNumber(averageLeadScore)}
        </p>
        <Link className="appnav-card-btn" href="/agency/lead-radar">
          Review leads
        </Link>
      </div>
    </aside>
  );
}
