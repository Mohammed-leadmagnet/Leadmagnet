import { blogPosts } from "@/lib/blog-posts";
import Link from "next/link";

export const metadata = {
  title: "Blog — LeadMagnet | Lead Generation Tips for Marketing Agencies",
  description: "Expert guides on LinkedIn lead generation, AI lead scoring, client management, and agency growth strategies. Practical tips for marketing agencies.",
};

export default function Blog() {
  const categories = [...new Set(blogPosts.map(p => p.category))];

  return (
    <main className="page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .page {
          min-height: 100vh;
          background: #FBF3E3;
          color: #173838;
          font-family: 'Inter', sans-serif;
        }

        .nav {
          height: 64px;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(18px);
          border-bottom: 1px solid rgba(23,56,56,0.08);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 1.5rem;
          position: sticky;
          top: 0;
          z-index: 50;
          box-shadow: 0 10px 30px rgba(23,56,56,0.04);
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.62rem;
          text-decoration: none;
        }

        .brand-mark {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: conic-gradient(from -12deg,#ff7f67 0 44%,transparent 44% 51%,#8fc8c1 51% 86%,transparent 86% 100%);
          position: relative;
          flex: 0 0 auto;
        }

        .brand-mark:after {
          content: "";
          position: absolute;
          inset: 8px;
          border-radius: 50%;
          background: #ffffff;
        }

        .brand-name {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 1.06rem;
          font-weight: 900;
          letter-spacing: -0.035em;
          color: #173838;
          line-height: 1;
        }

        .brand-name .lead {
          color: #ff7f67;
        }

        .brand-name .magnet {
          color: #8fc8c1;
        }

        .nav-links {
          display: flex;
          gap: 1.25rem;
          align-items: center;
        }

        .nav-links a {
          color: #5f7774;
          text-decoration: none;
          font-size: 0.86rem;
          font-weight: 800;
        }

        .nav-links a:hover {
          color: #ff7f67;
        }

        .nav-cta {
          background: #ff7f67;
          color: #173838 !important;
          font-weight: 900 !important;
          padding: 0.62rem 1rem;
          border-radius: 12px;
          box-shadow: 0 14px 28px rgba(255,127,103,0.20);
        }

        .hero-wrap {
          padding: 4.5rem 1.5rem 2.25rem;
        }

        .hero {
          max-width: 820px;
          margin: 0 auto;
          text-align: center;
          background: linear-gradient(145deg,#ffffff,#f8fbfa);
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 30px;
          padding: 2.3rem;
          box-shadow: 0 24px 60px rgba(23,56,56,0.08);
        }

        .hero-tag {
          color: #ff7f67;
          background: rgba(255,127,103,0.08);
          border: 1px solid rgba(255,127,103,0.18);
          display: inline-flex;
          padding: 0.4rem 0.75rem;
          border-radius: 100px;
          font-size: 0.72rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 1rem;
        }

        .hero-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(2.3rem, 6vw, 4.2rem);
          font-weight: 900;
          color: #173838;
          letter-spacing: -0.075em;
          line-height: 0.98;
          margin-bottom: 1rem;
        }

        .hero-sub {
          color: #5f7774;
          font-size: 1rem;
          line-height: 1.7;
          max-width: 650px;
          margin: 0 auto;
        }

        .cats {
          display: flex;
          gap: 0.55rem;
          justify-content: center;
          flex-wrap: wrap;
          margin-bottom: 2rem;
          padding: 0 1.5rem;
        }

        .cat {
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.10);
          color: #5f7774;
          font-size: 0.78rem;
          padding: 0.42rem 0.9rem;
          border-radius: 100px;
          font-family: 'Inter', sans-serif;
          font-weight: 800;
          box-shadow: 0 10px 24px rgba(23,56,56,0.04);
        }

        .posts {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.25rem;
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 1.5rem 5rem;
        }

        .post-card {
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 22px;
          padding: 1.45rem;
          transition: all 0.18s ease;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          min-height: 260px;
          box-shadow: 0 16px 34px rgba(23,56,56,0.05);
        }

        .post-card:hover {
          border-color: rgba(255,127,103,0.28);
          transform: translateY(-3px);
          box-shadow: 0 24px 55px rgba(23,56,56,0.09);
        }

        .post-meta {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .post-cat {
          font-size: 0.68rem;
          font-weight: 900;
          color: #ff7f67;
          background: rgba(255,127,103,0.08);
          border: 1px solid rgba(255,127,103,0.18);
          padding: 0.22rem 0.58rem;
          border-radius: 100px;
        }

        .post-date,
        .post-read {
          font-size: 0.74rem;
          color: #819693;
          font-weight: 700;
        }

        .post-read {
          margin-left: auto;
        }

        .post-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 1.18rem;
          font-weight: 900;
          color: #173838;
          margin-bottom: 0.75rem;
          line-height: 1.28;
          letter-spacing: -0.035em;
        }

        .post-excerpt {
          font-size: 0.88rem;
          color: #5f7774;
          line-height: 1.65;
          margin-bottom: 1.25rem;
          flex: 1;
        }

        .post-link {
          font-size: 0.84rem;
          color: #ff7f67;
          font-weight: 900;
        }

        @media(max-width: 700px) {
          .nav {
            padding: 0 1rem;
          }

          .nav-links a:not(.nav-cta) {
            display: none;
          }

          .hero-wrap {
            padding: 2.5rem 1rem 1.5rem;
          }

          .hero {
            padding: 1.4rem;
          }

          .posts {
            grid-template-columns: 1fr;
            padding: 0 1rem 4rem;
          }

          .post-read {
            margin-left: 0;
          }
        }
      `}</style>

      <nav className="nav">
        <a href="/" className="logo">
          <span className="brand-mark" />
          <span className="brand-name">
            <span className="lead">lead</span>
            <span className="magnet">magnet</span> inc
          </span>
        </a>

        <div className="nav-links">
          <a href="/#features">Features</a>
          <a href="/pricing">Pricing</a>
          <a href="/login">Log in</a>
          <a href="/signup" className="nav-cta">Start Free Trial</a>
        </div>
      </nav>

      <div className="hero-wrap">
        <section className="hero">
          <div className="hero-tag">Blog</div>
          <h1 className="hero-title">Insights for modern marketing agencies</h1>
          <p className="hero-sub">
            Practical guides on lead generation, AI scoring, client management,
            and growing your agency sustainably.
          </p>
        </section>
      </div>

      <div className="cats">
        {categories.map(c => <span key={c} className="cat">{c}</span>)}
      </div>

      <div className="posts">
        {blogPosts.map(post => (
          <Link href={`/blog/${post.slug}`} key={post.slug} className="post-card">
            <div className="post-meta">
              <span className="post-cat">{post.category}</span>
              <span className="post-date">{new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              <span className="post-read">{post.readTime}</span>
            </div>

            <h2 className="post-title">{post.title}</h2>
            <p className="post-excerpt">{post.excerpt}</p>
            <span className="post-link">Read article →</span>
          </Link>
        ))}
      </div>
    </main>
  );
}