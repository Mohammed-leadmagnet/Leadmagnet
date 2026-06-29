import { blogPosts } from "@/lib/blog-posts";
import Link from "next/link";
import AppNavigator from "@/app/components/AppNavigator";

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

        .app-layout {
          display: grid;
          grid-template-columns: 290px minmax(0, 1fr);
          min-height: 100vh;
        }

        .content {
          padding: 2rem;
          overflow-x: hidden;
        }

        .content-inner {
          max-width: 1120px;
          margin: 0 auto;
        }

        .hero-wrap {
          padding: 0 0 2.25rem;
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
          padding: 0 0 4rem;
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

        @media(max-width: 1000px) {
          .app-layout {
            grid-template-columns: 1fr;
          }

          .content {
            padding: 1.25rem;
          }
        }

        @media(max-width: 700px) {
          .content {
            padding: 1rem;
          }

          .hero-wrap {
            padding: 0 0 1.5rem;
          }

          .hero {
            padding: 1.4rem;
          }

          .posts {
            grid-template-columns: 1fr;
            padding-bottom: 3rem;
          }

          .post-read {
            margin-left: 0;
          }
        }
      `}</style>

      <div className="app-layout">
        <AppNavigator />

        <section className="content">
          <div className="content-inner">
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
          </div>
        </section>
      </div>
    </main>
  );
}
