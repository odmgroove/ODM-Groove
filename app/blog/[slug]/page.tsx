import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, User, Calendar as CalendarIcon, Tag } from "lucide-react";
import ShareButtons from "../components/ShareButtons";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { prisma } from "../../lib/prisma";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  
  if (!post) {
    return { title: "Post Not Found | ODM Groove" };
  }

  return {
    title: `${post.title} | ODM Groove Journal`,
    description: post.excerpt || "Read this article on the ODM Groove Journal.",
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug }
  });

  if (!post || !post.published) {
    notFound();
  }

  // Fetch related posts (up to 3 other published posts)
  const relatedPosts = await prisma.blogPost.findMany({
    where: { 
      published: true,
      id: { not: post.id }
    },
    take: 3,
    orderBy: { createdAt: "desc" }
  });

  const postUrl = `https://odmgroove.com/blog/${post.slug}`; // replace with actual domain later

  return (
    <div className="min-h-screen flex flex-col bg-[var(--black)]">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20">
        <article className="max-w-4xl mx-auto px-6 w-full">
          {/* Back button — simple, inline, above the article header */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[var(--gold)]/70 hover:text-[var(--gold)] transition-colors text-xs font-semibold uppercase tracking-widest mb-10 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
            <span>Back to Journal</span>
          </Link>

          {/* Header */}
          <header className="mb-10 text-center flex flex-col items-center">
            {post.tags && (
              <div className="flex gap-2 mb-6">
                {post.tags.split(',').map((tag, i) => (
                  <span key={i} className="bg-[var(--gold)]/10 text-[var(--gold)] text-xs font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm border border-[var(--gold)]/20 flex items-center gap-1.5">
                    <Tag size={12} />
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-7xl font-bold mb-8 text-[var(--off-white)] leading-[1.1]" style={{ fontFamily: "Playfair Display, serif" }}>
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--warm-gray)]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[var(--dark-card)] border border-[var(--dark-border)] flex items-center justify-center">
                  <User size={14} className="text-[var(--gold)]" />
                </div>
                <span className="font-medium text-[var(--off-white)]">{post.author}</span>
              </div>
              <div className="flex items-center gap-2">
                <CalendarIcon size={16} className="text-[var(--gold)]" />
                <span>{new Date(post.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-[var(--gold)]" />
                <span>{Math.max(1, Math.ceil(post.content.length / 1000))} min read</span>
              </div>
            </div>
          </header>

          {/* Cover Image */}
          {post.coverImage && (
            <div className="relative w-full aspect-[21/9] rounded-sm overflow-hidden mb-12 border border-[var(--dark-border)] shadow-2xl">
              <Image 
                src={post.coverImage} 
                alt={post.title}
                fill
                priority
                className="object-cover"
              />
            </div>
          )}

          {/* Two-column layout for sharing + content */}
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Share Sidebar (Hidden on mobile, sticky on desktop) */}
            <aside className="hidden lg:block w-16 shrink-0">
              <div className="sticky top-40 flex flex-col items-center">
                <ShareButtons url={postUrl} title={post.title} orientation="vertical" />
              </div>
            </aside>

            <div className="flex-1 max-w-3xl">
              {/* Content */}
              <div className="prose prose-invert prose-lg max-w-none 
                prose-headings:font-display prose-headings:text-[var(--gold)] prose-headings:font-normal
                prose-a:text-[var(--gold)] hover:prose-a:text-[var(--gold-dark)] 
                prose-strong:text-[var(--off-white)] prose-strong:font-bold
                prose-img:rounded-sm prose-img:border prose-img:border-[var(--dark-border)]
                prose-p:leading-relaxed prose-p:text-[var(--warm-gray)]
                first-letter:text-7xl first-letter:font-bold first-letter:text-[var(--gold)] first-letter:mr-3 first-letter:float-left first-letter:font-display
              ">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>

              {/* Mobile Share (Visible only on small screens) */}
              <div className="mt-12 pt-8 border-t border-[var(--dark-border)] lg:hidden">
                <div className="flex flex-col items-center gap-4">
                  <span className="text-sm uppercase tracking-widest text-[var(--warm-gray)]">Share Article:</span>
                  <ShareButtons url={postUrl} title={post.title} orientation="horizontal" />
                </div>
              </div>

              {/* Author Bio */}
              <div className="mt-16 bg-[var(--dark-card)] border border-[var(--dark-border)] rounded-sm p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                <div className="w-20 h-20 shrink-0 rounded-full bg-[var(--black)] border border-[var(--gold)]/30 flex items-center justify-center">
                  <User size={32} className="text-[var(--gold)]" />
                </div>
                <div className="text-center sm:text-left">
                  <span className="text-[10px] uppercase tracking-widest text-[var(--gold)] font-bold block mb-1">Written By</span>
                  <h3 className="text-xl font-display text-[var(--off-white)] mb-2" style={{ fontFamily: "Playfair Display, serif" }}>{post.author}</h3>
                  <p className="text-sm text-[var(--warm-gray)] leading-relaxed">
                    The {post.author} team at ODM Groove Hotel brings you the latest insights, stories, and exclusive looks into premium hospitality and events in Ogun State.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 mt-24 pt-16 border-t border-[var(--dark-border)]">
            <h2 className="text-3xl font-display font-bold text-center mb-12 text-[var(--off-white)]" style={{ fontFamily: "Playfair Display, serif" }}>
              More from the <span className="italic text-[var(--gold)]">Journal</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((related) => (
                <article key={related.id} className="group rounded-sm overflow-hidden bg-[var(--dark-card)] border border-[var(--dark-border)] shadow-xl flex flex-col h-full relative hover:border-[var(--gold)]/30 transition-colors">
                  <div className="relative w-full h-48 overflow-hidden bg-[var(--black)]">
                    {related.coverImage && (
                      <Image 
                        src={related.coverImage} 
                        alt={related.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <span className="text-[var(--gold)] text-xs font-bold uppercase tracking-wider mb-2 block">
                      {related.tags ? related.tags.split(',')[0] : 'Blog'}
                    </span>
                    <h3 className="font-display text-lg font-bold mb-3 text-[var(--off-white)] group-hover:text-[var(--gold)] transition-colors" style={{ fontFamily: "Playfair Display, serif" }}>
                      <Link href={`/blog/${related.slug}`} className="before:absolute before:inset-0">
                        {related.title}
                      </Link>
                    </h3>
                    <div className="mt-auto pt-4 flex items-center gap-4 text-xs text-[var(--warm-gray)]">
                      <span>{new Date(related.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
