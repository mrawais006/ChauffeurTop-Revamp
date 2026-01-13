'use client';

import { useEffect, useState } from 'react';
import { ServiceHero } from '@/components/services/ServiceHero';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { format } from 'date-fns';

export default function BlogPreviewPage() {
  const [blog, setBlog] = useState<any>(null);

  useEffect(() => {
    const data = localStorage.getItem('blog_preview_data');
    if (data) {
      setBlog(JSON.parse(data));
    }
  }, []);

  if (!blog) return <div className="flex h-screen items-center justify-center bg-black text-luxury-gold animate-pulse">Loading preview...</div>;

  const readTime = blog.reading_time || 1;

  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-luxury-gold selection:text-black pb-20">
       <div className="fixed top-4 left-4 z-50">
             <Button variant="outline" className="shadow-lg hover:bg-white bg-black border-white/20 text-white hover:text-black" onClick={() => window.close()}>
                <ArrowLeft className="w-4 h-4 mr-2" /> Close Preview
             </Button>
       </div>
       <div className="bg-luxury-gold/10 text-luxury-gold p-2 text-center text-xs font-medium sticky top-0 z-40 border-b border-luxury-gold/20 backdrop-blur-md">
          PREVIEW MODE - This content is not published yet
       </div>

      {/* Header Section */}
      <header className="pt-20 pb-16 px-4 md:px-8 text-center max-w-5xl mx-auto relative z-10">
          {blog.categories && blog.categories.length > 0 && (
              <Badge variant="outline" className="mb-6 border-luxury-gold/50 text-luxury-gold px-4 py-1 text-sm tracking-widest uppercase hover:bg-luxury-gold hover:text-black transition-colors cursor-default">
                  {blog.categories[0]}
              </Badge>
          )}
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-white mb-8 leading-[1.1] tracking-tight">
              {blog.title}
          </h1>

          <div className="flex items-center justify-center gap-6 text-sm md:text-base text-gray-400 font-medium tracking-wide">
              <div className="flex items-center gap-2">
                 <Calendar className="w-4 h-4 text-luxury-gold" />
                 <span>{blog.published_at ? format(new Date(blog.published_at), 'MMMM d, yyyy') : 'Unpublished'}</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-600" />
              <div className="flex items-center gap-2">
                 <Clock className="w-4 h-4 text-luxury-gold" />
                 <span>{readTime} min read</span>
              </div>
          </div>
      </header>

      {/* Full Width Featured Image */}
      <div className="w-full relative aspect-[21/9] md:aspect-[2.4/1] overflow-hidden group border-y border-white/5">
          {blog.featured_image ? (
               // eslint-disable-next-line @next/next/no-img-element
               <img 
                 src={blog.featured_image} 
                 alt={blog.title}
                 className="w-full h-full object-cover transition-transform duration-1000 transform group-hover:scale-105"
               />
          ) : (
             <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                 <span className="text-gray-600 uppercase tracking-widest">No Image</span>
             </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-transparent to-black/90 pointer-events-none" />
      </div>

      {/* Content Container */}
      <article className="max-w-3xl mx-auto px-6 py-20 -mt-32 relative z-20">
          <div className="prose prose-lg prose-invert max-w-none
              prose-p:text-gray-300 prose-p:leading-[2] prose-p:mb-8 prose-p:text-lg
              prose-headings:font-serif prose-headings:text-white prose-headings:font-semibold prose-headings:mb-6 prose-headings:mt-12
              prose-h2:text-3xl prose-h2:text-luxury-gold/90
              prose-h3:text-2xl 
              prose-a:text-luxury-gold prose-a:underline-offset-4 hover:prose-a:text-white transition-colors
              prose-strong:text-white prose-strong:font-bold
              prose-li:marker:text-luxury-gold prose-ul:pl-6 prose-ul:space-y-2
              prose-blockquote:border-l-2 prose-blockquote:border-luxury-gold prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-2xl prose-blockquote:text-gray-400 prose-blockquote:font-serif
              prose-img:rounded-sm prose-img:shadow-2xl prose-img:border prose-img:border-white/5
          "
          dangerouslySetInnerHTML={{ __html: blog.content }}
          />
            
          {/* Tags Footer */}
          {blog.tags && blog.tags.length > 0 && (
              <div className="mt-20 pt-8 border-t border-white/10 flex flex-wrap gap-3">
                 {blog.tags.map((tag: string) => (
                     <span key={tag} className="text-sm text-gray-500 hover:text-luxury-gold transition-colors cursor-pointer">#{tag}</span>
                 ))}
              </div>
          )}
      </article>

      {/* Related Posts Placeholder for Preview */}
      <section className="py-20 bg-[#0A0A0F] border-t border-white/5 text-center">
          <p className="text-gray-600 italic">Related posts will appear here in the live version.</p>
      </section>
    </main>
  );
}
