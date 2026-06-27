import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Image from "next/image";
import Link from "next/link";
import { Clock, User, Image as ImageIcon } from "lucide-react";
import { prisma } from "../lib/prisma";

export const metadata = {
  title: "Blog | ODM Groove Hotel & Event Hall",
  description: "Read the latest news, event highlights, and local guides from ODM Groove Hotel in Ijoko, Ogun State.",
};

export default async function BlogPage() {
  const blogPosts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-14">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4" style={{ fontFamily: "Playfair Display, serif" }}>
            The Groove <span className="italic text-[var(--gold)]">Journal</span>
          </h1>
          <p className="text-[var(--warm-gray)] text-lg max-w-2xl">
            Stories, event highlights, and local guides curated by the ODM Groove team.
          </p>
        </div>

        {blogPosts.length === 0 ? (
          <div className="text-center py-20 bg-[var(--dark)] border border-[var(--dark-border)] rounded-sm">
            <h2 className="text-2xl font-bold text-[var(--warm-gray)] mb-2">No Posts Yet</h2>
            <p className="text-[var(--warm-gray)]">Check back later for new updates and stories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Featured Post (takes up full width on mobile/tablet, 2 cols on desktop) */}
            <article className="lg:col-span-2 relative group rounded-sm overflow-hidden bg-[var(--dark)] border border-[var(--dark-border)] shadow-xl flex flex-col sm:flex-row h-full">
              <div className="relative w-full sm:w-1/2 h-64 sm:h-auto overflow-hidden bg-[var(--black)] flex items-center justify-center">
                  {blogPosts[0].coverImage ? (
                    <Image 
                      src={blogPosts[0].coverImage} 
                      alt={blogPosts[0].title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <ImageIcon size={48} className="text-[var(--warm-gray)] opacity-50" />
                  )}
              </div>
              <div className="w-full sm:w-1/2 p-8 flex flex-col justify-center">
                <span className="text-[var(--gold)] text-xs font-bold uppercase tracking-wider mb-3 block">
                  {blogPosts[0].tags ? blogPosts[0].tags.split(',')[0] : 'Blog'}
                </span>
                <h2 className="font-display text-2xl md:text-3xl font-bold mb-4 text-[var(--off-white)] group-hover:text-[var(--gold)] transition-colors" style={{ fontFamily: "Playfair Display, serif" }}>
                  <Link href={`/blog/${blogPosts[0].slug}`} className="before:absolute before:inset-0">
                    {blogPosts[0].title}
                  </Link>
                </h2>
                <p className="text-[var(--warm-gray)] mb-6 line-clamp-3">
                  {blogPosts[0].excerpt}
                </p>
                <div className="mt-auto flex items-center gap-4 text-xs text-[var(--warm-gray)]">
                  <div className="flex items-center gap-1.5">
                    <User size={14} />
                    <span>{blogPosts[0].author}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    <span>{new Date(blogPosts[0].createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </article>

            {/* Remaining Posts */}
            {blogPosts.slice(1).map((post) => (
              <article key={post.id} className="group rounded-sm overflow-hidden bg-[var(--dark)] border border-[var(--dark-border)] shadow-xl flex flex-col h-full relative hover:border-[var(--gold)]/30 transition-colors">
                <div className="relative w-full h-56 overflow-hidden bg-[var(--black)] flex items-center justify-center">
                    {post.coverImage ? (
                      <Image 
                        src={post.coverImage} 
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <ImageIcon size={32} className="text-[var(--warm-gray)] opacity-50" />
                    )}
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-[var(--gold)] text-xs font-bold uppercase tracking-wider mb-2 block">
                    {post.tags ? post.tags.split(',')[0] : 'Blog'}
                  </span>
                  <h3 className="font-display text-xl font-bold mb-3 text-[var(--off-white)] group-hover:text-[var(--gold)] transition-colors" style={{ fontFamily: "Playfair Display, serif" }}>
                    <Link href={`/blog/${post.slug}`} className="before:absolute before:inset-0">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-[var(--warm-gray)] text-sm mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto pt-4 border-t border-[var(--dark-border)] flex items-center justify-between text-xs text-[var(--warm-gray)]">
                    <span className="flex items-center gap-1"><User size={12}/> {post.author}</span>
                    <span className="flex items-center gap-1"><Clock size={12}/> {new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
