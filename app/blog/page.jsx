import { blogPosts } from "@/lib/blog-posts";
import Link from "next/link";

export const metadata = {
  title: "Blog — LeadMagnet | Lead Generation Tips for Marketing Agencies",
  description: "Expert guides on LinkedIn lead generation, AI lead scoring, client management, and agency growth strategies. Practical tips for marketing agencies.",
};

export default function Blog() {
  const categories = [...new Set(blogPosts.map(p => p.category))];

  return (
    <main style={{ minHeight: "100vh", background: "#080c09", fontFamily: "'Inter', sans-serif", color: "#d1e0d6" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .nav{background:#0b120d;border-bottom:1px solid rgba(255,255,255,0.06);padding:0 2rem;height:60px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:50;}
        .logo{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.05rem;font-weight:800;color:#22c97a;text-decoration:none;display:flex;align-items:center;gap:0.4rem;}.logo-dot{width:8px;height:8px;background:#22c97a;border-radius:50%;box-shadow:0 0 10px rgba(34,201,122,0.5);}
        .nav-links{display:flex;gap:1.5rem;align-items:center;}.nav-links a{color:#3d5240;text-decoration:none;font-size:0.875rem;font-weight:500;}.nav-links a:hover{color:#94a3b8;}
        .nav-cta{background:#22c97a;color:#071209;font-weight:600;padding:0.5rem 1.1rem;border-radius:9px;text-decoration:none;font-size:0.855rem;}
        .hero{text-align:center;padding:4.5rem 1.5rem 3rem;max-width:700px;margin:0 auto;}
        .hero-tag{font-size:0.7rem;font-weight:600;color:#22c97a;text-transform:uppercase;letter-spacing:0.12em;margin-bottom:0.875rem;}
        .hero-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:clamp(2rem,5vw,2.75rem);font-weight:800;color:#e8f4ec;letter-spacing:-0.03em;margin-bottom:0.875rem;line-height:1.15;}
        .hero-sub{color:#3d5240;font-size:0.95rem;line-height:1.6;}
        .cats{display:flex;gap:0.5rem;justify-content:center;flex-wrap:wrap;margin-bottom:3rem;padding:0 1.5rem;}
        .cat{background:transparent;border:1px solid rgba(255,255,255,0.06);color:#3d5240;font-size:0.78rem;padding:0.4rem 0.9rem;border-radius:100px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:600;cursor:default;}
        .posts{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:1.25rem;max-width:1060px;margin:0 auto;padding:0 1.5rem 5rem;}
        .post-card{background:#0f1a11;border:1px solid rgba(255,255,255,0.06);border-radius:16px;padding:1.75rem;transition:all 0.2s;text-decoration:none;display:flex;flex-direction:column;}
        .post-card:hover{border-color:rgba(34,201,122,0.2);transform:translateY(-2px);}
        .post-meta{display:flex;align-items:center;gap:0.75rem;margin-bottom:1rem;}
        .post-cat{font-size:0.68rem;font-weight:700;color:#22c97a;background:rgba(34,201,122,0.08);border:1px solid rgba(34,201,122,0.15);padding:0.15rem 0.55rem;border-radius:100px;font-family:'Plus Jakarta Sans',sans-serif;}
        .post-date{font-size:0.72rem;color:#2a3d2e;font-family:'Inter',sans-serif;}
        .post-read{font-size:0.72rem;color:#2a3d2e;margin-left:auto;font-family:'Inter',sans-serif;}
        .post-title{font-family:'Plus Jakarta Sans',sans-serif;font-size:1.1rem;font-weight:700;color:#e2ede7;margin-bottom:0.65rem;line-height:1.35;letter-spacing:-0.02em;}
        .post-excerpt{font-size:0.84rem;color:#3d5240;line-height:1.6;margin-bottom:1.25rem;flex:1;}
        .post-link{font-size:0.82rem;color:#22c97a;font-weight:600;font-family:'Plus Jakarta Sans',sans-serif;}
        @media(max-width:600px){.posts{grid-template-columns:1fr;}.nav-links a:not(.nav-cta){display:none;}}
      `}</style>

      <nav className="nav">
        <a href="/" className="logo"><span className="logo-dot"></span> LeadMagnet</a>
        <div className="nav-links">
          <a href="/#features">Features</a>
          <a href="/pricing">Pricing</a>
          <a href="/login">Log in</a>
          <a href="/signup" className="nav-cta">Start Free Trial</a>
        </div>
      </nav>

      <div className="hero">
        <div className="hero-tag">Blog</div>
        <h1 className="hero-title">Insights for modern marketing agencies</h1>
        <p className="hero-sub">Practical guides on lead generation, AI scoring, client management, and growing your agency sustainably.</p>
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
