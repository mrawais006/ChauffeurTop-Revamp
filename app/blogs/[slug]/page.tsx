import { supabase } from '@/lib/supabase';
import { ServiceHero } from '@/components/services/ServiceHero';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ArrowLeft, Clock } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getBlog(slug: string) {
  const { data, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error || !data) {
    return null;
  }
  return data;
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params;
  const blog = await getBlog(params.slug);
  if (!blog) {
    return { title: 'Blog Post Not Found | Chauffeur Top' };
  }
  return {
    title: `${blog.title} | Chauffeur Top Blog`,
    description: blog.excerpt || 'Read this article on Chauffeur Top.',
    openGraph: {
      title: blog.title,
      description: blog.excerpt || '',
      images: blog.featured_image ? [blog.featured_image] : [],
    },
  };
}

// Helper to get related posts
async function getRelatedPosts(currentSlug: string, category?: string) {
  let query = supabase
    .from('blogs')
    .select('id, title, slug, featured_image, published_at, categories')
    .eq('status', 'published')
    .neq('slug', currentSlug)
    .order('published_at', { ascending: false })
    .limit(4);

  // If category exists, try to filter by it (basic implementation)
  // Note: array filtering in Supabase via JS client can be tricky, 
  // relying on simple exclusion/ordering for now effectively gives "recent posts".
  
  const { data } = await query;
  return data || [];
}

import { ViewTracker } from '@/components/blog/ViewTracker';
import { Eye } from 'lucide-react';
import { RelatedPosts } from '@/components/blog/RelatedPosts';

// ...

export default async function BlogPostPage(props: PageProps) {
  const params = await props.params;
  const blog = await getBlog(params.slug);

  if (!blog) {
    notFound();
  }

  // Auto-publish check for direct access (optional doubly safety)
  if (blog.status === 'scheduled' && new Date(blog.published_at!) <= new Date()) {
      // In a real server component we might trigger an update, but rely on the RPC calls in listing pages/admin for now to avoid write-on-read complexity here.
  }

  const relatedPosts = await getRelatedPosts(params.slug, blog.categories?.[0]);

  // Calculate read time
  const wordCount = blog.content?.split(/\s+/).length || 0;
  const readTime = Math.ceil(wordCount / 200);

  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-luxury-gold selection:text-black">
      <ViewTracker blogId={blog.id} />
      
      {/* Header Section */}
      <header className="pt-32 pb-16 px-4 md:px-8 text-center max-w-5xl mx-auto relative z-10">
          {blog.categories && blog.categories.length > 0 && (
              <Badge variant="outline" className="mb-6 border-none bg-transparent text-luxury-gold px-0 py-1 text-sm tracking-widest uppercase hover:bg-transparent cursor-default">
                  {blog.categories[0]}
              </Badge>
          )}
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-serif font-bold text-white mb-8 leading-[1.1] tracking-tight">
              {blog.title}
          </h1>

          {/* Excerpt - Added as requested */}
          {blog.excerpt && (
              <p className="text-xl md:text-2xl text-gray-400 mb-10 font-serif italic max-w-3xl mx-auto leading-relaxed">
                  {blog.excerpt}
              </p>
          )}

          <div className="flex items-center justify-center gap-6 text-sm md:text-base text-gray-400 font-medium tracking-wide">
              <div className="flex items-center gap-2">
                 <Calendar className="w-4 h-4 text-luxury-gold" />
                 <span>{format(new Date(blog.published_at!), 'MMMM d, yyyy')}</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-600" />
              <div className="flex items-center gap-2">
                 <Clock className="w-4 h-4 text-luxury-gold" />
                 <span>{readTime} min read</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-gray-600" />
               <div className="flex items-center gap-2">
                 <Eye className="w-4 h-4 text-luxury-gold" />
                 <span>{blog.views || 0} views</span>
              </div>
          </div>
      </header>

      {/* Full Width Featured Image */}
      <div className="w-full relative aspect-[21/9] md:aspect-[2.4/1] overflow-hidden group">
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
          dangerouslySetInnerHTML={{ __html: blog.content || '' }}
          />

          {/* Tags Footer */}
          {blog.tags && blog.tags.length > 0 && (
              <div className="mt-20 pt-8 border-t border-white/10 flex flex-wrap gap-3">
                 {blog.tags.map((tag: string) => (
                     <span key={tag} className="text-sm text-gray-500 hover:text-luxury-gold transition-colors cursor-pointer">#{tag}</span>
                 ))}
              </div>
          )}
          
          <div className="mt-12 text-center">
              <Link href="/blogs">
                 <Button variant="outline" className="border-white/20 text-white hover:bg-white hover:text-black rounded-full px-8 h-12">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Stories
                 </Button>
              </Link>
          </div>
      </article>

      {/* Related Posts Section */}
      {/* Related Posts Section */}
      <RelatedPosts currentSlug={params.slug} category={blog.categories?.[0]} />
    </main>
  );
}
