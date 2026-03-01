import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Image from "next/image";
import Link from "next/link";
import { ThemeProvider } from "../components/ThemeProvider";
import { ArrowLeft, Clock, User } from "lucide-react";

export const metadata = {
  title: "Blog | ODM Groove Hotel & Event Hall",
  description: "Read the latest news, event highlights, and local guides from ODM Groove Hotel in Ijoko, Ogun State.",
};

const blogPosts = [
  {
    id: 1,
    title: "Hosting the Perfect Wedding Reception in Ogun State",
    excerpt: "Discover the secrets to a flawless wedding reception, from selecting the right catering to ambient lighting in our grand event hall.",
    date: "Feb 15, 2026",
    author: "ODM Admin",
    category: "Events",
    image: "/odm-groove-hotel-front-view.jpg"
  },
  {
    id: 2,
    title: "Top 5 Reasons to Choose a Boutique Hotel",
    excerpt: "Why personalized service, unique aesthetics, and quieter environments make boutique hotels like ODM Groove the superior choice for your staycation.",
    date: "Feb 02, 2026",
    author: "Guest Relations",
    category: "Hospitality",
    image: "/Room/odm-groove-hotel-room-40k-1.jpg"
  },
  {
    id: 3,
    title: "The Rise of Ijoko's Nightlife Scene",
    excerpt: "A look into how local establishments are transforming the evening entertainment landscape in Ijoko Ogbayo.",
    date: "Jan 20, 2026",
    author: "Lifestyle Editor",
    category: "Nightlife",
    image: "/Outdoor night view/odm-groove-nightlife-outdoor-2.jpg"
  },
  {
    id: 4,
    title: "Relaxation Redefined: Our Poolside Experience",
    excerpt: "What to expect when you book a Deluxe room and spend your afternoon lounging by our pristine outdoor pool.",
    date: "Jan 05, 2026",
    author: "ODM Admin",
    category: "Leisure",
    image: "/Bar/odm-groove-outdoor-bar-nigeria.jpg"
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-[var(--gold)] hover:text-[var(--gold-dark)] mb-6 transition-colors">
            <ArrowLeft size={16} />
            <span>Back to Home</span>
          </Link>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4" style={{ fontFamily: "Playfair Display, serif" }}>
            The Groove <span className="italic text-[var(--gold)]">Journal</span>
          </h1>
          <p className="text-[var(--warm-gray)] text-lg max-w-2xl">
            Stories, event highlights, and local guides curated by the ODM Groove team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Featured Post (takes up full width on mobile/tablet, 2 cols on desktop) */}
          <article className="lg:col-span-2 relative group rounded-sm overflow-hidden bg-[var(--dark)] border border-[var(--dark-border)] shadow-xl flex flex-col sm:flex-row h-full">
            <div className="relative w-full sm:w-1/2 h-64 sm:h-auto overflow-hidden">
                <Image 
                  src={blogPosts[0].image} 
                  alt={blogPosts[0].title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
            </div>
            <div className="w-full sm:w-1/2 p-8 flex flex-col justify-center">
              <span className="text-[var(--gold)] text-xs font-bold uppercase tracking-wider mb-3 block">
                {blogPosts[0].category}
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-4 text-[var(--off-white)]" style={{ fontFamily: "Playfair Display, serif" }}>
                <Link href={`/blog/${blogPosts[0].id}`} className="hover:text-[var(--gold)] transition-colors">
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
                  <span>{blogPosts[0].date}</span>
                </div>
              </div>
            </div>
          </article>

          {/* Remaining Posts */}
          {blogPosts.slice(1).map((post) => (
            <article key={post.id} className="group rounded-sm overflow-hidden bg-[var(--dark)] border border-[var(--dark-border)] shadow-xl flex flex-col h-full">
              <div className="relative w-full h-56 overflow-hidden">
                  <Image 
                    src={post.image} 
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <span className="text-[var(--gold)] text-xs font-bold uppercase tracking-wider mb-2 block">
                  {post.category}
                </span>
                <h3 className="font-display text-xl font-bold mb-3 text-[var(--off-white)]" style={{ fontFamily: "Playfair Display, serif" }}>
                  <Link href={`/blog/${post.id}`} className="hover:text-[var(--gold)] transition-colors">
                    {post.title}
                  </Link>
                </h3>
                <p className="text-[var(--warm-gray)] text-sm mb-6 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="mt-auto pt-4 border-t border-[var(--dark-border)] flex items-center justify-between text-xs text-[var(--warm-gray)]">
                  <span className="flex items-center gap-1"><User size={12}/> {post.author}</span>
                  <span className="flex items-center gap-1"><Clock size={12}/> {post.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
