import { blogPosts } from "@/lib/blog-posts";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return blogPosts.map(post => ({ slug: post.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = blogPosts.find(p => p.slug === slug);
  if (!post) return { title: "Article Not Found — LeadMagnet" };
  return {
    title: `${post.title} — LeadMagnet Blog`,
    description: post.excerpt,
  };
}

export default async function BlogArticle({ params }) {
  const { slug } = await params;
  const post = blogPosts.find(p => p.slug === slug);
  if (!post) notFound();

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

        .back {
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.10);
          color: #5f7774;
          border-radius: 10px;
          min-height: 36px;
          padding: 0 0.8rem;
          display: inline-flex;
          align-items: center;
          text-decoration: none;
          font-size: 0.8rem;
          font-weight: 800;
        }

        .back:hover {
          color: #ff7f67;
          border-color: rgba(255,127,103,0.28);
          background: rgba(255,127,103,0.06);
        }

        .article-wrap {
          max-width: 840px;
          margin: 0 auto;
          padding: 3rem 1.5rem 5rem;
        }

        .article-hero {
          background: linear-gradient(145deg,#ffffff,#f8fbfa);
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 30px;
          padding: 2rem;
          box-shadow: 0 24px 60px rgba(23,56,56,0.08);
          margin-bottom: 2rem;
        }

        .article-meta {
          display: flex;
          align-items: center;
          gap: 0.65rem;
          margin-bottom: 1.25rem;
          flex-wrap: wrap;
        }

        .article-cat {
          font-size: 0.68rem;
          font-weight: 900;
          color: #ff7f67;
          background: rgba(255,127,103,0.08);
          border: 1px solid rgba(255,127,103,0.18);
          padding: 0.24rem 0.62rem;
          border-radius: 100px;
        }

        .article-date,
        .article-read {
          font-size: 0.78rem;
          color: #819693;
          font-weight: 700;
        }

        .article-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: clamp(2.1rem, 5vw, 3.6rem);
          font-weight: 900;
          color: #173838;
          letter-spacing: -0.07em;
          line-height: 1.02;
          margin-bottom: 1rem;
        }

        .article-excerpt {
          font-size: 1.02rem;
          color: #5f7774;
          line-height: 1.75;
          border-left: 4px solid rgba(255,127,103,0.38);
          padding-left: 1.25rem;
          max-width: 720px;
        }

        .article-body {
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 24px;
          padding: 2rem;
          box-shadow: 0 16px 34px rgba(23,56,56,0.05);
        }

        .article-section {
          margin-bottom: 2rem;
        }

        .article-section:last-child {
          margin-bottom: 0;
        }

        .article-section h2 {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 1.35rem;
          font-weight: 900;
          color: #173838;
          margin-bottom: 0.75rem;
          letter-spacing: -0.04em;
        }

        .article-section p {
          font-size: 0.98rem;
          color: #5f7774;
          line-height: 1.8;
        }

        .article-divider {
          border: none;
          border-top: 1px solid rgba(23,56,56,0.08);
          margin: 2.5rem 0;
        }

        .article-cta {
          background: linear-gradient(145deg,#ffffff,#f8fbfa);
          border: 1px solid rgba(255,127,103,0.18);
          border-radius: 24px;
          padding: 2rem;
          text-align: center;
          box-shadow: 0 16px 34px rgba(23,56,56,0.05);
        }

        .cta-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 1.35rem;
          font-weight: 900;
          color: #173838;
          margin-bottom: 0.55rem;
          letter-spacing: -0.045em;
        }

        .cta-sub {
          font-size: 0.9rem;
          color: #5f7774;
          margin-bottom: 1.35rem;
          line-height: 1.6;
        }

        .cta-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #ff7f67;
          color: #173838;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-weight: 900;
          font-size: 0.88rem;
          padding: 0.78rem 1.45rem;
          border-radius: 12px;
          text-decoration: none;
          transition: all 0.18s ease;
          box-shadow: 0 14px 28px rgba(255,127,103,0.22);
        }

        .cta-btn:hover {
          transform: translateY(-1px);
          background: #ec6f5b;
        }

        .more-posts {
          margin-top: 3rem;
        }

        .more-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 1.08rem;
          font-weight: 900;
          color: #173838;
          margin-bottom: 1rem;
        }

        .more-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1rem;
        }

        .more-card {
          background: #ffffff;
          border: 1px solid rgba(23,56,56,0.08);
          border-radius: 18px;
          padding: 1.15rem;
          text-decoration: none;
          transition: all 0.18s ease;
          box-shadow: 0 12px 28px rgba(23,56,56,0.04);
        }

        .more-card:hover {
          border-color: rgba(255,127,103,0.28);
          transform: translateY(-2px);
        }

        .more-card-title {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 900;
          color: #173838;
          margin-bottom: 0.4rem;
          line-height: 1.35;
          letter-spacing: -0.025em;
        }

        .more-card-cat {
          font-size: 0.7rem;
          color: #ff7f67;
          font-weight: 900;
        }

        @media(max-width: 700px) {
          .nav {
            padding: 0 1rem;
          }

          .article-wrap {
            padding: 2rem 1rem 4rem;
          }

          .article-hero,
          .article-body,
          .article-cta {
            padding: 1.35rem;
          }

          .back {
            font-size: 0.76rem;
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

        <Link href="/blog" className="back">Back to Blog</Link>
      </nav>

      <article className="article-wrap">
        <section className="article-hero">
          <div className="article-meta">
            <span className="article-cat">{post.category}</span>
            <span className="article-date">{new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
            <span className="article-read">{post.readTime}</span>
          </div>

          <h1 className="article-title">{post.title}</h1>
          <p className="article-excerpt">{post.excerpt}</p>
        </section>

        <section className="article-body">
          {post.sections.map((section, i) => (
            <div className="article-section" key={i}>
              <h2>{section.heading}</h2>
              <p>{section.content}</p>
            </div>
          ))}
        </section>

        <hr className="article-divider" />

        <div className="article-cta">
          <div className="cta-title">Ready to automate your lead generation?</div>
          <div className="cta-sub">Start your free 7-day trial — no credit card required. See results within 48 hours.</div>
          <a href="/signup" className="cta-btn">Start Free Trial →</a>
        </div>

        <div className="more-posts">
          <div className="more-title">More articles</div>

          <div className="more-grid">
            {blogPosts.filter(p => p.slug !== post.slug).slice(0, 3).map(p => (
              <Link href={`/blog/${p.slug}`} key={p.slug} className="more-card">
                <div className="more-card-title">{p.title}</div>
                <div className="more-card-cat">{p.category}</div>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </main>
  );
}