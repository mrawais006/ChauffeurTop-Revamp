import { supabase } from '@/lib/supabase';
import { ServiceHero } from '@/components/services/ServiceHero';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { format } from 'date-fns';

export const revalidate = 60; // Revalidate every minute

export const metadata = {
  title: 'Our Blog | Chauffeur Top Melbourne',
  description: 'Latest news, travel tips, and insights from Melbourne\'s premier chauffeur service.',
  alternates: {
    canonical: 'https://chauffeurtop.com.au/blogs',
  },
};

export default async function BlogsPage() {
  // Trigger auto-publish for due posts
  await supabase.rpc('publish_due_posts');

  const { data: blogs } = await supabase
    .from('blogs')
    .select('*')
    .eq('status', 'published')
    .lte('published_at', new Date().toISOString())
    .order('published_at', { ascending: false });

  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <ServiceHero 
         title="Our Latest Stories"
         subtitle="Insights & Travel Tips"
         description="Discover the world of luxury travel, chauffeur guides, and Melbourne's hidden gems."
         backgroundImage="/images/blog-hero.png" // Generated luxury image
         overlay={true}
      />

      {/* Blog Grid */}
      <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-luxury-black to-black relative">
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto">
          {!blogs || blogs.length === 0 ? (
             <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-white/5 backdrop-blur-sm">
                <span className="text-4xl block mb-4">✍️</span>
                <h3 className="text-2xl font-serif text-white mb-2">No stories yet</h3>
                <p className="text-gray-400">Check back soon for our latest updates.</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <Link 
                  href={`/blogs/${blog.slug}`} 
                  key={blog.id}
                  className="group bg-gray-900/40 border border-white/5 rounded-xl overflow-hidden hover:border-luxury-gold/30 hover:shadow-2xl hover:shadow-luxury-gold/10 transition-all duration-500 flex flex-col h-full"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {blog.featured_image ? (
                      <Image 
                        src={blog.featured_image} 
                        alt={blog.title} 
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <span className="text-gray-600 text-sm font-medium tracking-widest uppercase">No Image</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    {blog.categories && blog.categories.length > 0 && (
                        <div className="absolute top-4 left-4">
                            <Badge className="bg-luxury-gold text-black hover:bg-white transition-colors border-none">
                                {blog.categories[0]}
                            </Badge>
                        </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-4 font-mono">
                       {blog.published_at && (
                          <div className="flex items-center gap-1.5">
                             <Calendar className="w-3.5 h-3.5 text-luxury-gold" />
                             {format(new Date(blog.published_at), 'MMM d, yyyy')}
                          </div>
                       )}
                       <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-luxury-gold" />
                          <span>{Math.ceil((blog.content?.split(/\s+/).length || 0) / 200)} min read</span>
                       </div>
                    </div>

                    <h2 className="text-xl md:text-2xl font-serif font-bold text-white mb-3 leading-tight group-hover:text-luxury-gold transition-colors">
                      {blog.title}
                    </h2>

                    <p className="text-gray-400 line-clamp-3 mb-6 text-sm flex-1 leading-relaxed">
                      {blog.excerpt || "Click to read the full story..."}
                    </p>

                    <div className="flex items-center text-luxury-gold text-sm font-bold tracking-wide uppercase mt-auto group-hover:translate-x-1 transition-transform">
                       Read Story <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
