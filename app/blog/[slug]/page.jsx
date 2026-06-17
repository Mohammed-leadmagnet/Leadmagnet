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
    <main style={{ minHeight: "100vh", background: "#080c09", fontFamily: "'Inter', sans-serif", color: "#d1e0d6" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .nav{background:#0b120d;border-bottom:1px solid rgba(255,255,255,0.06);padding:0 2rem;height:60px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;}
        .logo{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.05rem;font-weight:800;color:#22c97a;text-decoration:none;display:flex;align-items:center;gap:0.4rem;}.logo-dot{width:8px;height:8px;background:#22c97a;border-radius:50%;box-shadow:0 0 10px rgba(34,201,122,0.5);}
        .back{color:#3d5240;text-decoration:none;font-size:0.84rem;font-weight:500;transition:color 0.15s;}.back:hover{color:#22c97a;}
        .article-wrap{max-width:720px;margin:0 auto;padding:3rem 1.5rem 5rem;}
        .article-meta{display:flex;align-items:center;gap:0.75rem;margin-bottom:1.5rem;flex-wrap:wrap;}
        .article-cat{font-size:0.68rem;font-weight:700;color:#22c97a;background:rgba(34,201,122,0.08);border:1px solid rgba(34,201,122,0.15);padding:0.175rem 0.6rem;border-radius:100px;font-family:'Plus Jakarta Sans',sans-serif;}
        .article-date{font-size:0.78rem;color:#2a3d2e;}
        .article-read{font-size:0.78rem;color:#2a3d2e;}
        .article-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:clamp(1.75rem,4vw,2.5rem);font-weight:800;color:#e8f4ec;letter-spacing:-0.03em;line-height:1.2;margin-bottom:1rem;}
        .article-excerpt{font-size:1.05rem;color:#4d6b54;line-height:1.65;margin-bottom:2.5rem;border-left:3px solid rgba(34,201,122,0.3);padding-left:1.25rem;}
        .article-section{margin-bottom:2.25rem;}
        .article-section h2{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.25rem;font-weight:700;color:#c4d4c8;margin-bottom:0.75rem;letter-spacing:-0.02em;}
        .article-section p{font-size:0.95rem;color:#6b8a73;line-height:1.75;}
        .article-divider{border:none;border-top:1px solid rgba(255,255,255,0.06);margin:2.5rem 0;}
        .article-cta{background:#0f1a11;border:1px solid rgba(34,201,122,0.15);border-radius:16px;padding:2rem;text-align:center;}
        .cta-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.15rem;font-weight:800;color:#e8f4ec;margin-bottom:0.5rem;}
        .cta-sub{font-size:0.88rem;color:#3d5240;margin-bottom:1.25rem;line-height:1.5;}
        .cta-btn{display:inline-block;background:linear-gradient(135deg,#22c97a,#1aae6a);color:#071209;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:0.88rem;padding:0.7rem 1.5rem;border-radius:10px;text-decoration:none;transition:all 0.2s;box-shadow:0 2px 8px rgba(34,201,122,0.15);}
        .cta-btn:hover{transform:translateY(-1px);box-shadow:0 4px 16px rgba(34,201,122,0.25);}
        .more-posts{margin-top:3rem;}
        .more-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:1rem;font-weight:700;color:#c4d4c8;margin-bottom:1.25rem;}
        .more-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1rem;}
        .more-card{background:#0f1a11;border:1px solid rgba(255,255,255,0.06);border-radius:12px;padding:1.25rem;text-decoration:none;transition:all 0.2s;}.more-card:hover{border-color:rgba(34,201,122,0.15);}
        .more-card-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:0.9rem;font-weight:700;color:#e2ede7;margin-bottom:0.35rem;line-height:1.3;}
        .more-card-cat{font-size:0.68rem;color:#22c97a;font-weight:600;font-family:'Plus Jakarta Sans',sans-serif;}
        @media(max-width:600px){.article-wrap{padding:2rem 1rem 4rem;}}
      `}</style>

      <nav className="nav">
        <a href="/" className="logo"><span className="logo-dot"></span> LeadMagnet</a>
        <Link href="/blog" className="back">← Back to Blog</Link>
      </nav>

      <article className="article-wrap">
        <div className="article-meta">
          <span className="article-cat">{post.category}</span>
          <span className="article-date">{new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
          <span className="article-read">{post.readTime}</span>
        </div>

        <h1 className="article-title">{post.title}</h1>
        <p className="article-excerpt">{post.excerpt}</p>

        {post.sections.map((section, i) => (
          <div className="article-section" key={i}>
            <h2>{section.heading}</h2>
            <p>{section.content}</p>
          </div>
        ))}

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
                <div className="more-card-cat">{p.category}</div>
                <div className="more-card-title">{p.title}</div>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </main>
  );
}
